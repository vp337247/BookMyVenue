import React from 'react';

export function CopyrightFooter() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: '0.8rem',
      color: '#64748b',
      pointerEvents: 'none'
    }}>
      © 2025 BookMyVenue (BMV). All rights reserved.
    </div>
  );
}
