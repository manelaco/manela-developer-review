import { NextApiRequest, NextApiResponse } from 'next';

interface PolicyGenerationRequest {
  userType: 'employee' | 'hr_manager';
  employeeData: {
    fullName: string;
    province: 'Quebec (QPIP)' | 'Ontario (EI)';
    employmentStatus: string;
    leaveType: string;
    employmentStartDate: string;
    salaryRange: string;
    leaveStartDate: string;
    currentTerm: string;
    insuranceProvider?: string;
    shortTermDisability?: string;
    companyTopUp?: string;
    policyNumber?: string;
  };
  uploadedDocuments?: string[]; // File URLs from previous uploads
}

interface PolicyGenerationResponse {
  success: boolean;
  policy?: {
    customPolicy: string;
    supportingDocumentation: string;
    employeeGuidance: string;
    benefitBreakdown: {
      qpipMaternity?: { amount: number; weeks: number };
      qpipParental?: { amount: number; weeks: number };
      eiMaternity?: { amount: number; weeks: number };
      eiParental?: { amount: number; weeks: number };
      companyTopUp?: { amount: number; percentage: number };
      totalWeekly: number;
    };
    timeline: {
      employmentStart: string;
      leaveStart: string;
      maternityWeeks: number;
      parentalWeeks: number;
      totalWeeks: number;
    };
    nextSteps: string[];
  };
  error?: string;
}

// Helper function to determine benefits based on province
function calculateBenefits(province: string, salaryRange: string, companyTopUp?: string) {
  const isQuebec = province.includes('Quebec');
  
  // Extract salary midpoint (simplified calculation)
  const salaryMatch = salaryRange.match(/\$([0-9,]+)/g);
  const avgSalary = salaryMatch ? 
    (parseInt(salaryMatch[0].replace(/[$,]/g, '')) + parseInt(salaryMatch[1]?.replace(/[$,]/g, '') || salaryMatch[0].replace(/[$,]/g, ''))) / 2 : 
    65000;
  
  const weeklySalary = avgSalary / 52;
  
  if (isQuebec) {
    // QPIP calculations (Quebec)
    const qpipMaxWeekly = 1018; // 2024 QPIP maximum
    const qpipRate = 0.70; // 70% of salary
    const weeklyBenefit = Math.min(weeklySalary * qpipRate, qpipMaxWeekly);
    
    return {
      qpipMaternity: { amount: Math.round(weeklyBenefit), weeks: 18 },
      qpipParental: { amount: Math.round(weeklyBenefit), weeks: 32 },
      totalWeekly: Math.round(weeklyBenefit),
      maternityWeeks: 18,
      parentalWeeks: 32,
      totalWeeks: 50
    };
  } else {
    // EI calculations (Ontario and other provinces)
    const eiMaxWeekly = 668; // 2024 EI maximum
    const eiRate = 0.55; // 55% of salary
    const weeklyBenefit = Math.min(weeklySalary * eiRate, eiMaxWeekly);
    
    return {
      eiMaternity: { amount: Math.round(weeklyBenefit), weeks: 15 },
      eiParental: { amount: Math.round(weeklyBenefit), weeks: 35 },
      totalWeekly: Math.round(weeklyBenefit),
      maternityWeeks: 15,
      parentalWeeks: 35,
      totalWeeks: 50
    };
  }
}

// AI Prompt for policy generation
function createPolicyPrompt(data: PolicyGenerationRequest['employeeData'], benefits: any, uploadedDocuments?: string[]) {
  const documentContext = uploadedDocuments?.length ? 
    `\n\nUploaded insurance documents: ${uploadedDocuments.join(', ')}` : '';
  
  return `You are MANELA, a Canadian parental leave policy expert. Generate a comprehensive, personalized parental leave policy based on this information:

EMPLOYEE DETAILS:
- Name: ${data.fullName}
- Province: ${data.province}
- Employment Status: ${data.employmentStatus}
- Leave Type: ${data.leaveType}
- Employment Start: ${data.employmentStartDate}
- Salary Range: ${data.salaryRange}
- Leave Start Date: ${data.leaveStartDate}
- Pregnancy Term: ${data.currentTerm}
- Insurance Provider: ${data.insuranceProvider || 'Not provided'}
- Company Top-up: ${data.companyTopUp || 'Not provided'}${documentContext}

CALCULATED BENEFITS:
${JSON.stringify(benefits, null, 2)}

Generate THREE distinct sections:

1. CUSTOM_POLICY: A detailed, personalized leave policy including:
   - Benefit calculations and timeline
   - What the employee is entitled to vs not entitled to
   - Provincial-specific requirements (QPIP vs EI)
   - Company policy integration
   - Important dates and deadlines

2. SUPPORTING_DOCUMENTATION: Government forms, checklists, and required documentation:
   - Application forms needed
   - Required documents list
   - Application deadlines
   - Provincial compliance requirements

3. EMPLOYEE_GUIDANCE: Emotional support and practical guidance:
   - Return-to-work planning
   - Financial planning tips
   - Emotional support resources
   - Childcare considerations

Format each section clearly with headers and bullet points. Be specific to ${data.province} regulations.`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PolicyGenerationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { userType, employeeData, uploadedDocuments }: PolicyGenerationRequest = req.body;

    // Validate required fields
    if (!employeeData.fullName || !employeeData.province || !employeeData.leaveType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required employee information' 
      });
    }

    console.log('🔄 Generating policy for:', employeeData.fullName);

    // Calculate benefits
    const benefits = calculateBenefits(
      employeeData.province, 
      employeeData.salaryRange, 
      employeeData.companyTopUp
    );

    // Create AI prompt
    const prompt = createPolicyPrompt(employeeData, benefits, uploadedDocuments);

    // Choose AI provider based on environment or preference
    const useOpenRouter = process.env.OPENROUTER_API_KEY;
    const useAnthropic = process.env.ANTHROPIC_API_KEY;

    let aiResponse: string;

    if (useOpenRouter) {
      // OpenRouter API call
      console.log('🤖 Using OpenRouter for policy generation...');
      
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'MANELA Policy Generator'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet', // or your preferred model
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.3 // Lower temperature for more consistent policy generation
        })
      });

      if (!openRouterResponse.ok) {
        throw new Error(`OpenRouter API error: ${openRouterResponse.statusText}`);
      }

      const openRouterData = await openRouterResponse.json();
      aiResponse = openRouterData.choices[0].message.content;

    } else if (useAnthropic) {
      // Direct Anthropic API call
      console.log('🤖 Using Anthropic for policy generation...');
      
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          temperature: 0.3,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!anthropicResponse.ok) {
        throw new Error(`Anthropic API error: ${anthropicResponse.statusText}`);
      }

      const anthropicData = await anthropicResponse.json();
      aiResponse = anthropicData.content[0].text;

    } else {
      throw new Error('No AI API keys configured');
    }

    // Parse AI response into sections (you may need to adjust based on actual AI output format)
    const sections = parseAIResponse(aiResponse);

    // Create policy response
    const policy = {
      customPolicy: sections.customPolicy,
      supportingDocumentation: sections.supportingDocumentation,
      employeeGuidance: sections.employeeGuidance,
      benefitBreakdown: benefits,
      timeline: {
        employmentStart: employeeData.employmentStartDate,
        leaveStart: employeeData.leaveStartDate,
        maternityWeeks: benefits.maternityWeeks,
        parentalWeeks: benefits.parentalWeeks,
        totalWeeks: benefits.totalWeeks
      },
      nextSteps: extractNextSteps(sections.employeeGuidance)
    };

    console.log('✅ Policy generated successfully');

    // TODO: Save policy to database based on userType
    // if (userType === 'employee') {
    //   // Save to employee_policies table
    // } else {
    //   // Save to hr_policies table
    // }

    res.status(200).json({
      success: true,
      policy
    });

  } catch (error) {
    console.error('❌ Policy generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

// Helper function to parse AI response into sections
function parseAIResponse(response: string) {
  const sections = {
    customPolicy: '',
    supportingDocumentation: '',
    employeeGuidance: ''
  };

  // Split response by section headers (adjust regex based on AI output format)
  const customPolicyMatch = response.match(/CUSTOM_POLICY:(.*?)(?=SUPPORTING_DOCUMENTATION:|$)/s);
  const supportingDocsMatch = response.match(/SUPPORTING_DOCUMENTATION:(.*?)(?=EMPLOYEE_GUIDANCE:|$)/s);
  const guidanceMatch = response.match(/EMPLOYEE_GUIDANCE:(.*?)$/s);

  if (customPolicyMatch) sections.customPolicy = customPolicyMatch[1].trim();
  if (supportingDocsMatch) sections.supportingDocumentation = supportingDocsMatch[1].trim();
  if (guidanceMatch) sections.employeeGuidance = guidanceMatch[1].trim();

  return sections;
}

// Helper function to extract next steps from guidance section
function extractNextSteps(guidance: string): string[] {
  // Extract bullet points or numbered list items
  const steps = guidance.match(/[-•*]\s+(.+)/g) || 
                guidance.match(/\d+\.\s+(.+)/g) || 
                [];
  
  return steps.map(step => step.replace(/^[-•*\d+.\s]+/, '').trim()).slice(0, 5);
} 