import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import GoogleButton from '@/common/components/atoms/GoogleButton';
import { FormTitle } from '@/common/components/form/Form';
import { Input } from '@/common/components/form/Input';
import { RedSpan } from '@/common/components/form/styles';

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

import { auth } from '@/firebase-config';

import { StyledPage, SignupText, StyledForm } from './styles';

const StyledLink = styled(Link)`
  color: #0C447C;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  margin-top: -4px;
  align-self: flex-end;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: color 0.15s ease;

  &:hover {
    color: #185FA5;
    text-decoration: underline;
  }
`;

const StyledLoginButton = styled.button`
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

const provider = new GoogleAuthProvider();

async function acceptInvite(token, uid) {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/invite/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, uid }),
    });
  } catch (err) {
    console.error('Failed to accept invite:', err);
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formState.email,
        formState.password
      );

      if (inviteToken) {
        await acceptInvite(inviteToken, userCredential.user.uid);
        await userCredential.user.getIdToken(true);
      }

      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);

      switch (error.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Email or password is incorrect.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithPopup(auth, provider);

      if (inviteToken) {
        await acceptInvite(inviteToken, userCredential.user.uid);
        await userCredential.user.getIdToken(true);
      }

      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledPage>
      <StyledForm onSubmit={handleSubmit}>
        <FormTitle>{inviteToken ? 'Accept invitation' : 'Log in'}</FormTitle>

        <GoogleButton
          onClick={handleGoogleLogin}
          isLoading={isLoading}
          text="Continue with Google"
        />

        {error && <RedSpan>{error}</RedSpan>}

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

        <StyledLoginButton type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </StyledLoginButton>

        <StyledLink to="/forgot-password">Forgot password?</StyledLink>

        <SignupText>
          Don't have an account?{' '}
          <StyledLink to="/signup">Create</StyledLink>
        </SignupText>
      </StyledForm>
    </StyledPage>
  );
}