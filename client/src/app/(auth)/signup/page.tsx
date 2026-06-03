"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardSelect } from '../../../components/CardSelect';
import { InputField } from '../../../components/InputField';
import { PhoneInputField } from '../../../components/PhoneInputField';
import { PasswordCriteriaList } from '../../../components/PasswordCriteriaList';
import { Button } from '../../../components/Button';
import { Callout } from '../../../components/Callout';
import { API_CONFIG } from '../../../config/api';

export default function SignupPage() {
  const router = useRouter();
  // Form Field States
  const [roleCode, setRoleCode] = useState<'USER' | 'OWNER'>('USER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Validation & Submission States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Password Criteria States
  const [criteria, setCriteria] = useState({
    length: false,
    number: false,
    uppercase: false,
    specialChar: false,
  });

  // Evaluate Password Criteria
  useEffect(() => {
    setCriteria({
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  // Real-time password matching validation
  useEffect(() => {
    if (confirmPassword.length > 0) {
      if (password !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match.',
        }));
      } else {
        setErrors((prev) => {
          const { confirmPassword, ...rest } = prev;
          return rest;
        });
      }
    } else {
      setErrors((prev) => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  }, [password, confirmPassword]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First Name is required.';
    } else if (firstName.trim().length < 3) {
      newErrors.firstName = 'First Name is too short (min 3 characters).';
    }

    if (lastName.trim() && lastName.trim().length > 100) {
      newErrors.lastName = 'Last Name must be less than 100 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (phoneDigits.length < 5 || phone.length > 20) {
      newErrors.phone = 'Phone number must be between 5 and 20 characters.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else {
      if (!criteria.length) newErrors.password = 'Password must be at least 8 characters long.';
      else if (!criteria.number) newErrors.password = 'Password must contain at least one number.';
      else if (!criteria.uppercase) newErrors.password = 'Password must contain at least one uppercase letter.';
      else if (!criteria.specialChar) newErrors.password = 'Password must contain at least one special character.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const graphqlUrl = API_CONFIG.graphqlUrl;
      
      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation SignUp($input: SignupInput!) {
              signUp(input: $input) {
                success
                message
                statusCode
              }
            }
          `,
          variables: {
            input: {
              firstName: firstName.trim(),
              lastName: lastName.trim() || null,
              email: email.trim(),
              phone: phone.trim(),
              countryCode: countryCode,
              password: password,
              roleCode: roleCode,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message || 'An error occurred during sign up.');
      }

      const signUpData = result.data?.signUp;
      if (signUpData) {
        if (signUpData.success) {
          localStorage.setItem('registered_email', email.trim());
          router.push('/verify-email');
        } else {
          setSubmitError(signUpData.message || 'Registration failed.');
        }
      } else {
        throw new Error('Invalid response received from server.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to connect to registration service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SVGs for Role Selection
  const guestIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const ownerIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  if (isSuccess) {
    return (
      <div className="signup-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center', margin: '20px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(37, 99, 235, 0.1)',
            border: '2px solid #2563eb',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
            marginBottom: '24px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '16px' }}>Account Created!</h2>
          <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '24px', fontSize: '1rem', lineHeight: '1.6' }}>
            {successMessage}
          </p>
          <div style={{ background: 'hsl(var(--bg-tertiary) / 0.3)', border: '1px solid hsl(var(--card-border))', borderRadius: '8px', padding: '16px', marginBottom: '32px' }}>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-primary))', fontWeight: 600 }}>Next Steps:</p>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>
              Check your email <strong style={{ color: 'hsl(var(--primary))' }}>{email}</strong> for the 6-digit verification code to complete your registration.
            </p>
          </div>
          <a href="#" className="btn-premium" style={{ width: '100%', border: 'none' }}>
            Verify Email Address
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-form-section">
        <div className="signup-form-container">
          <div className="signup-form-header">
            <h2 className="signup-form-title">Create your account</h2>
            <p className="signup-form-subtitle">Fill in your details to get started</p>
          </div>

          {submitError && (
            <Callout type="danger">{submitError}</Callout>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="role-select-section">
              <span className="role-select-label">I want to join as</span>
              <div className="role-cards-grid">
                <CardSelect
                  title="User (Guest)"
                  description="I want to book venues for events"
                  selected={roleCode === 'USER'}
                  onClick={() => setRoleCode('USER')}
                  icon={guestIcon}
                />
                <CardSelect
                  title="Venue Owner"
                  description="I want to list and manage my venues"
                  selected={roleCode === 'OWNER'}
                  onClick={() => setRoleCode('OWNER')}
                  icon={ownerIcon}
                />
              </div>
            </div>

            {/* Names */}
            <div className="form-row-2col">
              <InputField
                label="First Name"
                name="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={errors.firstName}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
              />
              <InputField
                label="Last Name"
                name="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={errors.lastName}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
              />
            </div>

            {/* Email Address */}
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              }
            />

            {/* Phone Number */}
            <PhoneInputField
              label="Phone Number"
              name="phone"
              phoneValue={phone}
              countryCodeValue={countryCode}
              onPhoneChange={(e) => setPhone(e.target.value)}
              onCountryCodeChange={(e) => setCountryCode(e.target.value)}
              error={errors.phone}
            />

            {/* Password */}
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              showPasswordToggle={true}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />

            {/* Password Criteria Checklist */}
            <PasswordCriteriaList criteria={criteria} />

            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              showPasswordToggle={true}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />

            {/* Terms checkbox */}
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
              <label className="terms-container">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="terms-checkbox"
                />
                <span className="terms-text">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && <span className="input-error-msg">{errors.terms}</span>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating Account..."
              fullWidth
            >
              Create Account
            </Button>
          </form>

          {/* Social Sign-In */}
          <div className="social-separator">or sign up with</div>

          <div className="social-grid">
            <Button variant="social" type="button" icon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.093-5.136 4.093-3.418 0-6.205-2.787-6.205-6.205s2.787-6.205 6.205-6.205c1.472 0 2.825.518 3.886 1.382l3.055-3.055C18.966 2.457 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.87-4.218 10.87-11.24 0-.648-.052-1.244-.155-1.955H12.24Z"/>
              </svg>
            }>
              Google
            </Button>
            <Button variant="social" type="button" icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.18.67-2.9 1.49-.62.72-1.16 1.87-1.02 2.98 1.1.09 2.21-.57 2.93-1.41z"/>
              </svg>
            }>
              Apple
            </Button>
          </div>

          {/* Secure notice */}
          <div className="secure-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Your information is secure and encrypted</span>
          </div>
        </div>
      </div>
  );
}
