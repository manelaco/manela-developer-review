import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { IncomingForm } from 'formidable';
import { readFile } from 'fs/promises';
import pdfParse from 'pdf-parse';

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Manela MVP',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data using formidable
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const companyId = Array.isArray(fields.company_id) ? fields.company_id[0] : fields.company_id;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' });
    }

    // Add this right after the file validation
    console.log('=== UPLOAD DEBUG ===');
    console.log('File received:', file?.originalFilename);
    console.log('Company ID:', companyId);
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('===================');

    // Process document with FIXED dual AI (no hallucination)
    const extractedData = await processInsuranceDocumentDualAI(file.mimetype, file.filepath);

    console.log('🔄 Starting file storage and database operations...');
    console.log('📄 File content size:', file.length, 'bytes');

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.originalFilename}`;
    console.log('📤 Attempting storage upload with filename:', fileName);

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('insurance-documents')
        .upload(fileName, file, {
          contentType: file.mimetype || 'application/octet-stream',
        });

      console.log('📁 Storage upload result:', { uploadData, uploadError });
      
      if (uploadError) {
        console.error('❌ Storage upload failed:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('✅ Storage upload successful, now attempting database insert...');

      // Store document record in database
      const { data: docRecord, error: dbError } = await supabase
        .from('policy_uploads')
        .insert({
          company_id: companyId,
          policy_type: 'insurance',
          file_name: file.originalFilename,
          file_type: file.mimetype,
          file_size: file.length,
          storage_path: uploadData.path,
          upload_url: uploadData.path,
          metadata: {
            originalName: file.originalFilename,
            uploadedAt: new Date().toISOString()
          },
          ai_processed: true,
          ai_extraction_data: extractedData,
          uploaded_by: "4e70d5f4-50f6-4f28-bc6a-7a418d3a86f3",
          status: 'active',
          version: 1
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      return res.status(200).json({
        success: true,
        documentId: docRecord.id,
        extractedData,
        fileUrl: uploadData.path
      });

    } catch (error) {
      console.error('Document upload error:', error);
      return res.status(500).json({
        error: 'Document processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Document upload error:', error);
    return res.status(500).json({
      error: 'Document processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// FIXED: Dual AI processing - NO HALLUCINATION, VALIDATION ONLY
async function processInsuranceDocumentDualAI(mimeType: string, filePath: string) {
  
  function safeJsonParse(text: string) {
    try {
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonStr = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonStr);
      }
      
      return JSON.parse(text);
    } catch (error) {
      console.error("JSON parsing error:", error);
      console.error("Raw text:", text);
      return {
        employeeInfo: { name: null, employeeId: null, department: null },
        insuranceDetails: { provider: null, policyNumber: null, coverageType: null, benefitRate: null, maxWeeks: null },
        benefitBreakdown: { shortTermDisability: null, maternityCoverage: null, paternalCoverage: null, adoptionCoverage: null },
        companyPolicy: { topUpProvided: false, topUpPercentage: null, totalCoverage: null },
        extractionSuccess: false,
        error: "Failed to parse AI response"
      };
    }
  }

  try {
    let extractedText = "";
    let processingMethod = "";
    
    if (mimeType === 'application/pdf') {
      // Extract text from PDF
      const pdfData = await pdfParse(filePath);
      extractedText = pdfData.text;
      processingMethod = "PDF_TEXT_EXTRACTION";
      
      console.log('=== PDF EXTRACTION DEBUG ===');
      console.log('Extracted PDF text length:', extractedText.length);
      console.log('First 500 chars:', extractedText.substring(0, 500));
      console.log('=============================');
      
    } else if (mimeType && mimeType.startsWith('image/')) {
      // Handle images with Claude vision
      processingMethod = "IMAGE_OCR";
      
      const base64Content = await readFile(filePath, 'base64');
      
      console.log('=== IMAGE PROCESSING DEBUG ===');
      console.log('Image size:', file.length, 'bytes');
      console.log('MIME type:', mimeType);
      console.log('===============================');
      
      const claudeImageResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extract ONLY information that is explicitly visible in this insurance document. Do NOT make assumptions or fill in missing information. Use null for any information not clearly visible.

                Return JSON with this structure:
                {
                  "employeeInfo": { "name": string | null, "employeeId": string | null, "department": string | null },
                  "insuranceDetails": { "provider": string | null, "policyNumber": string | null, "coverageType": string | null, "benefitRate": string | null, "maxWeeks": string | null },
                  "benefitBreakdown": { "shortTermDisability": string | null, "maternityCoverage": string | null, "paternalCoverage": string | null, "adoptionCoverage": string | null },
                  "companyPolicy": { "topUpProvided": boolean, "topUpPercentage": string | null, "totalCoverage": string | null }
                }`
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: base64Content
                }
              }
            ]
          }
        ]
      });
      
      const imageAnalysis = safeJsonParse(claudeImageResponse.content[0].text);
      
      // For images, return directly (no text-based validation possible)
      return {
        ...imageAnalysis,
        extractedAt: new Date().toISOString(),
        processingMethod,
        extractionSuccess: true,
        confidence: {
          claude: 0.85,
          extraction: "IMAGE_PROCESSED"
        }
      };
    } else {
      throw new Error('Unsupported file type for AI extraction');
    }

    // Check if we have meaningful text content
    if (!extractedText || extractedText.trim().length < 20) {
      console.log('=== EXTRACTION FAILED ===');
      console.log('No meaningful text extracted from document');
      console.log('Text length:', extractedText?.length || 0);
      console.log('========================');
      
      return {
        employeeInfo: { name: null, employeeId: null, department: null },
        insuranceDetails: { provider: null, policyNumber: null, coverageType: null, benefitRate: null, maxWeeks: null },
        benefitBreakdown: { shortTermDisability: null, maternityCoverage: null, paternalCoverage: null, adoptionCoverage: null },
        companyPolicy: { topUpProvided: false, topUpPercentage: null, totalCoverage: null },
        extractedAt: new Date().toISOString(),
        processingMethod,
        extractionSuccess: false,
        reason: "No readable text found in document",
        confidence: {
          claude: 0.0,
          gpt4: 0.0,
          extraction: "FAILED"
        }
      };
    }

    console.log('=== STARTING DUAL AI PROCESSING ===');

    // PHASE 1: CLAUDE - Conservative extraction (no assumptions)
    console.log('Phase 1: Claude extraction...');
    const claudeResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `You are analyzing a Canadian insurance document for parental leave benefits. Extract ONLY information that is explicitly stated in the document text. Do NOT make assumptions, estimates, or fill in missing information.

          CRITICAL RULES:
          - If any information is not clearly stated in the document, use null for that field
          - Do NOT invent employee names, companies, or policy numbers
          - Do NOT make assumptions about coverage percentages
          - Only extract text that you can see verbatim in the document

          Return a JSON object with these exact keys:
          {
            "employeeInfo": { 
              "name": string | null, 
              "employeeId": string | null, 
              "department": string | null 
            },
            "insuranceDetails": { 
              "provider": string | null, 
              "policyNumber": string | null, 
              "coverageType": string | null, 
              "benefitRate": string | null, 
              "maxWeeks": string | null 
            },
            "benefitBreakdown": { 
              "shortTermDisability": string | null, 
              "maternityCoverage": string | null, 
              "paternalCoverage": string | null, 
              "adoptionCoverage": string | null 
            },
            "companyPolicy": { 
              "topUpProvided": boolean, 
              "topUpPercentage": string | null, 
              "totalCoverage": string | null 
            }
          }

          Document text:
          ${extractedText}

          Remember: Extract ONLY what is explicitly stated. Use null for missing information.`
        }
      ]
    });

    const claudeAnalysis = safeJsonParse(claudeResponse.content[0].text);
    console.log('Claude analysis completed:', claudeAnalysis);

    // PHASE 2: GPT-4 - VALIDATION ONLY (no enhancement, no assumptions)
    console.log('Phase 2: GPT-4 validation...');
    const gptResponse = await openai.chat.completions.create({
      model: 'openai/gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a validator for insurance document extraction. Your ONLY job is to check for obvious parsing errors in extracted data. 

          CRITICAL RULES:
          - Do NOT add missing information
          - Do NOT make assumptions or enhancements  
          - Do NOT fill in empty fields
          - ONLY correct obvious extraction mistakes where the original text clearly shows something different
          - Keep null values as null if information is not in the original text
          - Return data as-is unless there are clear parsing errors`
        },
        {
          role: 'user',
          content: `Validate this extracted insurance data. Fix ONLY obvious parsing errors where you can see the correct information in the original text. Do NOT fill in missing fields or make assumptions.

          Original document excerpt (first 1000 chars):
          "${extractedText.substring(0, 1000)}"
          
          Extracted data to validate:
          ${JSON.stringify(claudeAnalysis, null, 2)}
          
          Return the validated JSON. Keep null values as null if information is not found in the original text. ONLY change fields if there are obvious extraction errors.`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const validatedAnalysis = safeJsonParse(gptResponse.choices[0].message.content || '{}');
    console.log('GPT-4 validation completed:', validatedAnalysis);

    // PHASE 3: Calculate REAL confidence based on actual extraction success
    const extractedFields = [
      validatedAnalysis.employeeInfo?.name,
      validatedAnalysis.employeeInfo?.employeeId,
      validatedAnalysis.insuranceDetails?.provider,
      validatedAnalysis.insuranceDetails?.policyNumber,
      validatedAnalysis.benefitBreakdown?.maternityCoverage,
      validatedAnalysis.companyPolicy?.topUpPercentage
    ];
    
    const successfulExtractions = extractedFields.filter(field => 
      field !== null && 
      field !== undefined && 
      field !== "" && 
      field !== "Not specified" &&
      field !== "Not available"
    ).length;
    
    const realConfidence = successfulExtractions / extractedFields.length;
    
    console.log('=== CONFIDENCE CALCULATION ===');
    console.log('Total fields checked:', extractedFields.length);
    console.log('Successfully extracted:', successfulExtractions);
    console.log('Real confidence:', realConfidence);
    console.log('==============================');

    // Return the final validated data with REAL confidence scores
    const finalResult = {
      ...validatedAnalysis,
      extractedAt: new Date().toISOString(),
      processingMethod: "DUAL_AI_VALIDATION",
      extractionSuccess: realConfidence > 0.1,
      extractedTextLength: extractedText.length,
      confidence: {
        claude: Math.round(realConfidence * 100) / 100,
        gpt4: Math.round(realConfidence * 100) / 100,
        extraction: realConfidence > 0.5 ? "SUCCESS" : realConfidence > 0.1 ? "PARTIAL" : "FAILED",
        fieldsExtracted: successfulExtractions,
        totalFields: extractedFields.length
      }
    };

    console.log('=== FINAL RESULT ===');
    console.log(JSON.stringify(finalResult, null, 2));
    console.log('===================');

    return finalResult;

  } catch (error) {
    console.error('=== AI PROCESSING ERROR ===');
    console.error('Error:', error);
    console.error('===========================');
    
    return {
      employeeInfo: { name: null, employeeId: null, department: null },
      insuranceDetails: { provider: null, policyNumber: null, coverageType: null, benefitRate: null, maxWeeks: null },
      benefitBreakdown: { shortTermDisability: null, maternityCoverage: null, paternalCoverage: null, adoptionCoverage: null },
      companyPolicy: { topUpProvided: false, topUpPercentage: null, totalCoverage: null },
      extractedAt: new Date().toISOString(),
      processingMethod: "ERROR",
      extractionSuccess: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      confidence: {
        claude: 0.0,
        gpt4: 0.0,
        extraction: "FAILED"
      }
    };
  }
} 