import React from 'react';

interface CalloutProps {
  type?: 'info' | 'danger' | 'success';
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Callout({
  type = 'info',
  title,
  icon,
  children,
  style,
}: CalloutProps) {
  const isDanger = type === 'danger';
  const isSuccess = type === 'success';

  const defaultStyles: React.CSSProperties = {
    background: isDanger ? 'rgba(239, 68, 68, 0.1)' : isSuccess ? 'rgba(16, 185, 129, 0.1)' : '#eff6ff',
    border: isDanger ? '1px solid rgba(239, 68, 68, 0.2)' : isSuccess ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #dbeafe',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    textAlign: 'left',
    color: isDanger ? 'hsl(var(--danger))' : isSuccess ? 'hsl(var(--success))' : 'inherit',
    ...style,
  };

  let displayIcon = icon;
  if (!displayIcon) {
    if (isDanger) {
      displayIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    } else {
      displayIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    }
  }

  const iconColor = isDanger ? '#ef4444' : isSuccess ? '#10b981' : '#2563eb';

  return (
    <div style={defaultStyles}>
      <div style={{ color: iconColor, marginTop: '2px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {displayIcon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {title && <p style={{ fontSize: '0.85rem', fontWeight: 700, color: isDanger ? '#b91c1c' : isSuccess ? '#065f46' : '#1e3a8a', marginBottom: '4px' }}>{title}</p>}
        <div style={{ fontSize: '0.8rem', color: isDanger ? 'inherit' : '#475569', lineHeight: '1.4' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
