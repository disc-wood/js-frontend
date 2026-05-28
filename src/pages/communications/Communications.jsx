import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TabCard from '@/common/components/atoms/TabCard';
import { programs } from '@/config/programs';
import { useUser } from '@/common/hooks/useUser';
import { authFetch } from '@/common/utils/authFetch';

// ---------------------------------------------------------------------------
// Email data — add or remove entries here to change what appears in each tab
// ---------------------------------------------------------------------------
const EMAILS = [
  {
    id: 'ihtu-application-received',
    program: 'ihtu',
    name: 'Application Received',
    triggerLabel: 'Sends when: application submitted',
    subject: 'Your IHTU Application Has Been Received',
    body: `Hi {{first_name}},\n\nThank you for submitting your I Hope They Understand application. We've received your information and will be in touch soon.\n\n— The IHTU Team`,
  },
  {
    id: 'oakton-application-received',
    program: 'oakton',
    name: 'Application Received',
    triggerLabel: 'Sends when: application submitted',
    subject: 'Your Oakton WEI Application Has Been Received',
    body: `Hi {{first_name}},\n\nWe've received your application for the Oakton Workforce Empowerment Initiative. Someone from our team will be in contact with you soon.\n\nQuestions? Email wei@oakton.edu.\n\n— The Oakton WEI Team`,
  },
  {
    id: 'oakton-accepted',
    program: 'oakton',
    name: 'Accepted',
    triggerLabel: "Sends when: applicant marked Accepted",
    subject: "Congratulations — You've Been Selected for the WEI Grant",
    body: `Hi {{first_name}},\n\nWe're excited to let you know that you've been selected to receive the Workforce Empowerment Initiative (WEI) grant!\n\nSomeone from our team will be reaching out soon with next steps. If you have any questions, feel free to contact us at wei@oakton.edu.\n\nWe look forward to supporting you on your journey.\n\n— The Oakton WEI Team`,
  },
  {
    id: 'oakton-program-completed',
    program: 'oakton',
    name: 'Program Completed',
    triggerLabel: 'Sends when: student marked Program Completed',
    subject: 'Congratulations on Completing Your Program!',
    body: `Hi {{first_name}},\n\nCongratulations on completing the {{program_name}} program with the Workforce Empowerment Initiative! This is a huge accomplishment and we are so proud of everything you've achieved.\n\nWe wish you all the best in your next steps. If you ever need support or want to stay connected, don't hesitate to reach out to us at wei@oakton.edu.\n\n— The Oakton WEI Team`,
  },
];

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------
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
  }
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  color: #888888;
  margin: 0;
`;

const LoadingState = styled.div`
  font-size: 13px;
  color: #555555;
  padding: 2rem;
`;

const EmailRow = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: none;
  border: none;
  border-bottom: 1px solid #f3f3f3;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background-color 0.12s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #fafafa;
  }
`;

const EmailName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #0a0a0a;
`;

const TriggerLabel = styled.span`
  font-size: 12px;
  color: #888888;
`;

const Chevron = styled.span`
  font-size: 12px;
  color: #cccccc;
  margin-left: 16px;
  flex-shrink: 0;
`;

// Modal
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

const TriggerBadge = styled.div`
  font-size: 12px;
  color: #555555;
  background: #f5f5f5;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  padding: 8px 12px;
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

const Input = styled.input`
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
  transition: border-color 0.15s ease;

  &:focus { border-color: #0C447C; }
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
`;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function EmailList({ emails, onSelect }) {
  return (
    <div>
      {emails.map((email) => (
        <EmailRow key={email.id} onClick={() => onSelect(email)}>
          <EmailName>{email.name}</EmailName>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TriggerLabel>{email.triggerLabel}</TriggerLabel>
            <Chevron>›</Chevron>
          </div>
        </EmailRow>
      ))}
    </div>
  );
}

function EmailModal({ email, draft, onChange, onSave, onClose, saving }) {
  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{email.name}</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <TriggerBadge>{email.triggerLabel}</TriggerBadge>

        <div>
          <FieldLabel htmlFor="email-subject">Subject</FieldLabel>
          <Input
            id="email-subject"
            value={draft.subject}
            onChange={(e) => onChange('subject', e.target.value)}
          />
        </div>

        <div>
          <FieldLabel htmlFor="email-body">Body</FieldLabel>
          <Textarea
            id="email-body"
            value={draft.body}
            onChange={(e) => onChange('body', e.target.value)}
          />
        </div>

        <ModalFooter>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</SaveButton>
        </ModalFooter>
      </ModalCard>
    </Backdrop>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Communications() {
  const { role, assignedPrograms, loading } = useUser();
  const [emails, setEmails] = useState(EMAILS);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ subject: '', body: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
    authFetch(`${baseUrl}/emailTemplates`)
      .then((r) => r.ok ? r.json() : [])
      .then((templates) => {
        setEmails((prev) =>
          prev.map((email) => {
            const t = templates.find((t) => t.id === email.id);
            return t ? { ...email, subject: t.subject, body: t.body } : email;
          })
        );
      })
      .catch(() => {});
  }, []);

  const handleOpen = (email) => {
    setEditing(email);
    setDraft({ subject: email.subject, body: email.body });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
      await authFetch(`${baseUrl}/emailTemplates/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: draft.subject, body: draft.body }),
      });
      setEmails((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...draft } : e))
      );
      setEditing(null);
    } catch {
      // keep modal open on error
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState>Loading...</LoadingState>;

  const visiblePrograms = role === 'admin'
    ? programs
    : programs.filter((p) => assignedPrograms.includes(p.id));

  const tabs = visiblePrograms.map((p) => ({
    id: p.id,
    label: p.label,
    content: (
      <EmailList
        emails={emails.filter((e) => e.program === p.id)}
        onSelect={handleOpen}
      />
    ),
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Communications</PageTitle>
        <PageSubtitle>Manage automated emails sent to applicants and students.</PageSubtitle>
      </PageHeader>
      <TabCard tabs={tabs} />
      {editing && (
        <EmailModal
          email={editing}
          draft={draft}
          onChange={(field, value) => setDraft((d) => ({ ...d, [field]: value }))}
          onSave={handleSave}
          onClose={() => setEditing(null)}
          saving={saving}
        />
      )}
    </PageContainer>
  );
}
