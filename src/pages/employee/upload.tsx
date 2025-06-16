import React, { useState, useRef } from 'react';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { motion } from 'framer-motion';

const inter = Inter({ subsets: ['latin'] });

// Lucide React Icons (fine line style)
const CloudUploadIcon = ({ className = '', ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DocumentIcon = ({ className = '', ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CheckCircleIcon = ({ className = '', ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileTextIcon = ({ className = '', ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} points="14,2 14,8 20,8" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} x1="16" y1="13" x2="8" y2="13" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} x1="16" y1="17" x2="8" y2="17" />
    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} points="10,9 9,9 8,9" />
  </svg>
);

// Add icons for Supporting Documentation and Employee Guidance
const UsersIcon = ({ className = '', ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7a4 4 0 11-8 0 4 4 0 018 0zm6 6a4 4 0 00-3-3.87" />
  </svg>
);
const BookOpenIcon = ({ className = '', ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20h9M12 4v16m0-16H3m9 0v16" />
  </svg>
);

// Design System Foundation
const colors = {
  primary: '#933A18',
  secondary: '#2D30E1',
  success: '#0CAF60',
  warning: '#FAC219',
  error: '#F75555',
  info: '#1487F5',
  help: '#C97FEC',
  gray: {
    50: '#FAFAFA',
    100: '#F7F8FC',
    200: '#F5F5F5',
    300: '#E2E8F0',
    400: '#CBD5E0',
    500: '#A0AEC0',
    600: '#718096',
    700: '#4A5568',
    800: '#2D3748',
    900: '#1A202C'
  },
  white: '#FFFFFF',
  pinkCream: '#FFF6F4',
  sage: '#DB9960',
  black: '#000000'
};

// Reusable Components
const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 font-['Manrope']";
  const variants = {
    primary: `bg-[#933A18] hover:bg-[#7A2F12] text-white focus:ring-[#933A18]`,
    secondary: `bg-[${colors.secondary}] hover:bg-[#1E1F9C] text-white focus:ring-blue-500`,
    outline: `border border-[#DDDDDD] bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500`
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const FormField = ({ label, children, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 font-['Manrope']">
      {label}
    </label>
    {children}
  </div>
);

const Select = ({ value, onChange, options, className = '', ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-3 text-sm border border-[#DDDDDD] rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent font-['Manrope'] ${className}`}
    {...props}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-3 text-sm border border-[#DDDDDD] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-['Manrope'] ${className}`}
    {...props}
  />
);

const ProgressBar = ({ progress, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-green-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Upload Component
const DocumentUpload = ({ onFileUpload, uploadedFiles, uploadProgress }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-orange-400 bg-orange-50' 
            : 'border-gray-300 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2 font-['Manrope']">
          Drag & drop files or browse
        </p>
        <p className="text-xs text-gray-500 mb-4 font-['Manrope']">
          .docx, .doc, .pdf
        </p>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept=".pdf,.doc,.docx,.jpg,.png"
        />
      </div>

      {/* Upload Button */}
      <Button 
        variant="primary" 
        className="w-full"
        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
      >
        upload documents
      </Button>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <DocumentIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 font-['Manrope']">
                    {file.name}
                  </p>
                  {file.status === 'uploading' && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500 mb-1 font-['Manrope']">Uploading</p>
                      <ProgressBar progress={uploadProgress} />
                    </div>
                  )}
                  {file.status === 'uploaded' && (
                    <div className="flex items-center mt-1">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                      <p className="text-xs text-green-600 font-['Manrope']">Uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Add Lucide/outline icons for sidebar
const UserIcon = ({ className = '', ...props }) => (
  <svg className={className} {...props} fill="none" stroke="#933A18" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
  </svg>
);
const BriefcaseIcon = ({ className = '', ...props }) => (
  <svg className={className} {...props} fill="none" stroke="#A0AEC0" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 3v4M8 3v4M2 13h20" />
  </svg>
);
const TimerIcon = ({ className = '', ...props }) => (
  <svg className={className} {...props} fill="none" stroke="#A0AEC0" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="15" r="7" />
    <path d="M12 15v-4M12 3v2" />
  </svg>
);

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    {/* Header skeleton */}
    <div className="space-y-3">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    
    {/* Content blocks skeleton */}
    <div className="space-y-4">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-4/5"></div>
    </div>
    
    {/* Table-like skeleton */}
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="h-5 bg-gray-300 rounded w-1/3"></div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
    </div>
  </div>
);

// Policy Skeleton Loader Component
const PolicySkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    {/* Policy Summary Header */}
    <div className="space-y-3">
      <div className="h-7 bg-gray-300 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    
    {/* Benefit Breakdown Section */}
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Leave Timeline Section */}
    <div>
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-3"></div>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
    
    {/* Next Steps Section */}
    <div>
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-3"></div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
);

// Generated Policy Content Component
const GeneratedPolicyContent = ({ policy, activeTab }) => {
  if (!policy) return null;

  if (activeTab === 'Custom Policy') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Parental Leave Policy Summary</h3>
          <p className="text-sm text-gray-600 mb-4">Based on your information, here's your personalized parental leave policy.</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Benefit Breakdown</h4>
          <div className="space-y-2 text-sm">
            {policy.benefitBreakdown.qpipMaternity && (
              <div className="flex justify-between">
                <span className="text-gray-600">QPIP Maternity Benefits:</span>
                <span className="font-medium">${policy.benefitBreakdown.qpipMaternity.amount}/week ({policy.benefitBreakdown.qpipMaternity.weeks} weeks)</span>
              </div>
            )}
            {policy.benefitBreakdown.qpipParental && (
              <div className="flex justify-between">
                <span className="text-gray-600">QPIP Parental Benefits:</span>
                <span className="font-medium">${policy.benefitBreakdown.qpipParental.amount}/week ({policy.benefitBreakdown.qpipParental.weeks} weeks)</span>
              </div>
            )}
            {policy.benefitBreakdown.eiMaternity && (
              <div className="flex justify-between">
                <span className="text-gray-600">EI Maternity Benefits:</span>
                <span className="font-medium">${policy.benefitBreakdown.eiMaternity.amount}/week ({policy.benefitBreakdown.eiMaternity.weeks} weeks)</span>
              </div>
            )}
            {policy.benefitBreakdown.eiParental && (
              <div className="flex justify-between">
                <span className="text-gray-600">EI Parental Benefits:</span>
                <span className="font-medium">${policy.benefitBreakdown.eiParental.amount}/week ({policy.benefitBreakdown.eiParental.weeks} weeks)</span>
              </div>
            )}
            {policy.benefitBreakdown.companyTopUp && (
              <div className="flex justify-between">
                <span className="text-gray-600">Company Top-up:</span>
                <span className="font-medium">${policy.benefitBreakdown.companyTopUp.amount}/week</span>
              </div>
            )}
            <div className="border-t pt-2 mt-3">
              <div className="flex justify-between font-semibold">
                <span>Estimated Total Weekly:</span>
                <span>${policy.benefitBreakdown.totalWeekly}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Leave Timeline</h4>
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <p><strong>Employment Start:</strong> {policy.timeline.employmentStart}</p>
            <p><strong>Estimated Leave Start:</strong> {policy.timeline.leaveStart}</p>
            <p><strong>Maternity Leave:</strong> {policy.timeline.maternityWeeks} weeks</p>
            <p><strong>Parental Leave:</strong> Up to {policy.timeline.parentalWeeks} weeks</p>
            <p><strong>Total Available:</strong> Up to {policy.timeline.totalWeeks} weeks</p>
          </div>
        </div>
        
        {policy.nextSteps.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Next Steps</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              {policy.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: policy.customPolicy.replace(/\n/g, '<br>') }} />
        </div>
      </div>
    );
  }

  if (activeTab === 'Supporting Documentation') {
    return (
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: policy.supportingDocumentation.replace(/\n/g, '<br>') }} />
      </div>
    );
  }

  if (activeTab === 'Employee Guidance') {
    return (
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: policy.employeeGuidance.replace(/\n/g, '<br>') }} />
      </div>
    );
  }

  return null;
};

// Main Component
const EmployeeUploadPage = () => {
  const [activeTab, setActiveTab] = useState('Custom Policy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [policyGenerated, setPolicyGenerated] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState(null);
  const [formData, setFormData] = useState({
    fullName: 'Sarah Jonson',
    province: 'Quebec (QPIP)',
    employmentStatus: 'Permanent full-time',
    leaveType: 'Birthing Parent',
    employmentStartDate: '2022 - 04 - 02',
    salaryRange: '$64,000 - $75,000',
    leaveStartDate: '2022 - 04 - 02',
    currentTerm: '1st Trimester 1 - 12 weeks',
    insuranceProvider: '',
    shortTermDisability: '',
    companyTopUp: '',
    policyNumber: ''
  });
  
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'your-file-here.PDF', status: 'uploaded' },
    { name: 'document-name.PDF', status: 'uploaded' }
  ]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const tabs = [
    { name: 'Custom Policy', active: true },
    { name: 'Supporting Documentation', active: false },
    { name: 'Employee Guidance', active: false }
  ];

  const handleFileUpload = async (file) => {
    const newFile = { name: file.name, status: 'uploading' };
    setUploadedFiles(prev => [...prev, newFile]);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', 'insurance');

      // Show progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 90) {
          clearInterval(progressInterval);
        }
      }, 200);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        
        setUploadedFiles(prev => 
          prev.map(f => f.name === file.name ? { ...f, status: 'uploaded' } : f)
        );
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadedFiles(prev => 
        prev.map(f => f.name === file.name ? { ...f, status: 'error' } : f)
      );
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleGeneratePolicy = async () => {
    setIsGenerating(true);
    setPolicyGenerated(false);
    
    // Switch to Custom Policy tab
    setActiveTab('Custom Policy');
    
    try {
      const response = await fetch('/api/policies/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType: 'employee',
          employeeData: {
            fullName: formData.fullName,
            province: formData.province,
            employmentStatus: formData.employmentStatus,
            leaveType: formData.leaveType,
            employmentStartDate: formData.employmentStartDate,
            salaryRange: formData.salaryRange,
            leaveStartDate: formData.leaveStartDate,
            currentTerm: formData.currentTerm,
            insuranceProvider: formData.insuranceProvider,
            shortTermDisability: formData.shortTermDisability,
            companyTopUp: formData.companyTopUp,
            policyNumber: formData.policyNumber
          },
          uploadedDocuments: uploadedFiles.filter(f => f.status === 'uploaded').map(f => f.name)
        }),
      });

      const result = await response.json();

      if (result.success && result.policy) {
        setGeneratedPolicy(result.policy);
        setPolicyGenerated(true);
      } else {
        console.error('Policy generation failed:', result.error);
        // Handle error state
      }
    } catch (error) {
      console.error('API call failed:', error);
      // Handle error state
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`} style={{ minHeight: '100vh', height: '100vh', overflow: 'auto' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
      `}</style>
      
      <Head>
        <style>{`
          @font-face {
            font-family: 'Laisha';
            src: url('/fonts/Laisha.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}</style>
      </Head>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-[110px] h-[32px] flex items-center">
              <span className={`absolute left-0 top-0 font-bold text-2xl text-[#933A18] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ fontFamily: 'Laisha, serif' }}>
                m
              </span>
              <span className={`absolute left-0 top-0 font-bold text-2xl text-[#933A18] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ fontFamily: 'Laisha, serif' }}>
                manela
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              <div className="w-6 h-6 border border-gray-300 rounded"></div>
            </div>
            <div className="relative">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">6</span>
              <div className="w-6 h-6 border border-gray-300 rounded"></div>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 65px)' }}>
        {/* Left Sidebar - 95px width */}
        <div className="relative z-30">
          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-gray-900/20 transition-opacity duration-300"
              style={{ zIndex: 40 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
          {/* Sidebar */}
          <motion.nav
            layout
            className={`bg-white border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 shadow-xl' : 'w-[95px]'} h-full`}
            onMouseEnter={() => setSidebarOpen(true)}
            onMouseLeave={() => setSidebarOpen(false)}
            style={{ position: 'relative', zIndex: 50 }}
          >
            <nav className="flex flex-col gap-2 w-full mt-16">
              {/* Custom policy generator */}
              <motion.div
                layout
                className={`relative flex items-center cursor-pointer w-full transition-colors duration-200 rounded-2xl ${true ? 'bg-[#FFF6F4]' : ''} ${isSidebarOpen ? 'pl-6 py-3' : 'justify-center py-2'} ${true ? 'font-bold text-[#933A18]' : 'text-gray-700'}`}
              >
                <UserIcon className={`h-5 w-5 ${true ? 'text-[#933A18]' : 'text-gray-400'}`} />
                <div className="ml-4 w-[180px] overflow-hidden">
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ delay: 0.125 }}
                      className={`${true ? 'text-[#933A18]' : 'text-gray-700'} font-semibold whitespace-nowrap`}
                    >
                      Custom policy generator
                    </motion.span>
                  )}
                </div>
              </motion.div>
              {/* Resource center */}
              <motion.div
                layout
                className={`relative flex items-center cursor-pointer w-full transition-colors duration-200 rounded-2xl ${false ? 'bg-[#FFF6F4]' : ''} ${isSidebarOpen ? 'pl-6 py-3' : 'justify-center py-2'} ${false ? 'font-bold text-[#933A18]' : 'text-gray-700'}`}
              >
                <BriefcaseIcon className={`h-5 w-5 ${false ? 'text-[#933A18]' : 'text-gray-400'}`} />
                <div className="ml-4 w-[180px] overflow-hidden">
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ delay: 0.125 }}
                      className={`${false ? 'text-[#933A18]' : 'text-gray-700'} font-semibold whitespace-nowrap`}
                    >
                      Resource center
                    </motion.span>
                  )}
                </div>
              </motion.div>
              {/* Employee leave history */}
              <motion.div
                layout
                className={`relative flex items-center cursor-pointer w-full transition-colors duration-200 rounded-2xl ${false ? 'bg-[#FFF6F4]' : ''} ${isSidebarOpen ? 'pl-6 py-3' : 'justify-center py-2'} ${false ? 'font-bold text-[#933A18]' : 'text-gray-700'}`}
              >
                <TimerIcon className={`h-5 w-5 ${false ? 'text-[#933A18]' : 'text-gray-400'}`} />
                <div className="ml-4 w-[180px] overflow-hidden">
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ delay: 0.125 }}
                      className={`${false ? 'text-[#933A18]' : 'text-gray-700'} font-semibold whitespace-nowrap`}
                    >
                      Employee leave history
                    </motion.span>
                  )}
                </div>
              </motion.div>
            </nav>
            {/* Footer links */}
            {isSidebarOpen && (
              <div className="mt-auto mb-8 w-full px-6">
                <div className="text-xs text-gray-500 mb-2">Contact Manela</div>
                <div className="text-xs text-gray-500">Setting</div>
              </div>
            )}
          </motion.nav>
        </div>

        {/* Main Content - Total width: 1342px */}
        <div className="flex-1" style={{ width: '1342px', maxWidth: '1342px' }}>
          <div className="p-8 h-full">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <FileTextIcon className="h-6 w-6 text-[#933A18]" />
                <h1 className="text-2xl font-bold text-gray-900">Parental Leave Custom Policy</h1>
                <div className="flex space-x-1 ml-auto">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">A personalized approach to leave</p>
            </div>

            <div className="flex gap-8 h-full">
              {/* Left Form - Exact width: 278px */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full" style={{ width: '278px', minWidth: '278px' }}>
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Employee information</h2>
                    <p className="text-sm text-gray-600">Fill in as much info as possible to generate an accurate policy</p>
                  </div>

                  <div className="space-y-6">
                    <FormField label="Full Name">
                      <Input 
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    </FormField>

                    <FormField label="Province">
                      <Select
                        value={formData.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        options={[
                          { value: 'Quebec (QPIP)', label: 'Quebec (QPIP)' },
                          { value: 'Ontario (EI)', label: 'Ontario (EI)' }
                        ]}
                      />
                    </FormField>

                    <FormField label="Employment status">
                      <Select
                        value={formData.employmentStatus}
                        onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                        options={[
                          { value: 'Permanent full-time', label: 'Permanent full-time' },
                          { value: 'Permanent part-time', label: 'Permanent part-time' },
                          { value: 'Contract', label: 'Contract' }
                        ]}
                      />
                    </FormField>

                    <FormField label="Leave type">
                      <Select
                        value={formData.leaveType}
                        onChange={(e) => handleInputChange('leaveType', e.target.value)}
                        options={[
                          { value: 'Birthing Parent', label: 'Birthing Parent' },
                          { value: 'Non-birthing Parent', label: 'Non-birthing Parent' },
                          { value: 'Adoption', label: 'Adoption' }
                        ]}
                      />
                    </FormField>

                    <FormField label="Employment start date">
                      <Select
                        value={formData.employmentStartDate}
                        onChange={(e) => handleInputChange('employmentStartDate', e.target.value)}
                        options={[
                          { value: '2022 - 04 - 02', label: '2022 - 04 - 02' }
                        ]}
                      />
                    </FormField>

                    <FormField label="Annual Salary range">
                      <Select
                        value={formData.salaryRange}
                        onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                        options={[
                          { value: '$64,000 - $75,000', label: '$64,000 - $75,000' },
                          { value: '$50,000 - $64,000', label: '$50,000 - $64,000' },
                          { value: '$75,000 - $100,000', label: '$75,000 - $100,000' }
                        ]}
                      />
                    </FormField>

                    <FormField label="My leave will start on">
                      <Select
                        value={formData.leaveStartDate}
                        onChange={(e) => handleInputChange('leaveStartDate', e.target.value)}
                        options={[
                          { value: '2022 - 04 - 02', label: '2022 - 04 - 02' }
                        ]}
                      />
                    </FormField>

                    <FormField label="Current pregnancy term">
                      <Select
                        value={formData.currentTerm}
                        onChange={(e) => handleInputChange('currentTerm', e.target.value)}
                        options={[
                          { value: '1st Trimester 1 - 12 weeks', label: '1st Trimester 1 - 12 weeks' },
                          { value: '2nd Trimester 13 - 27 weeks', label: '2nd Trimester 13 - 27 weeks' },
                          { value: '3rd Trimester 28 - 40 weeks', label: '3rd Trimester 28 - 40 weeks' }
                        ]}
                      />
                    </FormField>
                  </div>

                  {/* Insurance Information Section */}
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Insurance information</h2>
                    <p className="text-sm text-gray-600 mb-6">Upload your collective insurance documents</p>

                    <DocumentUpload 
                      onFileUpload={handleFileUpload}
                      uploadedFiles={uploadedFiles}
                      uploadProgress={uploadProgress}
                    />

                    <div className="mt-6 space-y-6">
                      <FormField label="Insurance provider">
                        <Input 
                          placeholder="Value"
                          value={formData.insuranceProvider}
                          onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                        />
                      </FormField>

                      <FormField label="Short term disability (parental)">
                        <Input 
                          placeholder="Value"
                          value={formData.shortTermDisability}
                          onChange={(e) => handleInputChange('shortTermDisability', e.target.value)}
                        />
                      </FormField>

                      <FormField label="Company top-up %">
                        <Input 
                          placeholder="Value"
                          value={formData.companyTopUp}
                          onChange={(e) => handleInputChange('companyTopUp', e.target.value)}
                        />
                      </FormField>

                      <FormField label="Policy number">
                        <Input 
                          placeholder="Value"
                          value={formData.policyNumber}
                          onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
                {/* Sticky button container, always visible at bottom */}
                <div className="w-full px-6 pt-2 pb-4 bg-white border-t border-gray-100 z-10">
                  <Button variant="primary" className="w-full" onClick={handleGeneratePolicy}>
                    Generate my custom policy
                  </Button>
                </div>
              </div>

              {/* Right Column - Policy Preview Area with Tabs - Exact width: 976px */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ width: '976px', minWidth: '976px', height: '100%' }}>
                {/* Tabs positioned above content area */}
                <div className="bg-white border-b border-gray-200 flex items-center justify-between px-2" style={{height: '62px', width: '100%'}}>
                  {tabs.map((tab) => {
                    const isActive = tab.name === activeTab;
                    let icon = null;
                    if (tab.name === 'Custom Policy') icon = <FileTextIcon className="h-5 w-5 mr-2" />;
                    if (tab.name === 'Supporting Documentation') icon = <UsersIcon className="h-5 w-5 mr-2" />;
                    if (tab.name === 'Employee Guidance') icon = <BookOpenIcon className="h-5 w-5 mr-2" />;
                    return (
                      <button
                        key={tab.name}
                        className={`flex items-center justify-center flex-1 h-[45px] mx-2 rounded-xl transition-colors font-medium text-base ${
                          isActive
                            ? 'bg-[#933A18] text-white shadow'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-transparent'
                        }`}
                        style={{ minWidth: 0 }}
                        onClick={() => setActiveTab(tab.name)}
                      >
                        {icon}
                        {tab.name}
                      </button>
                    );
                  })}
                </div>

                {/* Content Area */}
                <div className="p-6 h-full overflow-y-auto">
                  {activeTab === 'Custom Policy' && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Custom Policy Preview</h2>
                      
                      {isGenerating ? (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-center mb-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mr-3"></div>
                            <p className="text-gray-600 font-medium">Generating your custom policy...</p>
                          </div>
                          <PolicySkeletonLoader />
                        </div>
                      ) : policyGenerated ? (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <GeneratedPolicyContent policy={generatedPolicy} activeTab={activeTab} />
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-6 min-h-[500px]">
                          <div className="text-center text-gray-500 mt-20">
                            <FileTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium mb-2">Policy will appear here</p>
                            <p className="text-sm">Complete the form on the left and click "Generate my custom policy" to see your personalized parental leave policy</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Supporting Documentation' && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Supporting Documentation</h2>
                      <div className="bg-gray-50 rounded-lg p-6 min-h-[500px]">
                        <div className="text-center text-gray-500 mt-20">
                          <DocumentIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium mb-2">Supporting documents will appear here</p>
                          <p className="text-sm">Government forms, checklists, and required documentation</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Employee Guidance' && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Guidance</h2>
                      <div className="bg-gray-50 rounded-lg p-6 min-h-[500px]">
                        <div className="text-center text-gray-500 mt-20">
                          <CheckCircleIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium mb-2">Guidance and support will appear here</p>
                          <p className="text-sm">Emotional support resources, return-to-work planning, and financial tips</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeUploadPage; 