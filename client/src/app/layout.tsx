import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BookMyVenue | Discover and Book Local Spaces',
  description: 'Simplify your venue booking experience. Discover local cafes, auditoriums, and unique spaces for your events with complete pricing transparency and real-time scheduling.',
  keywords: 'venue booking, book cafe, event spaces, community spaces, local venues',
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
        {children}
      </body>
    </html>
  );
}
