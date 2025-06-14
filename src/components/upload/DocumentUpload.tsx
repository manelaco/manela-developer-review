import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, FileText, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentUploadProps {
  onUploadComplete?: (files: File[]) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user, viewedCompanyId } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    if (!viewedCompanyId) {
      toast.error('Company ID is required for document upload');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('company_id', viewedCompanyId);

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || result.details || 'Upload failed');
        }
        
        if (result.extractedData) {
          toast.success('Insurance document processed successfully', {
            description: 'AI has extracted the relevant information from your document.'
          });
        }

        // Update progress
        setProgress(prev => prev + (100 / files.length));
      }

      onUploadComplete?.(files);
      setFiles([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload files';
      toast.error(errorMessage);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Insurance Documents</CardTitle>
          <CardDescription>
            Upload your insurance documents for AI-powered processing. Supported formats: PDF, Images, DOC, DOCX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-manela bg-manela/5' : 'border-gray-300 hover:border-manela'}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-manela">Drop the files here...</p>
            ) : (
              <p>Drag and drop files here, or click to select files</p>
            )}
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Selected Files:</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {uploading && (
                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2">Uploading and processing... {Math.round(progress)}%</p>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={uploading || !viewedCompanyId}
                className="w-full mt-4"
              >
                {uploading ? 'Processing...' : 'Upload and Process'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload; 