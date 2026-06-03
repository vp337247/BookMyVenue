"use client";

import React from 'react';

// Static mockup data representing premium community venues
const FEATURED_VENUES = [
  {
    id: '1',
    name: 'The Glasshouse Loft',
    type: 'Co-Working & Meetups',
    rating: 4.9,
    reviews: 42,
    price: 45,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    amenities: ['Wi-Fi', 'Coffee Bar', 'Projector', 'Air Conditioned'],
    capacity: '25 people'
  },
  {
    id: '2',
    name: 'Starlight Outdoor Garden',
    type: 'Socials & Gatherings',
    rating: 4.8,
    reviews: 28,
    price: 110,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    amenities: ['Catering Area', 'Parking', 'Sound System', 'Pet Friendly'],
    capacity: '80 people'
  },
  {
    id: '3',
    name: 'Neon Cyberpunk Studio',
    type: 'Photoshoots & Creative',
    rating: 5.0,
    reviews: 19,
    price: 75,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    amenities: ['AV Equipment', 'RGB Lighting', 'Green Screen', 'Dressing Room'],
    capacity: '12 people'
  }
];

export default function HomePage() {
  return (
    <main style={{ paddingBottom: '100px' }}>
      
      {/* Hero Section */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 20px',
        position: 'relative'
      }}>
        <div className="pulsing-badge" style={{ marginBottom: '24px' }}>
          ✨ Phase 1 MVP Initiative
        </div>
        
        <h1 className="text-gradient-primary" style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: '1.15',
          maxWidth: '900px',
          marginBottom: '20px',
          fontWeight: 800
        }}>
          Discover & Book Extraordinary Local Spaces
        </h1>
        
        <p style={{
          color: 'hsl(var(--text-secondary))',
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '650px',
          marginBottom: '40px'
        }}>
          BookMyVenue is a free community platform connecting local space owners and organizers. Zero commercial fees. Complete transparency.
        </p>

        {/* Search Bar - Premium Glass Panel */}
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '850px',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
          gap: '16px',
          alignItems: 'center',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--primary))', textTransform: 'uppercase' }}>Where</label>
            <input type="text" placeholder="Search neighborhood..." style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid hsl(var(--card-border))',
              color: 'hsl(var(--text-primary))',
              fontSize: '0.95rem',
              padding: '6px 0',
              outline: 'none'
            }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--secondary))', textTransform: 'uppercase' }}>Event Type</label>
            <select style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid hsl(var(--card-border))',
              color: 'hsl(var(--text-secondary))',
              fontSize: '0.95rem',
              padding: '6px 0',
              outline: 'none',
              cursor: 'pointer'
            }}>
              <option value="">Select type...</option>
              <option value="cowork">Co-Working & Meetups</option>
              <option value="gather">Socials & Gatherings</option>
              <option value="creative">Photoshoots & Creative</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--accent))', textTransform: 'uppercase' }}>Guests</label>
            <input type="number" placeholder="Number of guests" style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid hsl(var(--card-border))',
              color: 'hsl(var(--text-primary))',
              fontSize: '0.95rem',
              padding: '6px 0',
              outline: 'none'
            }} />
          </div>

          <button className="btn-premium" style={{ border: 'none', padding: '16px 36px', height: '100%' }}>
            Find Spaces
          </button>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section id="explore" style={{ padding: '80px max(4vw, 20px)', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Featured Local Venues</h2>
            <p style={{ color: 'hsl(var(--text-muted))', marginTop: '4px' }}>Handpicked, verified spaces around your community.</p>
          </div>
          <a href="#" className="nav-link" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            View all spaces →
          </a>
        </div>

        <div className="grid-venues">
          {FEATURED_VENUES.map((venue) => (
            <div key={venue.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Image Container with overlays */}
              <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                <img 
                  src={venue.image} 
                  alt={venue.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(10, 15, 30, 0.75)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'hsl(var(--secondary))',
                  border: '1px solid hsl(var(--secondary) / 0.3)'
                }}>
                  {venue.type}
                </div>
              </div>

              {/* Card Details */}
              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Capacity: {venue.capacity}</span>
                  <span style={{ color: 'hsl(var(--warning))', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    ★ {venue.rating} <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 400 }}>({venue.reviews})</span>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px', color: 'hsl(var(--text-primary))' }}>{venue.name}</h3>

                {/* Amenities List */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                  {venue.amenities.map((amenity, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.75rem',
                      background: 'hsl(var(--bg-tertiary) / 0.5)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      color: 'hsl(var(--text-secondary))',
                      border: '1px solid hsl(var(--card-border))'
                    }}>
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Footer and Price */}
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid hsl(var(--card-border))'
                }}>
                  <div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'hsl(var(--primary))' }}>${venue.price}</span>
                    <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}> / hour</span>
                  </div>
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Blueprint Architecture Section */}
      <section id="how-it-works" style={{ padding: '80px max(4vw, 20px)', background: 'hsl(var(--bg-primary) / 0.4)', borderTop: '1px solid hsl(var(--card-border))' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <div className="pulsing-badge" style={{ marginBottom: '16px' }}>
            💻 Current Architecture
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>Approved MVP Stack Blueprint</h2>
          <p style={{ color: 'hsl(var(--text-secondary))', maxWidth: '650px', margin: '0 auto 60px' }}>
            We are structuring the project as an enterprise-grade modular monolith, enabling simple local execution today with microservice capability tomorrow.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            textAlign: 'left'
          }}>
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '10px',
                background: 'hsl(var(--primary) / 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'hsl(var(--primary))',
                fontWeight: 700,
                fontSize: '1.2rem',
                marginBottom: '20px',
                border: '1px solid hsl(var(--primary) / 0.3)'
              }}>
                FE
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '1.25rem' }}>Next.js Frontend</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                Highly-optimized, server-side rendered user interface built with TypeScript. SEO optimized and fast performance out of the box.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '10px',
                background: 'hsl(var(--secondary) / 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'hsl(var(--secondary))',
                fontWeight: 700,
                fontSize: '1.2rem',
                marginBottom: '20px',
                border: '1px solid hsl(var(--secondary) / 0.3)'
              }}>
                BE
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '1.25rem' }}>NestJS Server</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                A highly structured TypeScript backend framework using Controllers, Services, and domain isolation for a modular monolithic baseline.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '10px',
                background: 'hsl(var(--accent) / 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'hsl(var(--accent))',
                fontWeight: 700,
                fontSize: '1.2rem',
                marginBottom: '20px',
                border: '1px solid hsl(var(--accent) / 0.3)'
              }}>
                GQL
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '1.25rem' }}>GraphQL Layer</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                A unified, strongly-typed API layer. Enables the Next.js client to query exactly the venue or booking fields it needs in a single request.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '10px',
                background: 'hsl(var(--success) / 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'hsl(var(--success))',
                fontWeight: 700,
                fontSize: '1.2rem',
                marginBottom: '20px',
                border: '1px solid hsl(var(--success) / 0.3)'
              }}>
                DB
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '1.25rem' }}>PostgreSQL & Prisma</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                Relational integrity for bookings and users. Prisma Client is utilized for clean, typed database schema migrations and transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
