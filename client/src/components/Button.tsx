import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'premium' | 'secondary' | 'social';
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  loadingText,
  icon,
  className = '',
  style,
  ...props
}: ButtonProps) {
  let variantClass = '';
  if (variant === 'primary') {
    variantClass = 'btn-primary-full';
  } else if (variant === 'premium') {
    variantClass = 'btn-premium';
  } else if (variant === 'secondary') {
    variantClass = 'btn-secondary';
  } else if (variant === 'social') {
    variantClass = 'btn-social';
  }

  const combinedStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : undefined,
    opacity: isLoading ? 0.7 : undefined,
    cursor: isLoading ? 'not-allowed' : undefined,
    ...style,
  };

  return (
    <button
      className={`${variantClass} ${className}`}
      style={combinedStyle}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span>{loadingText || 'Loading...'}</span>
      ) : (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: variant === 'social' ? '10px' : '8px', width: '100%' }}>
          {icon && <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
          {children}
        </span>
      )}
    </button>
  );
}
