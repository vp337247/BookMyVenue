import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BookMyVenue | Discover and Book Local Spaces',
  description: 'Simplify your venue booking experience. Discover local cafes, auditoriums, and unique spaces for your events with complete pricing transparency and real-time scheduling.',
  keywords: 'venue booking, book cafe, event spaces, community spaces, local venues, wecode community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="ambient-glow-1"></div>
        <div className="ambient-glow-2"></div>
        <nav className="nav-container">
          <a href="#" className="logo">
            <div className="logo-icon">B</div>
            <span className="text-gradient">BookMyVenue</span>
          </a>
          <div className="nav-links">
            <a href="#explore" className="nav-link">Explore Venues</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#about" className="nav-link">About WeCode</a>
            <a href="https://github.com/WeCode/BookMyVenue" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              WeCode GitHub
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
