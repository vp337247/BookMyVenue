import React from 'react';

interface PhoneInputFieldProps {
  label: string;
  name: string;
  phoneValue: string;
  countryCodeValue: string;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  label,
  name,
  phoneValue,
  countryCodeValue,
  onPhoneChange,
  onCountryCodeChange,
  placeholder = 'Enter phone number',
  error,
}) => {
  return (
    <div className="input-field-container">
      <label htmlFor={name} className="input-label">
        {label}
      </label>
      <div className="phone-input-row">
        <div className="country-code-wrapper">
          <select
            value={countryCodeValue}
            onChange={onCountryCodeChange}
            className="country-code-select"
          >
            <option value="+91">+91 (IN)</option>
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+971">+971 (AE)</option>
            <option value="+61">+61 (AU)</option>
            <option value="+65">+65 (SG)</option>
          </select>
          <span className="country-code-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
        <div className={`input-wrapper phone-number-wrapper ${error ? 'input-wrapper-error' : ''}`}>
          <span className="input-icon-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <input
            id={name}
            name={name}
            type="tel"
            placeholder={placeholder}
            value={phoneValue}
            onChange={onPhoneChange}
            className="input-element has-icon-left"
          />
        </div>
      </div>

      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};
