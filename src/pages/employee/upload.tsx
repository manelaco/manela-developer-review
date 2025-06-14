import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DocumentUpload from '@/components/upload/DocumentUpload';
import { useAuth } from '@/contexts/AuthContext';

const EmployeeUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUploadComplete = (files: File[]) => {
    // Handle successful upload
    console.log('Uploaded files:', files);
    // You can navigate back to the portal or show a success message
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => navigate('/employee/portal')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Upload Documents</h1>
          <DocumentUpload onUploadComplete={handleUploadComplete} />
        </div>
      </main>
    </div>
  );
};

export default EmployeeUpload; 