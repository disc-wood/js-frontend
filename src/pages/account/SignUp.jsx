// Sign Up page that allows users to create an account using email/password or Google OAuth
// Sends registration data to backend for Firebase Auth + DB user creation

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleButton from '@/common/components/atoms/GoogleButton';
import { FormTitle } from '@/common/components/form/Form';
import { Input } from '@/common/components/form/Input';
import SubmitButton from '@/common/components/form/SubmitButton';
import { useUser } from '@/common/contexts/UserContext';
import { RedSpan } from '@/common/components/form/styles';

import { StyledPage, StyledForm } from './styles';

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
      navigate('/', { replace: true });
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
          message: 'Account created! Please check your email to verify it.',
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

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </SubmitButton>
      </StyledForm>
    </StyledPage>
  );
}