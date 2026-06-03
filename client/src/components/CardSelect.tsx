import React from 'react';

interface CardSelectProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

export const CardSelect: React.FC<CardSelectProps> = ({
  title,
  description,
  selected,
  onClick,
  icon,
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-select-container ${selected ? 'card-select-active' : ''}`}
    >
      <div className="card-select-radio-container">
        <div className={`card-select-radio ${selected ? 'card-select-radio-active' : ''}`}>
          {selected && (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
      </div>
      <div className="card-select-icon-wrapper">
        {icon}
      </div>
      <div className="card-select-content">
        <h4 className="card-select-title">{title}</h4>
        <p className="card-select-description">{description}</p>
      </div>
    </div>
  );
};
