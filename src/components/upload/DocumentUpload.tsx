import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { viewedCompanyId } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!viewedCompanyId) {
      toast.error('No company selected');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('company_id', viewedCompanyId);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      toast.success('Document uploaded successfully');
      console.log('Upload result:', result);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [viewedCompanyId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading || !viewedCompanyId
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Insurance Document</CardTitle>
        <CardDescription>
          Upload your insurance documents for AI-powered analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="space-y-2">
              <p>Uploading...</p>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <div className="space-y-2">
              <p>Drag and drop your insurance document here, or click to select</p>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, PNG, JPG (max 10MB)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 