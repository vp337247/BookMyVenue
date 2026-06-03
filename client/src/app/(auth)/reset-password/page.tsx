"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { InputField } from '../../../components/InputField';
import { Button } from '../../../components/Button';
import { Callout } from '../../../components/Callout';
import { PasswordCriteriaList } from '../../../components/PasswordCriteriaList';
import { CopyrightFooter } from '../../../components/CopyrightFooter';
import { API_CONFIG } from '../../../config/api';

export default function ResetPasswordPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(45);

  // Validation & Submission States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Password Criteria States
  const [criteria, setCriteria] = useState({
    length: false,
    number: false,
    uppercase: false,
    specialChar: false,
  });

  // Retrieve email from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('reset_email');
    if (stored) {
      setEmail(stored);
    }
  }, []);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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

  const handleResend = () => {
    setTimeLeft(45);
    setSubmitError(null);
  };

  const handleOtpChange = (value: string, index: number) => {
    // Accept letters and numbers (alphanumeric). Convert letters to uppercase.
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (value && !cleanValue) return;

    const newOtp = [...otp];
    newOtp[index] = cleanValue.slice(-1);
    setOtp(newOtp);

    // Auto-advance focus
    if (cleanValue !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] !== '') {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      newErrors.otp = 'Please enter the full 6-digit reset code.';
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
      const otpCode = otp.join('');

      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ResetPassword($input: ResetPasswordInput!) {
              resetPassword(input: $input) {
                success
                message
                statusCode
              }
            }
          `,
          variables: {
            input: {
              email: email.trim(),
              otpCode: otpCode,
              newPassword: password,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message || 'An error occurred during password reset.');
      }

      const resetData = result.data?.resetPassword;
      if (resetData) {
        if (resetData.success) {
          setIsSuccess(true);
          localStorage.removeItem('reset_email');
        } else {
          setSubmitError(resetData.message || 'Reset failed.');
        }
      } else {
        throw new Error('Invalid response received from server.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to connect to password reset service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Success Screen
  if (isSuccess) {
    return (
      <div className="signup-form-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'hsl(var(--text-primary))' }}>Password Reset!</h2>
          <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.6' }}>
            Your password has been successfully reset. You can now use your new password to log in.
          </p>
          <Button variant="premium" style={{ width: '100%' }} onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-form-section" style={{ position: 'relative' }}>
      <div className="signup-form-container" style={{ textAlign: 'center' }}>
        <h2 className="signup-form-title">Reset your password</h2>
        <p className="signup-form-subtitle" style={{ marginBottom: '8px' }}>Enter the 6-digit code and your new password</p>

        {/* Editable Email Display */}
        {!isEditingEmail ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb' }}>{email || 'Loading email...'}</span>
            <button
              type="button"
              onClick={() => setIsEditingEmail(true)}
              style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
              title="Edit email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px', maxWidth: '340px', margin: '0 auto 32px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flexGrow: 1,
                height: '38px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                padding: '0 12px',
                outline: 'none',
                fontSize: '0.95rem',
                color: '#0f172a'
              }}
              placeholder="Enter email address"
            />
            <button
              type="button"
              onClick={() => setIsEditingEmail(false)}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              Save
            </button>
          </div>
        )}

        {submitError && (
          <Callout type="danger">{submitError}</Callout>
        )}

        <form onSubmit={handleSubmit}>
          <span style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#1e293b',
            textAlign: 'left',
            marginBottom: '12px'
          }}>
            Enter 6-digit reset code
          </span>

          {/* 6-Digit OTP Grid */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '24px' }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => { inputRefs.current[idx] = el as HTMLInputElement; }}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                placeholder="-"
                style={{
                  width: '100%',
                  height: '56px',
                  borderRadius: '8px',
                  border: errors.otp ? '1px solid #ef4444' : '1px solid #cbd5e1',
                  background: '#ffffff',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = errors.otp ? '#ef4444' : '#cbd5e1')}
              />
            ))}
          </div>
          {errors.otp && <span className="input-error-msg" style={{ textAlign: 'left', marginBottom: '20px', display: 'block' }}>{errors.otp}</span>}

          {/* Resend Code Logic */}
          <div style={{ marginBottom: '32px', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Didn't receive the code? </span>
            {timeLeft > 0 ? (
              <span>Resend OTP in <strong style={{ color: '#0f172a' }}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</strong></span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: 0
                }}
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* New Password */}
          <InputField
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password"
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
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
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

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Resetting..."
            fullWidth
            style={{ marginBottom: '24px' }}
          >
            Reset Password
          </Button>
        </form>

        {/* Back to Login */}
        <a
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            marginBottom: '40px'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'translateX(-2px)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Login
        </a>
      </div>

      <CopyrightFooter />
    </div>
  );
}
