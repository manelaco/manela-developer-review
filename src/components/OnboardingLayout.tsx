import React from 'react';
import Logo from './Logo';
import { Outlet } from 'react-router-dom';
const OnboardingLayout: React.FC = () => {
  return <div className="min-h-screen flex flex-col bg-manela-bg">
      <header className="border-b border-gray-100 py-4 px-6">
        <div className="container">
          <Logo />
        </div>
      </header>
      
      <main className="flex-grow container py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="md:sticky md:top-8">
            <Outlet context="left" />
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm my-[57px]">
            <Outlet context="right" />
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-100 py-4 px-6 text-sm text-gray-500">
        <div className="container flex justify-between">
          <div>© 2025 {process.env.NEXT_PUBLIC_COMPANY_NAME} · All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-manela">Terms & Conditions</a>
            <a href="#" className="hover:text-manela">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>;
};
export default OnboardingLayout;