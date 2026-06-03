import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="nav-container">
        <a href="#" className="logo">
          <div className="logo-icon">B</div>
          <span className="text-gradient">BookMyVenue</span>
        </a>
        <div className="nav-links">
          <a href="#explore" className="nav-link">Explore Venues</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="/signup" className="btn-premium" style={{ padding: '8px 16px', fontSize: '0.85rem', border: 'none' }}>
            Get Started
          </a>
        </div>
      </nav>
      {children}
    </>
  );
}
