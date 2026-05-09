import { useState } from 'react';
import styled from 'styled-components';
import { programs } from '@/config/programs';

// --- Styled Components ---
const PageContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: auto;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--text);
`;

const Section = styled.div`
  background: #f3f3f3;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--text);
`;

const Form = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: #444;
`;

const Input = styled.input`
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: #2563eb;
  }
`;

const Select = styled.select`
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  outline: none;

  &:focus {
    border-color: #2563eb;
  }
`;

const SendButton = styled.button`
  padding: 0.6rem 1.5rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #222;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${({ $error }) => ($error ? '#dc2626' : '#16a34a')};
`;

// --- Component ---
export default function ManageAccess() {
  const [email, setEmail] = useState('');
  const [programId, setProgramId] = useState(programs[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSendInvite = async () => {
    if (!email || !programId) return;
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('http://localhost:5050/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, programId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send invite');

      setStatus({ message: `Invite sent to ${email}`, error: false });
      setEmail('');
    } catch (err) {
      setStatus({ message: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>Manage Access</PageTitle>

      <Section>
        <SectionTitle>Invite a Supervisor</SectionTitle>
        <Form>
          <Field>
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="supervisor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <Label>Program</Label>
            <Select value={programId} onChange={(e) => setProgramId(e.target.value)}>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </Select>
          </Field>
          <SendButton onClick={handleSendInvite} disabled={loading}>
            {loading ? 'Sending...' : 'Send Invite'}
          </SendButton>
        </Form>
        {status && (
          <StatusMessage $error={status.error}>{status.message}</StatusMessage>
        )}
      </Section>
    </PageContainer>
  );
}