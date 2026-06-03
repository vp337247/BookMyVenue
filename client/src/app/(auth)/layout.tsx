import React from 'react';
import { AuthSidebar } from '../../components/AuthSidebar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="signup-page-wrapper">
      {/* Left Sidebar Section (Server Side Rendered) */}
      <AuthSidebar />

      {children}
    </div>
  );
}
