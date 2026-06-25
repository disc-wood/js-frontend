import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { programs } from '@/config/programs';
import { authFetch } from '@/common/utils/authFetch';

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

const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  ${SectionTitle} {
    margin-bottom: 0;
  }
`;

const Form = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
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

const ProgramsField = styled(Field)`
  display: grid;
  grid-template-rows: auto 1fr;

  @media (max-width: 600px) {
    display: flex;
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
  align-self: flex-end;
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

const EditEmailButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  background-color: #ffffff;
  color: #777777;
  border: 1px solid #e4e4e4;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: #b4b4b4;
    color: #0a0a0a;
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
    $status === 'pending' ? '#FEF3C7' :
    $status === 'expired' ? '#FDE0C2' :
    '#fee2e2'};
  color: ${({ $status }) =>
    $status === 'accepted' ? '#085041' :
    $status === 'pending' ? '#92740C' :
    $status === 'expired' ? '#9A3412' :
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

const RevokeButton = styled(SmallButton)`
  padding: 3px 9px;
  font-size: 11px;
`;

const TagPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-self: center;
  gap: 8px;

  @media (max-width: 600px) {
    align-self: flex-start;
  }
`;

const TAG_COLORS = {
  oakton: { bg: '#E1F5EE', text: '#006853', hoverBg: '#bfe9da', selectedBg: '#006853', selectedHoverBg: '#004d3d' },
  ihtu: { bg: '#E8EEF8', text: '#0C447C', hoverBg: '#c3d4ed', selectedBg: '#0C447C', selectedHoverBg: '#082f57' },
};

const SelectableProgramTag = styled.button`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.15s ease, color 0.15s ease;
  background: ${({ $program, $selected }) =>
    $selected ? TAG_COLORS[$program].selectedBg : TAG_COLORS[$program].bg};
  color: ${({ $program, $selected }) =>
    $selected ? '#ffffff' : TAG_COLORS[$program].text};

  &:hover {
    background: ${({ $program, $selected }) =>
      $selected ? TAG_COLORS[$program].selectedHoverBg : TAG_COLORS[$program].hoverBg};
  }
`;

const ProgramTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  @media (min-width: 601px) {
    gap: 20px;
  }
`;

const ProgramTagGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (min-width: 601px) {
    gap: 8px;
    padding-right: 20px;
    border-right: 1px solid #eaeaea;

    &:last-child {
      padding-right: 0;
      border-right: none;
    }
  }
`;

const ProgramTag = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  background: ${({ $program }) => ($program === 'oakton' ? '#E1F5EE' : '#E8EEF8')};
  color: ${({ $program }) => ($program === 'oakton' ? '#006853' : '#0C447C')};
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

// Email template modal (invites & revocations)
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 28px;
  width: min(560px, calc(100vw - 32px));
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const ModalTitle = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: #0a0a0a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #aaaaaa;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;

  &:hover { color: #0a0a0a; }
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #555555;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  font-size: 13.5px;
  font-family: inherit;
  color: #0a0a0a;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  min-height: 180px;
  line-height: 1.6;
  transition: border-color 0.15s ease;

  &:focus { border-color: #0C447C; }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled.button`
  padding: 8px 18px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  background: #ffffff;
  color: #0a0a0a;
  font-size: 13.5px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;

  &:hover { border-color: #0a0a0a; }
`;

const SaveButton = styled.button`
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  background: #0a0a0a;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;

  &:hover { background: #2a2a2a; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// Default email copy — must stay in sync with the fallback text in inviteRoutes.js
const DEFAULT_INVITE_SUBJECT = "You've been invited to the Learner Tracking System";
const defaultInviteBody = (label) =>
  `Hi,\n\nYou've been invited to supervise the ${label} program on the Learner Tracking System.\n\nClick the link below to accept your invitation:\n\n<a href="{{invite_link}}">{{invite_link}}</a>\n\nThis link will expire in 7 days.`;

const defaultRevokeSubject = (label) => `Your access to ${label} has been revoked`;
const defaultRevokeBody = (label) =>
  `Hi,\n\nYour access to the ${label} program on the Learner Tracking System has been revoked.\n\nIf you believe this was a mistake, please contact your admin.`;

const defaultCancelSubject = (label) => `Your invitation to ${label} has been canceled`;
const defaultCancelBody = (label) =>
  `Hi,\n\nYour invitation to supervise the ${label} program on the Learner Tracking System has been canceled.\n\nIf you believe this was a mistake, please contact your admin.`;

// Shared modal for editing per-program email copy (used for both invite and revocation emails)
function EmailTemplateModal({ title, templatePrefix, templates, defaultSubject, defaultBody, onSave, onClose, saving }) {
  const [activeProgramId, setActiveProgramId] = useState(programs[0]?.id || '');

  const getDraft = (id) => {
    const t = templates[`${templatePrefix}-${id}`];
    if (t) return { subject: t.subject, body: t.body };
    const label = programs.find((p) => p.id === id)?.label || id;
    return { subject: defaultSubject(label), body: defaultBody(label) };
  };

  const [draft, setDraft] = useState(() => getDraft(activeProgramId));

  const handleProgramChange = (id) => {
    setActiveProgramId(id);
    setDraft(getDraft(id));
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <TagPicker>
          {programs.map((p) => (
            <SelectableProgramTag
              key={p.id}
              type="button"
              $program={p.id}
              $selected={activeProgramId === p.id}
              onClick={() => handleProgramChange(p.id)}
            >
              {p.label}
            </SelectableProgramTag>
          ))}
        </TagPicker>

        <div>
          <FieldLabel htmlFor={`${templatePrefix}-subject`}>Subject</FieldLabel>
          <Input
            id={`${templatePrefix}-subject`}
            style={{ width: '100%', boxSizing: 'border-box' }}
            value={draft.subject}
            onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
          />
        </div>

        <div>
          <FieldLabel htmlFor={`${templatePrefix}-body`}>Body</FieldLabel>
          <Textarea
            id={`${templatePrefix}-body`}
            value={draft.body}
            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
          />
        </div>

        <ModalFooter>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={() => onSave(`${templatePrefix}-${activeProgramId}`, draft)} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </SaveButton>
        </ModalFooter>
      </ModalCard>
    </Backdrop>
  );
}

// --- Component ---
export default function ManageAccess() {
  const [email, setEmail] = useState('');
  const [selectedProgramIds, setSelectedProgramIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [invitations, setInvitations] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  const [emailTemplates, setEmailTemplates] = useState({});
  const [editingInvites, setEditingInvites] = useState(false);
  const [editingRevocations, setEditingRevocations] = useState(false);
  const [editingCancellations, setEditingCancellations] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);

  const programLabel = (id) =>
    programs.find((p) => p.id === id)?.label || id;

  // The backend is a Vercel serverless function — a cold start on the first
  // hit after idle can be slow enough to fail outright, so retry silently
  // before surfacing an error to the user.
  const fetchDataOnce = async () => {
    const [invRes, supRes] = await Promise.all([
      authFetch(`${import.meta.env.VITE_BACKEND_URL}/invite/list`),
      authFetch(`${import.meta.env.VITE_BACKEND_URL}/invite/active`),
    ]);

    if (!invRes.ok || !supRes.ok) {
      throw new Error('Failed to load invites and supervisors.');
    }

    const invData = await invRes.json();
    const supData = await supRes.json();
    setInvitations(invData.invitations || []);
    setSupervisors(supData.supervisors || []);
  };

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    setDataError('');
    const attempts = 3;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        await fetchDataOnce();
        setDataLoading(false);
        return;
      } catch (err) {
        console.error(`Failed to fetch (attempt ${attempt}/${attempts}):`, err);
        if (attempt === attempts) {
          setDataError('Failed to load invites and supervisors.');
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    setDataLoading(false);
  }, []);

  const fetchEmailTemplates = useCallback(async () => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BACKEND_URL}/emailTemplates`);
      const data = await res.json();
      const map = {};
      (Array.isArray(data) ? data : [])
        .filter((t) => t.id.startsWith('invite-') || t.id.startsWith('revoke-') || t.id.startsWith('cancel-'))
        .forEach((t) => { map[t.id] = { subject: t.subject, body: t.body }; });
      setEmailTemplates(map);
    } catch (err) {
      console.error('Failed to fetch email templates:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchEmailTemplates();
  }, [fetchData, fetchEmailTemplates]);

  const handleSaveTemplate = async (templateId, draft) => {
    setSavingTemplate(true);
    try {
      await authFetch(`${import.meta.env.VITE_BACKEND_URL}/emailTemplates/${templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: draft.subject, body: draft.body }),
      });
      setEmailTemplates((prev) => ({ ...prev, [templateId]: { subject: draft.subject, body: draft.body } }));
      setEditingInvites(false);
      setEditingRevocations(false);
      setEditingCancellations(false);
    } catch (err) {
      console.error('Failed to save email template:', err);
    } finally {
      setSavingTemplate(false);
    }
  };

  const toggleProgramSelection = (id) => {
    setSelectedProgramIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSendInvite = async () => {
    if (!email || selectedProgramIds.length === 0) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await Promise.all(
        selectedProgramIds.map(async (programId) => {
          const res = await authFetch(`${import.meta.env.VITE_BACKEND_URL}/invite/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, programId }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to send invite');
        })
      );

      setSuccess(`Invite sent to ${email}`);
      setEmail('');
      setSelectedProgramIds([]);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (token) => {
    if (!window.confirm('Cancel this pending invite?')) return;
    await authFetch(`${import.meta.env.VITE_BACKEND_URL}/invite/cancel/${token}`, {
      method: 'DELETE',
    });
    fetchData();
  };

  const handleRevoke = async (userId, progId) => {
    if (!window.confirm("Revoke this supervisor's access?")) return;
    await authFetch(`${import.meta.env.VITE_BACKEND_URL}/invite/revoke`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, programId: progId }),
    });
    fetchData();
  };

  const pendingInvites = invitations.filter((i) => i.status === 'pending');
  const isExpired = (inv) => new Date(inv.expires_at) < new Date();

  // Group per-program assignment rows into one row per supervisor, ordered by programs.js order
  const groupedSupervisors = Object.values(
    supervisors.reduce((acc, sup) => {
      if (!acc[sup.user_id]) {
        acc[sup.user_id] = { user_id: sup.user_id, email: sup.email, assignments: [] };
      }
      acc[sup.user_id].assignments.push(sup);
      return acc;
    }, {})
  ).map((group) => ({
    ...group,
    assignments: group.assignments.sort(
      (a, b) => programs.findIndex((p) => p.id === a.program_id) - programs.findIndex((p) => p.id === b.program_id)
    ),
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Manage access</PageTitle>
        <PageSubtitle>Invite supervisors and manage program access.</PageSubtitle>
      </PageHeader>

      {dataError && (
        <StatusMessage $error>
          {dataError}{' '}
          <SmallButton type="button" onClick={fetchData} style={{ marginLeft: 8 }}>
            Retry
          </SmallButton>
        </StatusMessage>
      )}

      <Section>
        <SectionHeaderRow>
          <SectionTitle>Send invite</SectionTitle>
          <EditEmailButton type="button" onClick={() => setEditingInvites(true)}>
            <span aria-hidden="true">✎</span> Edit Invites
          </EditEmailButton>
        </SectionHeaderRow>
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
          <ProgramsField>
            <Label>Programs</Label>
            <TagPicker>
              {programs.map((p) => (
                <SelectableProgramTag
                  key={p.id}
                  type="button"
                  $program={p.id}
                  $selected={selectedProgramIds.includes(p.id)}
                  onClick={() => toggleProgramSelection(p.id)}
                >
                  {p.label}
                </SelectableProgramTag>
              ))}
            </TagPicker>
          </ProgramsField>
          <Button onClick={handleSendInvite} disabled={loading || !email || selectedProgramIds.length === 0}>
            {loading ? 'Sending...' : 'Send invite'}
          </Button>
        </Form>

        {error && <StatusMessage $error>{error}</StatusMessage>}
        {success && <StatusMessage>{success}</StatusMessage>}
      </Section>

      <Section>
        <SectionHeaderRow>
          <SectionTitle>Pending invites</SectionTitle>
          <EditEmailButton type="button" onClick={() => setEditingCancellations(true)}>
            <span aria-hidden="true">✎</span> Edit Cancellations
          </EditEmailButton>
        </SectionHeaderRow>
        {dataLoading ? (
          <EmptyState>Loading…</EmptyState>
        ) : pendingInvites.length === 0 ? (
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
                      <Td>
                        {isExpired(inv)
                          ? <StatusBadge $status="expired">Expired</StatusBadge>
                          : <StatusBadge $status="pending">Pending</StatusBadge>}
                      </Td>
                      <Td>
                        <RevokeButton onClick={() => handleCancel(inv.token)}>Cancel</RevokeButton>
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
                    <MobileCardValue>
                      {isExpired(inv)
                        ? <StatusBadge $status="expired">Expired</StatusBadge>
                        : <StatusBadge $status="pending">Pending</StatusBadge>}
                    </MobileCardValue>
                  </MobileCardRow>
                  <MobileCardActions>
                    <RevokeButton onClick={() => handleCancel(inv.token)}>Cancel</RevokeButton>
                  </MobileCardActions>
                </MobileCard>
              ))}
            </MobileCardList>
          </>
        )}
      </Section>

      <Section>
        <SectionHeaderRow>
          <SectionTitle>Active supervisors</SectionTitle>
          <EditEmailButton type="button" onClick={() => setEditingRevocations(true)}>
            <span aria-hidden="true">✎</span> Edit Revocations
          </EditEmailButton>
        </SectionHeaderRow>
        {dataLoading ? (
          <EmptyState>Loading…</EmptyState>
        ) : groupedSupervisors.length === 0 ? (
          <EmptyState>No active supervisors.</EmptyState>
        ) : (
          <>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Email</Th>
                    <Th>Programs</Th>
                  </tr>
                </thead>
                <tbody>
                  {groupedSupervisors.map((group) => (
                    <Tr key={group.user_id}>
                      <Td>{group.email}</Td>
                      <Td>
                        <ProgramTagRow>
                          {group.assignments.map((sup) => (
                            <ProgramTagGroup key={sup.program_id}>
                              <ProgramTag $program={sup.program_id}>{programLabel(sup.program_id)}</ProgramTag>
                              <RevokeButton onClick={() => handleRevoke(sup.user_id, sup.program_id)}>
                                Revoke
                              </RevokeButton>
                            </ProgramTagGroup>
                          ))}
                        </ProgramTagRow>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>

            <MobileCardList>
              {groupedSupervisors.map((group) => (
                <MobileCard key={group.user_id}>
                  <MobileCardRow>
                    <MobileCardLabel>Email</MobileCardLabel>
                    <MobileCardValue>{group.email}</MobileCardValue>
                  </MobileCardRow>
                  <MobileCardRow>
                    <MobileCardLabel>Programs</MobileCardLabel>
                  </MobileCardRow>
                  <ProgramTagRow>
                    {group.assignments.map((sup) => (
                      <ProgramTagGroup key={sup.program_id}>
                        <ProgramTag $program={sup.program_id}>{programLabel(sup.program_id)}</ProgramTag>
                        <RevokeButton onClick={() => handleRevoke(sup.user_id, sup.program_id)}>
                          Revoke
                        </RevokeButton>
                      </ProgramTagGroup>
                    ))}
                  </ProgramTagRow>
                </MobileCard>
              ))}
            </MobileCardList>
          </>
        )}
      </Section>

      {editingInvites && (
        <EmailTemplateModal
          title="Edit invite emails"
          templatePrefix="invite"
          templates={emailTemplates}
          defaultSubject={() => DEFAULT_INVITE_SUBJECT}
          defaultBody={defaultInviteBody}
          onSave={handleSaveTemplate}
          onClose={() => setEditingInvites(false)}
          saving={savingTemplate}
        />
      )}

      {editingRevocations && (
        <EmailTemplateModal
          title="Edit revocation emails"
          templatePrefix="revoke"
          templates={emailTemplates}
          defaultSubject={defaultRevokeSubject}
          defaultBody={defaultRevokeBody}
          onSave={handleSaveTemplate}
          onClose={() => setEditingRevocations(false)}
          saving={savingTemplate}
        />
      )}

      {editingCancellations && (
        <EmailTemplateModal
          title="Edit cancellation emails"
          templatePrefix="cancel"
          templates={emailTemplates}
          defaultSubject={defaultCancelSubject}
          defaultBody={defaultCancelBody}
          onSave={handleSaveTemplate}
          onClose={() => setEditingCancellations(false)}
          saving={savingTemplate}
        />
      )}
    </PageContainer>
  );
}