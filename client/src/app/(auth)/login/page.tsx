"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputField } from '../../../components/InputField';
import { Button } from '../../../components/Button';
import { Callout } from '../../../components/Callout';
import { API_CONFIG } from '../../../config/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!password) {
      newErrors.password = 'Password is required.';
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
            mutation Login($input: LoginInput!) {
              login(input: $input) {
                success
                message
                statusCode
                roleCode
              }
            }
          `,
          variables: {
            input: {
              email: email.trim(),
              password: password,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message || 'An error occurred during log in.');
      }

      const loginData = result.data?.login;
      if (loginData) {
        if (loginData.success) {
          router.push('/');
        } else {
          setSubmitError(loginData.message || 'Login failed.');
        }
      } else {
        throw new Error('Invalid response received from server.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to connect to authentication service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-form-section">
      <div className="signup-form-container">
        <div className="signup-form-header">
          <h2 className="signup-form-title">Welcome back</h2>
          <p className="signup-form-subtitle">Enter your credentials to access your account</p>
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

          {/* Password */}
          <div style={{ position: 'relative' }}>
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

            {/* Forgot Password Helper Link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-12px', marginBottom: '24px' }}>
              <a 
                href="/forgot-password" 
                style={{ 
                  color: '#2563eb', 
                  fontSize: '0.85rem', 
                  textDecoration: 'none', 
                  fontWeight: 600 
                }}
                onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Logging in..."
            fullWidth
          >
            Log in
          </Button>
        </form>

        {/* Social Sign-In */}
        <div className="social-separator">or sign in with</div>

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

        {/* Sign up Redirect Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px', 
          fontSize: '0.95rem',
          color: '#475569'
        }}>
          <span>Don't have an account? </span>
          <a 
            href="/signup" 
            style={{ 
              color: '#2563eb', 
              fontWeight: 700, 
              textDecoration: 'none' 
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
