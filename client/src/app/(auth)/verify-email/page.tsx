"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CopyrightFooter } from '../../../components/CopyrightFooter';
import { Button } from '../../../components/Button';
import { Callout } from '../../../components/Callout';
import { API_CONFIG } from '../../../config/api';

export default function VerifyEmailPage() {
  const router = useRouter();

  // State
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Retrieve email from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('registered_email');
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

  const handleOtpChange = (value: string, index: number) => {
    // Alphanumeric, convert to uppercase
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!cleanValue) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    // Take only the last character if multiple are entered/pasted
    newOtp[index] = cleanValue.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (index < 5 && cleanValue) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (pasteData.length === 6) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    
    setSubmitError(null);
    try {
      const graphqlUrl = API_CONFIG.graphqlUrl;
      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation RequestOtpCode($email: String!) {
              requestOtpCode(email: $email) {
                success
                message
                statusCode
              }
            }
          `,
          variables: {
            email: email.trim(),
          },
        }),
      });

      const result = await response.json();
      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message || 'Failed to resend code.');
      }

      if (result.data?.requestOtpCode?.success) {
        setTimeLeft(45);
      } else {
        setSubmitError(result.data?.requestOtpCode?.message || 'Failed to resend code.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to connect to verification service.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setSubmitError('Please enter the full 6-digit verification code.');
      return;
    }

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
            mutation VerifyEmail($input: VerifyEmailInput!) {
              verifyEmail(input: $input) {
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
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message || 'An error occurred during verification.');
      }

      const verifyData = result.data?.verifyEmail;
      if (verifyData) {
        if (verifyData.success) {
          setIsVerified(true);
          // Clear registration email
          localStorage.removeItem('registered_email');
        } else {
          setSubmitError(verifyData.message || 'Verification failed.');
        }
      } else {
        throw new Error('Invalid response received from server.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to connect to verification service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Success Screen
  if (isVerified) {
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
          <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'hsl(var(--text-primary))' }}>Email Verified!</h2>
          <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.6' }}>
            Your email address has been verified successfully. Your account is active and you can now log in.
          </p>
          <Button variant="premium" style={{ width: '100%' }}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-form-section" style={{ position: 'relative' }}>
      <div className="signup-form-container" style={{ textAlign: 'center' }}>

        {/* Top Envelope Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2563eb',
          margin: '0 auto 24px',
          position: 'relative'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            background: '#2563eb',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            border: '2px solid #fff'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h2 className="signup-form-title">Verify your email</h2>
        <p className="signup-form-subtitle" style={{ marginBottom: '8px' }}>Enter the 6-digit code sent to</p>

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
            Enter 6-digit code
          </span>

          {/* 6-Digit OTP Grid */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '32px' }}>
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
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            ))}
          </div>

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

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Verifying..."
            fullWidth
          >
            Verify Email
          </Button>
        </form>

        <div style={{ color: '#64748b', fontSize: '0.95rem', margin: '16px 0 24px' }}>or</div>

        {/* Help Info Box */}
        <Callout type="info" title="Can't find the email?">
          Please check your spam or junk folder.<br />
          Add <strong style={{ color: '#2563eb' }}>no-reply@bookmyvenue.com</strong> to your contacts.
        </Callout>

        {/* Back to Login */}
        <a
          href="#"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
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

      {/* Copyright Footer */}
      <CopyrightFooter />
    </div>
  );
}
