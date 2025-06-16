import React from 'react';
import { useRouter } from 'next/router';

export default function EmployeePortal() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Employee Portal
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
              <p className="text-gray-600 mb-4">
                Upload your insurance documents for AI processing
              </p>
              <button
                onClick={() => router.push('/employee/upload')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Upload
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">My Leave Plan</h2>
              <p className="text-gray-600 mb-4">
                View your personalized parental leave timeline
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                View Timeline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 