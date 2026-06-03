import React from 'react';

interface PasswordCriteriaListProps {
  criteria: {
    length: boolean;
    number: boolean;
    uppercase: boolean;
    specialChar: boolean;
  };
}

export function PasswordCriteriaList({ criteria }: PasswordCriteriaListProps) {
  const items = [
    { key: 'length', label: 'At least 8 characters', active: criteria.length },
    { key: 'number', label: 'One number', active: criteria.number },
    { key: 'uppercase', label: 'One uppercase letter', active: criteria.uppercase },
    { key: 'specialChar', label: 'One special character', active: criteria.specialChar },
  ];

  return (
    <div className="criteria-box">
      {items.map((item) => (
        <div key={item.key} className={`criteria-item ${item.active ? 'criteria-active' : ''}`}>
          {item.active ? (
            <span className="criteria-icon-check">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          ) : (
            <span className="criteria-icon-empty">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </span>
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
