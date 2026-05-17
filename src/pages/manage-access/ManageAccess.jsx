import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { programs } from '@/config/programs';

// --- Styled Components ---
const PageContainer = styled.div`
  flex: 1;
  padding: 2rem 2.5rem;
  overflow: auto;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.5px;
  margin: 0 0 6px 0;
  color: #0a0a0a;

  @media (max-width: 768px) {
    font-size: 22px;
    letter-spacing: -0.3px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  color: #888888;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Section = styled.div`
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
  color: #0a0a0a;
`;

const Form = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 200px;

  @media (max-width: 600px) {
    min-width: 0;
    width: 100%;
  }
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #555555;
  letter-spacing: 0.2px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #0a0a0a;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: #bbbbbb;
  }

  &:focus {
    border-color: #0C447C;
    box-shadow: 0 0 0 3px rgba(12, 68, 124, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #0a0a0a;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: #0C447C;
    box-shadow: 0 0 0 3px rgba(12, 68, 124, 0.1);
  }
`;

const Button = styled.button`
  padding: 10px 18px;
  background-color: #0a0a0a;
  color: #ffffff;
  border: 1px solid #0a0a0a;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    background-color: #2a2a2a;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: 12px;
  font-size: 13px;
  color: ${({ $error }) => ($error ? '#991b1b' : '#085041')};
  background-color: ${({ $error }) => ($error ? '#fee2e2' : '#E1F5EE')};
  padding: 8px 12px;
  border-radius: 6px;
`;

// Desktop/tablet table
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: inherit;

  @media (max-width: 600px) {
    display: none;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid #eaeaea;
  background-color: #fafafa;
  font-size: 11px;
  font-weight: 500;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const Td = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid #f3f3f3;
  font-size: 13px;
  color: #0a0a0a;
`;

const Tr = styled.tr`
  transition: background-color 0.1s ease;

  &:hover {
    background-color: #fafafa;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
  background: ${({ $status }) =>
    $status === 'accepted' ? '#E1F5EE' :
    $status === 'pending' ? '#FAEEDA' :
    '#fee2e2'};
  color: ${({ $status }) =>
    $status === 'accepted' ? '#085041' :
    $status === 'pending' ? '#854F0B' :
    '#991b1b'};
`;

const SmallButton = styled.button`
  padding: 5px 12px;
  background-color: #ffffff;
  color: #555555;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: #991b1b;
    color: #991b1b;
  }
`;

const EmptyState = styled.div`
  font-size: 13px;
  color: #888888;
  padding: 20px 0;
  text-align: center;
`;

const TableWrapper = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 600px) {
    border: none;
    border-radius: 0;
  }
`;

// Mobile card view
const MobileCardList = styled.div`
  display: none;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const MobileCard = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #ffffff;
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const MobileCardLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  flex-shrink: 0;
`;

const MobileCardValue = styled.span`
  font-size: 13px;
  color: #0a0a0a;
  text-align: right;
  word-break: break-word;
`;

const MobileCardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
  border-top: 1px solid #f3f3f3;
  margin-top: 4px;
`;

// --- Component ---
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
      <PageHeader>
        <PageTitle>Manage access</PageTitle>
        <PageSubtitle>Invite supervisors and manage program access.</PageSubtitle>
      </PageHeader>

      <Section>
        <SectionTitle>Send invite</SectionTitle>
        <Form>
          <Field>
            <Label>Supervisor email</Label>
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
            {loading ? 'Sending...' : 'Send invite'}
          </Button>
        </Form>

        {error && <StatusMessage $error>{error}</StatusMessage>}
        {success && <StatusMessage>{success}</StatusMessage>}
      </Section>

      <Section>
        <SectionTitle>Pending invites</SectionTitle>
        {pendingInvites.length === 0 ? (
          <EmptyState>No pending invites.</EmptyState>
        ) : (
          <>
            <TableWrapper>
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
                    <Tr key={inv.id}>
                      <Td>{inv.email}</Td>
                      <Td>{programLabel(inv.program_id)}</Td>
                      <Td>{new Date(inv.created_at).toLocaleDateString()}</Td>
                      <Td><StatusBadge $status={inv.status}>{inv.status}</StatusBadge></Td>
                      <Td>
                        <SmallButton onClick={() => handleCancel(inv.token)}>Cancel</SmallButton>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>

            <MobileCardList>
              {pendingInvites.map((inv) => (
                <MobileCard key={inv.id}>
                  <MobileCardRow>
                    <MobileCardLabel>Email</MobileCardLabel>
                    <MobileCardValue>{inv.email}</MobileCardValue>
                  </MobileCardRow>
                  <MobileCardRow>
                    <MobileCardLabel>Program</MobileCardLabel>
                    <MobileCardValue>{programLabel(inv.program_id)}</MobileCardValue>
                  </MobileCardRow>
                  <MobileCardRow>
                    <MobileCardLabel>Sent</MobileCardLabel>
                    <MobileCardValue>{new Date(inv.created_at).toLocaleDateString()}</MobileCardValue>
                  </MobileCardRow>
                  <MobileCardRow>
                    <MobileCardLabel>Status</MobileCardLabel>
                    <MobileCardValue><StatusBadge $status={inv.status}>{inv.status}</StatusBadge></MobileCardValue>
                  </MobileCardRow>
                  <MobileCardActions>
                    <SmallButton onClick={() => handleCancel(inv.token)}>Cancel</SmallButton>
                  </MobileCardActions>
                </MobileCard>
              ))}
            </MobileCardList>
          </>
        )}
      </Section>

      <Section>
        <SectionTitle>Active supervisors</SectionTitle>
        {supervisors.length === 0 ? (
          <EmptyState>No active supervisors.</EmptyState>
        ) : (
          <>
            <TableWrapper>
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
                    <Tr key={sup.id}>
                      <Td>{sup.email}</Td>
                      <Td>{programLabel(sup.program_id)}</Td>
                      <Td>
                        <SmallButton onClick={() => handleRevoke(sup.user_id, sup.program_id)}>
                          Revoke
                        </SmallButton>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>

            <MobileCardList>
              {supervisors.map((sup) => (
                <MobileCard key={sup.id}>
                  <MobileCardRow>
                    <MobileCardLabel>Email</MobileCardLabel>
                    <MobileCardValue>{sup.email}</MobileCardValue>
                  </MobileCardRow>
                  <MobileCardRow>
                    <MobileCardLabel>Program</MobileCardLabel>
                    <MobileCardValue>{programLabel(sup.program_id)}</MobileCardValue>
                  </MobileCardRow>
                  <MobileCardActions>
                    <SmallButton onClick={() => handleRevoke(sup.user_id, sup.program_id)}>
                      Revoke
                    </SmallButton>
                  </MobileCardActions>
                </MobileCard>
              ))}
            </MobileCardList>
          </>
        )}
      </Section>
    </PageContainer>
  );
}