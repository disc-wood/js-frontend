import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import GoogleButton from '@/common/components/atoms/GoogleButton';
import { Form, FormTitle } from '@/common/components/form/Form';
import { Input } from '@/common/components/form/Input';
import SubmitButton from '@/common/components/form/SubmitButton';
import { RedSpan } from '@/common/components/form/styles';
import { useUser } from '@/common/contexts/UserContext';

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

// Firebase Error Codes are quite unreadable, so map them to our own user-friendly messages. Add more cases as needed.
function mapAuthCodeToMessage(authCode) {
  switch (authCode) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/invalid-credential":
      return "Email or password is incorrect. Please try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { login, googleAuth } = useUser();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formState.email, formState.password);
      navigate('/', { replace: true });
    } catch (error) {
      setError(mapAuthCodeToMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleAuth();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <StyledPage>
      <StyledForm onSubmit={handleSubmit}>
        <FormTitle>Login</FormTitle>
        <GoogleButton
          onClick={handleGoogleLogin}
          isLoading={isLoading}
          text='Login with Google'
        />
        {error && <RedSpan>{error}</RedSpan>}
        <Input.Text
          name='email'
          placeholder='Email'
          value={formState.email}
          onChange={handleChange}
          required
        />
        <Input.Password
          name='password'
          placeholder='Password'
          value={formState.password}
          onChange={handleChange}
          required
        />
        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </SubmitButton>
        <StyledLink to='/forgot-password'>Forgot Password?</StyledLink>
        <SignupText>
          Don't have an account? <StyledLink to='/signup'>Create</StyledLink>
        </SignupText>
      
      </StyledForm>
    </StyledPage>
  );
}
