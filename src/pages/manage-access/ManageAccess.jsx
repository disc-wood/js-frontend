import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { programs } from '@/config/programs';

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
  &:focus { border-color: #2563eb; }
`;

const Select = styled.select`
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  outline: none;
  &:focus { border-color: #2563eb; }
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #222; }
  &:disabled { background: #9ca3af; cursor: not-allowed; }
`;

const StatusMessage = styled.div`
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: ${({ $error }) => ($error ? '#dc2626' : '#16a34a')};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #d1d5db;
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  background: #f9fafb;
`;

const Td = styled.td`
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ $status }) =>
    $status === 'accepted' ? '#dcfce7' :
    $status === 'pending' ? '#fef3c7' :
    '#fee2e2'};
  color: ${({ $status }) =>
    $status === 'accepted' ? '#166534' :
    $status === 'pending' ? '#92400e' :
    '#991b1b'};
`;

const SmallButton = styled.button`
  padding: 0.3rem 0.7rem;
  background: white;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover { background: #fee2e2; }
`;

const EmptyState = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  padding: 1rem 0;
  text-align: center;
`;

export default function ManageAccess() {
  const [email, setEmail] = useState('');
  const [programId, setProgramId] = useState(programs[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [invitations, setInvitations] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const programLabel = (id) =>
    programs.find((p) => p.id === id)?.label || id;

  const fetchData = useCallback(async () => {
    try {
      const [invRes, supRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/invite/list`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/invite/active`),
      ]);
      const invData = await invRes.json();
      const supData = await supRes.json();
      setInvitations(invData.invitations || []);
      setSupervisors(supData.supervisors || []);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendInvite = async () => {
    if (!email || !programId) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/invite/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, programId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send invite');

      setSuccess(`Invite sent to ${email}`);
      setEmail('');
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (token) => {
    if (!window.confirm('Cancel this pending invite?')) return;
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/invite/cancel/${token}`, {
      method: 'DELETE',
    });
    fetchData();
  };

  const handleRevoke = async (userId, progId) => {
    if (!window.confirm("Revoke this supervisor's access?")) return;
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/invite/revoke`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, programId: progId }),
    });
    fetchData();
  };

  const pendingInvites = invitations.filter((i) => i.status === 'pending');

  return (
    <PageContainer>
      <PageTitle>Manage Access</PageTitle>

      <Section>
        <SectionTitle>Send Invite</SectionTitle>
        <Form>
          <Field>
            <Label>Supervisor Email Address</Label>
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
          <Button onClick={handleSendInvite} disabled={loading}>
            {loading ? 'Sending...' : 'Send Invite'}
          </Button>
        </Form>

        {error && <StatusMessage $error>{error}</StatusMessage>}
        {success && <StatusMessage>{success}</StatusMessage>}
      </Section>

      <Section>
        <SectionTitle>Pending Invites</SectionTitle>
        {pendingInvites.length === 0 ? (
          <EmptyState>No pending invites.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Program</Th>
                <Th>Sent</Th>
                <Th>Status</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {pendingInvites.map((inv) => (
                <tr key={inv.id}>
                  <Td>{inv.email}</Td>
                  <Td>{programLabel(inv.program_id)}</Td>
                  <Td>{new Date(inv.created_at).toLocaleDateString()}</Td>
                  <Td><StatusBadge $status={inv.status}>{inv.status}</StatusBadge></Td>
                  <Td>
                    <SmallButton onClick={() => handleCancel(inv.token)}>Cancel</SmallButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>

      <Section>
        <SectionTitle>Active Supervisors</SectionTitle>
        {supervisors.length === 0 ? (
          <EmptyState>No active supervisors.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Program</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {supervisors.map((sup) => (
                <tr key={sup.id}>
                  <Td>{sup.email}</Td>
                  <Td>{programLabel(sup.program_id)}</Td>
                  <Td>
                    <SmallButton onClick={() => handleRevoke(sup.user_id, sup.program_id)}>
                      Revoke
                    </SmallButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>
    </PageContainer>
  );
}