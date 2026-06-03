"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputField } from '../../../components/InputField';
import { Button } from '../../../components/Button';
import { Callout } from '../../../components/Callout';
import { API_CONFIG } from '../../../config/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
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
            mutation ForgotPassword($input: ForgotPasswordInput!) {
              forgotPassword(input: $input) {
                success
                message
                statusCode
              }
            }
          `,
          variables: {
            input: {
              email: email.trim(),
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message || 'An error occurred during verification code request.');
      }

      const forgotPasswordData = result.data?.forgotPassword;
      if (forgotPasswordData) {
        if (forgotPasswordData.success) {
          localStorage.setItem('reset_email', email.trim());
          router.push('/reset-password');
        } else {
          setSubmitError(forgotPasswordData.message || 'Request failed.');
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

  return (
    <div className="signup-form-section">
      <div className="signup-form-container">
        <div className="signup-form-header">
          <h2 className="signup-form-title">Forgot password</h2>
          <p className="signup-form-subtitle">Enter your email to request a 6-digit password reset code</p>
        </div>

        {submitError && (
          <Callout type="danger">{submitError}</Callout>
        )}

        <form onSubmit={handleSubmit}>
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

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Sending code..."
            fullWidth
            style={{ marginBottom: '32px' }}
          >
            Request Reset Code
          </Button>
        </form>

        {/* Back to Login */}
        <div style={{ textAlign: 'center' }}>
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
      </div>
    </div>
  );
}
