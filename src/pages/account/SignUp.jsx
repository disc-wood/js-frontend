import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import GoogleButton from '@/common/components/atoms/GoogleButton';
import { Form, FormTitle } from '@/common/components/form/Form';
import { Input } from '@/common/components/form/Input';
import SubmitButton from '@/common/components/form/SubmitButton';
import { useUser } from '@/common/contexts/UserContext';
import { RedSpan } from '@/common/components/form/styles';

import { StyledPage, StyledForm } from './styles';

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { googleAuth } = useUser();

  const [formState, setFormState] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    username: '',
  });

  const handleChangeFirstname = (e) => {
    setFormState({ ...formState, firstname: e.target.value });
    setError('');
  };

  const handleChangeLastname = (e) => {
    setFormState({ ...formState, lastname: e.target.value });
    setError('');
  };

  const handleChangeEmail = (e) => {
    setFormState({ ...formState, email: e.target.value });
    setError('');
  };

  const handleChangePassword = (e) => {
    setFormState({ ...formState, password: e.target.value });
    setError('');
  };

  const handleChangeUsername = (e) => {
    setFormState({ ...formState, username: e.target.value });
    setError('');
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    try {
      await googleAuth();
      navigate('/', { replace: true });
    } catch (error) {
      setError(error.message);
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
            username: formState.username || undefined,
            firstname: formState.firstname || undefined,
            lastname: formState.lastname || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }
      navigate('/login', {
        state: {
          message:
            'Account created successfully! Please check your email to verify your account.',
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
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
          text='Sign up with Google'
        />
        <Input.Text
          name='username'
          placeholder='Username'
          value={formState.username}
          onChange={handleChangeUsername}
          required
        />
        <Input.Text
          name='firstname'
          placeholder='First name'
          value={formState.firstname}
          onChange={handleChangeFirstname}
        />
        <Input.Text
          name='lastname'
          placeholder='Last name'
          value={formState.lastname}
          onChange={handleChangeLastname}
        />
        <Input.Text
          name='email'
          placeholder='Email'
          value={formState.email}
          onChange={handleChangeEmail}
          required
        />
        <Input.Password
          name='password'
          placeholder='Password'
          value={formState.password}
          onChange={handleChangePassword}
          required
        />
        <SubmitButton onClick={() => {}} disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </SubmitButton>
        
      </StyledForm>
    </StyledPage>
  );
}
