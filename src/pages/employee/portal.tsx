import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, MessageCircle, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EmployeePortal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUploadClick = () => {
    navigate('/employee/upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Employee Portal</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleUploadClick}>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-manela bg-opacity-10 flex items-center justify-center text-manela mb-4">
                <Upload className="h-6 w-6" />
              </div>
              <CardTitle>Document Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload and manage your leave-related documents
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-manela bg-opacity-10 flex items-center justify-center text-manela mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <CardTitle>Leave Status</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                View your current leave status and upcoming dates
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-manela bg-opacity-10 flex items-center justify-center text-manela mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access guides and resources for your leave period
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-manela bg-opacity-10 flex items-center justify-center text-manela mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get help and support during your leave period
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EmployeePortal; 