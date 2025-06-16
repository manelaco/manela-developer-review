import React from 'react';
import { useRouter } from 'next/router';
import ParentalLeaveForm from '@/components/dashboard/ParentalLeaveForm';

export default function CreateEmployee() {
  const router = useRouter();
  const { extractedData, documentId } = router.query;

  // Parse the extracted data from the query parameters
  const parsedData = extractedData ? JSON.parse(extractedData as string) : null;

  const handleSubmit = async (data: any) => {
    try {
      // Add the document ID to the submission data
      const submissionData = {
        ...data,
        document_id: documentId,
      };

      // TODO: Add API call to save employee data
      console.log('Submitting employee data:', submissionData);
      
      // Redirect to employee portal after successful submission
      router.push('/employee/portal');
    } catch (error) {
      console.error('Error submitting employee data:', error);
    }
  };

  const handleCancel = () => {
    router.push('/employee/portal');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ParentalLeaveForm
          aiData={parsedData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
} 