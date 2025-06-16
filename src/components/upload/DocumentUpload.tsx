import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';

export default function DocumentUpload() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadResult(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      // Temporarily using a test company ID for upload testing
      formData.append('company_id', 'a7c74010-6c2c-4410-b671-cda7b3d640c4');
      
      console.log('Uploading file:', selectedFile.name);
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        setUploadResult('Document uploaded and processed successfully! Redirecting to employee form...');
        setSelectedFile(null);
        
        // Redirect to employee form with extracted data
        router.push({
          pathname: '/employee/create',
          query: { 
            extractedData: JSON.stringify(result.extractedData),
            documentId: result.documentId
          }
        });
      } else {
        const error = await response.text();
        console.error('Upload failed:', response.status, error);
        setUploadResult(`Upload failed: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult('Upload error. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Upload Insurance Document</h2>
      <p className="text-gray-600 mb-6">Upload your insurance documents for AI-powered analysis</p>
      
      <div className="space-y-6">
        {/* Drag & Drop Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : selectedFile
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop your insurance document here...</p>
            ) : selectedFile ? (
              <p className="text-green-600 font-medium">File selected: {selectedFile.name}</p>
            ) : (
              <p className="text-gray-600">Drag and drop your insurance document here, or click to select</p>
            )}
            <p className="text-sm text-gray-500">Supported formats: PDF, PNG, JPG (max 10MB)</p>
          </div>
        </div>
        
        {/* Selected File Info */}
        {selectedFile && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected File:</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900 font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {Math.round(selectedFile.size / 1024)} KB • {selectedFile.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
        
        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium
                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors duration-200"
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Document...
            </div>
          ) : (
            'Upload & Process Document'
          )}
        </button>

        {/* Upload Result */}
        {uploadResult && (
          <div className={`p-4 rounded-lg ${
            uploadResult.includes('successful') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {uploadResult}
          </div>
        )}
      </div>
    </div>
  );
} 