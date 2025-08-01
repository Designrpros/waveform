"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

// --- Styled Components ---
const Container = styled.div`
  max-width: 500px; margin: 4rem auto; padding: 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 1rem; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;
const Title = styled.h2`
  font-size: 2rem; font-weight: 700; color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
`;
const Form = styled.form`
  display: flex; flex-direction: column; gap: 1rem;
`;
const Label = styled.label`
  display: block; font-size: 0.95rem; font-weight: 500;
  color: ${({ theme }) => theme.text}; margin-bottom: 0.25rem; text-align: left;
`;
const Input = styled.input`
  width: 100%; padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem; background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text}; font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none; border-color: ${({ theme }) => theme.accentColor};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accentColor}33;
  }
`;
const Button = styled.button`
  display: inline-flex; align-items: center; justify-content: center;
  gap: 0.75rem; border-radius: 9999px; background: ${({ theme }) => theme.accentGradient};
  color: ${({ theme }) => theme.primaryButtonTextColor}; padding: 0.75rem 2rem;
  font-weight: 600; font-size: 1.1rem; border: none; cursor: pointer;
  transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const ErrorMessage = styled.p`
  color: #dc3545; font-size: 0.9rem; margin-top: 1rem;
`;
const ToggleText = styled.p`
  font-size: 0.95rem; margin-top: 1.5rem;
  color: ${({ theme }) => theme.subtleText};
`;
const ToggleLink = styled.span`
  color: ${({ theme }) => theme.accentColor};
  font-weight: 600;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const LoginPage: NextPage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    if (user) {
      router.push('/discover');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Registration successful! Please log in with your new account.');
        setIsRegistering(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/discover');
      }
    } catch (err: unknown) { // Corrected: Catch as unknown for type safety
        let errorMessage = 'An unexpected error occurred. Please try again.';
        // Type guard to check if the error is a Firebase error with a code
        if (typeof err === 'object' && err !== null && 'code' in err) {
            const firebaseError = err as { code: string };
            switch (firebaseError.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters.';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password. Please try again.';
                    break;
                default:
                    errorMessage = 'An authentication error occurred. Please try again later.';
                    break;
            }
        }
        setError(errorMessage);
    }
  };

  return (
    <>
      <Head>
        <title>{isRegistering ? 'Register' : 'Login'} - Waveform</title>
      </Head>
      <Container>
        <Title>{isRegistering ? 'Create Your Account' : 'Login to Waveform'}</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password" id="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">{isRegistering ? 'Register' : 'Login'}</Button>
        </Form>
        <ToggleText>
          {isRegistering ? 'Already have an account?' : 'Don\'t have an account yet?'}
          {' '}
          <ToggleLink onClick={() => setIsRegistering(prev => !prev)}>
            {isRegistering ? 'Log in here' : 'Register here'}
          </ToggleLink>
        </ToggleText>
      </Container>
    </>
  );
};

export default LoginPage;
