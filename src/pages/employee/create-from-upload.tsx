import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ParentalLeaveForm from '@/components/dashboard/ParentalLeaveForm';
import { toast } from 'sonner';

export default function CreateFromUploadPage() {
  const router = useRouter();
  const [aiData, setAiData] = useState(null);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get AI extraction data from localStorage
    const pendingData = localStorage.getItem('pending_employee_data');
    
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        setAiData(parsed.aiData);
        setUploadInfo({
          uploadId: parsed.uploadId,
          fileName: parsed.fileName
        });
        
        // Clear the data from localStorage
        localStorage.removeItem('pending_employee_data');
      } catch (error) {
        console.error('Error parsing pending employee data:', error);
        toast.error('Error loading AI extraction data');
      }
    } else {
      // No pending data, redirect to upload
      toast.error('No upload data found. Please upload a document first.');
      router.push('/employee/upload');
      return;
    }
    
    setLoading(false);
  }, [router]);

  const handleSubmit = async (formData: any) => {
    console.log('Creating employee with data:', formData);
    
    try {
      const response = await fetch('/api/employees/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          upload_id: uploadInfo?.uploadId,
          company_id: 'a7c74010-6c2c-4410-b671-cda7b3d640c4', // Demo company
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Employee created successfully!');
        
        // Redirect to policy generation or employee list
        router.push(`/employee/policy-preview/${result.employee_id}`);
      } else {
        const error = await response.text();
        toast.error(`Failed to create employee: ${error}`);
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Error creating employee. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/employee/upload');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI extraction data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Employee Profile</h1>
          <p className="text-gray-600 mt-2">
            {uploadInfo?.fileName && (
              <>Based on uploaded document: <span className="font-medium">{uploadInfo.fileName}</span></>
            )}
          </p>
        </div>

        {/* AI Data Summary */}
        {aiData && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">AI Extraction Summary</h3>
            <div className="text-sm text-blue-800">
              <p>✓ Document processed successfully</p>
              <p>✓ Insurance and benefit information extracted</p>
              <p>→ Please review and complete any missing fields below</p>
            </div>
          </div>
        )}

        {/* Form */}
        <ParentalLeaveForm
          aiData={aiData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
} 