import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: 'Inter', sans-serif;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
`;

const Message = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
`;

const Button = styled.button`
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #222;
  }
`;

export default function InviteAccept() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function validate() {
      if (!token) {
        setStatus('invalid');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/invite/validate?token=${token}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          setStatus(data.status || 'invalid');
          return;
        }

        setStatus('valid');
      } catch {
        setStatus('invalid');
      }
    }

    validate();
  }, [token]);

  const handleAccept = async () => {
    // sign out any currently logged-in user so the new supervisor can log in cleanly
    try {
      await signOut(getAuth());
    } catch (err) {
      console.error('Sign out error:', err);
    }
    navigate(`/login?invite=${token}`);
  };

  if (status === 'loading') {
    return <PageContainer><p>Validating invite...</p></PageContainer>;
  }

  return (
    <PageContainer>
      <Card>
        {status === 'valid' && (
          <>
            <Title>You've been invited!</Title>
            <Message>Log in or create an account to accept your invitation and access your program.</Message>
            <Button onClick={handleAccept}>
              Accept Invitation
            </Button>
          </>
        )}
        {status === 'expired' && (
          <>
            <Title>Invite Expired</Title>
            <Message>This invite link has expired. Please ask your admin to send a new one.</Message>
          </>
        )}
        {status === 'used' && (
          <>
            <Title>Invite Already Used</Title>
            <Message>This invite link has already been accepted.</Message>
          </>
        )}
        {status === 'invalid' && (
          <>
            <Title>Invalid Invite</Title>
            <Message>This invite link is not valid. Please check the link and try again.</Message>
          </>
        )}
      </Card>
    </PageContainer>
  );
}