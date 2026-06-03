"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export function AuthSidebar() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  const footerText = isLoginPage ? "Don't have an account?" : "Already have an account?";
  const linkText = isLoginPage ? "Sign up" : "Sign in";
  const linkHref = isLoginPage ? "/signup" : "/login";

  return (
    <div className="signup-sidebar">
      <a href="/" className="signup-sidebar-logo">
        <div className="signup-sidebar-logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M9 16l2 2 4-4" />
          </svg>
        </div>
        <div className="signup-sidebar-logo-text">
          <span>BMV</span>
          <span className="signup-sidebar-logo-sub">BookMyVenue</span>
        </div>
      </a>

      <div className="signup-sidebar-welcome">
        <h2 className="signup-sidebar-title">Welcome to<br />BookMyVenue</h2>
        <p className="signup-sidebar-desc">
          Your one-stop platform to discover, book and manage amazing venues.
        </p>
      </div>

      <div className="signup-illustration-container">
        <img
          src="/images/signup_illustration.png"
          alt="Venue illustration"
          className="signup-illustration-img"
        />
      </div>

      <div className="signup-sidebar-features">
        <div className="signup-feature-item">
          <div className="signup-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <h4 className="signup-feature-title">Discover & Book</h4>
            <p className="signup-feature-desc">Find and book the perfect venue for any occasion.</p>
          </div>
        </div>

        <div className="signup-feature-item">
          <div className="signup-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h4 className="signup-feature-title">List & Manage</h4>
            <p className="signup-feature-desc">List your venue and manage bookings with ease.</p>
          </div>
        </div>

        <div className="signup-feature-item">
          <div className="signup-feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h4 className="signup-feature-title">Secure & Trusted</h4>
            <p className="signup-feature-desc">Your data and transactions are safe and secure with us.</p>
          </div>
        </div>
      </div>

      <div className="signup-sidebar-footer">
        <span style={{ color: '#475569', marginRight: '8px' }}>{footerText}</span>
        <a href={linkHref}>
          {linkText}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </div>
  );
}
