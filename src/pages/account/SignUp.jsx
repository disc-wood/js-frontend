// Sign Up page that allows users to create an account using email/password or Google OAuth
    // - Sends registration data to backend for Firebase Auth + DB user creation

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import GoogleButton from '@/common/components/atoms/GoogleButton';
import { FormTitle } from '@/common/components/form/Form';
import { Input } from '@/common/components/form/Input';
import { useUser } from '@/common/contexts/UserContext';
import { RedSpan } from '@/common/components/form/styles';

import { StyledPage, StyledForm } from './styles';

const StyledSignUpButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 20px;
  font-size: 14px;
  color: #0a0a0a;
  background-color: #ffffff;
  cursor: pointer;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: border-color 0.15s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    border-color: #0a0a0a;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function SignUp() {
  const navigate = useNavigate();
  const { googleAuth } = useUser();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');

    try {
      await googleAuth();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Google signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formState.email,
            password: formState.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      navigate('/login', {
        state: {
          message: 'Account created! An admin will reach out once you have been granted access.',
        },
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledPage>
      <StyledForm onSubmit={handleSubmit}>
        <FormTitle>Get Started</FormTitle>

        {error && <RedSpan>{error}</RedSpan>}

        <GoogleButton
          onClick={handleGoogleSignup}
          isLoading={isLoading}
          text="Sign up with Google"
        />

        <Input.Text
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleChange}
          required
        />

        <Input.Password
          name="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleChange}
          required
        />

        <StyledSignUpButton type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </StyledSignUpButton>

        <p style={{ margin: 0, fontSize: 13, color: '#888', textAlign: 'center' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', padding: 0, color: '#0C447C', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Log in
          </button>
        </p>
      </StyledForm>
    </StyledPage>
  );
}