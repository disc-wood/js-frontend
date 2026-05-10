import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import GoogleButton from '@/common/components/atoms/GoogleButton';
import { FormTitle } from '@/common/components/form/Form';
import { Input } from '@/common/components/form/Input';
import SubmitButton from '@/common/components/form/SubmitButton';
import { RedSpan } from '@/common/components/form/styles';

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

import { auth } from '@/firebase-config';

import { StyledPage, SignupText, StyledForm } from './styles';

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: -10px;
  align-self: flex-end;

  &:hover {
    text-decoration: underline;
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
        // force token refresh so useUser picks up new role immediately
        await userCredential.user.getIdToken(true);
      }

      navigate('/', { replace: true });
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

      navigate('/', { replace: true });
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
        <FormTitle>{inviteToken ? 'Accept Invitation' : 'Login'}</FormTitle>

        <GoogleButton
          onClick={handleGoogleLogin}
          isLoading={isLoading}
          text="Login with Google"
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

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </SubmitButton>

        <StyledLink to="/forgot-password">Forgot Password?</StyledLink>

        <SignupText>
          Don't have an account?{' '}
          <StyledLink to="/signup">Create</StyledLink>
        </SignupText>
      </StyledForm>
    </StyledPage>
  );
}