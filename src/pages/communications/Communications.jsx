import React, { useState } from 'react';
import styled from 'styled-components';

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

const TabBar = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 24px;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  color: ${({ $active }) => ($active ? '#0a0a0a' : '#888888')};
  cursor: pointer;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#0a0a0a' : 'transparent')};
  margin-bottom: -1px;
  transition: color 0.15s ease, border-color 0.15s ease;

  &:hover {
    color: #0a0a0a;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 13px;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const PrimaryButton = styled.button`
  background-color: #0a0a0a;
  color: #ffffff;
  border: 1px solid #0a0a0a;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.15s ease, transform 0.1s ease;

  &:hover {
    background-color: #2a2a2a;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
`;

const SectionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 13px;
  background-color: ${({ $type }) =>
    $type === 'manual' ? '#E6F1FB' :
    $type === 'auto' ? '#FAEEDA' :
    '#E1F5EE'};
  color: ${({ $type }) =>
    $type === 'manual' ? '#0C447C' :
    $type === 'auto' ? '#854F0B' :
    '#085041'};
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: #0a0a0a;
  margin: 0;
`;

const SectionCount = styled.span`
  font-size: 12px;
  color: #888888;
`;

const SectionDescription = styled.p`
  font-size: 12px;
  color: #888888;
  margin: 0 0 14px 0;
  line-height: 1.5;
  padding-left: 34px;

  @media (max-width: 480px) {
    padding-left: 0;
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
`;

const TemplateCard = styled.div`
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-left: 3px solid ${({ $type }) =>
    $type === 'manual' ? '#0C447C' :
    $type === 'auto' ? '#BA7517' :
    '#1D9E75'};
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

const TemplateName = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #0a0a0a;
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const TemplateDescription = styled.p`
  font-size: 12px;
  color: #555555;
  margin: 0 0 14px 0;
  line-height: 1.5;
`;

const TemplateMeta = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f3f3f3;
  font-size: 11px;
  color: #888888;
`;

const EmptyGroup = styled.div`
  padding: 20px;
  border: 1px dashed #eaeaea;
  border-radius: 8px;
  font-size: 12px;
  color: #888888;
  text-align: center;
`;

// --- Editor Modal ---
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
  padding: 28px;
  font-family: inherit;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #0a0a0a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #888888;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #0a0a0a;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
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
`;

const Textarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #0a0a0a;
  background-color: #ffffff;
  outline: none;
  resize: vertical;
  min-height: 140px;
  line-height: 1.5;

  &:focus {
    border-color: #0C447C;
    box-shadow: 0 0 0 3px rgba(12, 68, 124, 0.1);
  }
`;

const TriggerHint = styled.p`
  font-size: 11px;
  color: #888888;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
`;

const SecondaryButton = styled.button`
  background-color: #ffffff;
  color: #0a0a0a;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    border-color: #0a0a0a;
  }
`;

// --- Sent table ---
const SentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: inherit;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;

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

const StatusPill = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${({ $status }) =>
    $status === 'Sent' ? '#E1F5EE' :
    $status === 'Scheduled' ? '#FAEEDA' :
    '#fee2e2'};
  color: ${({ $status }) =>
    $status === 'Sent' ? '#085041' :
    $status === 'Scheduled' ? '#854F0B' :
    '#991b1b'};
`;

const MobileSentList = styled.div`
  display: none;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const MobileSentCard = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 14px;
`;

const MobileSentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MobileSentLabel = styled.span`
  font-size: 11px;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

// --- Seed data ---
const SEED_TEMPLATES = [
  {
    id: 't1',
    name: 'Next steps after application',
    sendType: 'auto',
    description: 'Sent automatically when an applicant submits the intake form. Includes intake session details and document checklist.',
    sendCount: 142,
    body: "Hi {{first_name}},\n\nThanks for submitting your application! Here's what to expect next:\n\n1. Make note of your intake session date: {{intake_date}}\n2. Join via this Zoom link: {{zoom_link}}\n3. Submit your required documents before the session\n\nWe'll be in touch shortly with additional details.",
  },
  {
    id: 't2',
    name: 'Welcome letter',
    sendType: 'manual',
    description: 'Sent manually to accepted applicants. Includes program of interest and onboarding details.',
    sendCount: 86,
    body: "Hi {{first_name}},\n\nWelcome to the {{program_name}} program! We're excited to have you join us.\n\nYour cohort starts on {{start_date}}. Here's what you need to know to get ready...",
  },
  {
    id: 't3',
    name: 'Mid-program check-in',
    sendType: 'scheduled',
    description: 'Halfway-through-the-program update with what to expect in the second half.',
    sendCount: 38,
    body: "Hi {{first_name}},\n\nYou're now halfway through the program — congratulations! Here's what to expect in the weeks ahead...",
  },
  {
    id: 't4',
    name: 'Program completion',
    sendType: 'manual',
    description: 'Congratulations message sent manually after a learner completes the program.',
    sendCount: 24,
    body: "Hi {{first_name}},\n\nCongratulations on completing the {{program_name}} program! We're so proud of everything you've accomplished...",
  },
  {
    id: 't5',
    name: 'Program starting reminder',
    sendType: 'scheduled',
    description: 'Reminder sent a few days before the program kicks off.',
    sendCount: 67,
    body: "Hi {{first_name}},\n\nYour program starts in just a few days! Here's a quick checklist to make sure you're ready...",
  },
  {
    id: 't6',
    name: 'Monthly newsletter',
    sendType: 'scheduled',
    description: 'General newsletter sent to all active participants and alumni.',
    sendCount: 12,
    body: "Hi {{first_name}},\n\nHere's what's been happening this month in our community...",
  },
  {
    id: 't7',
    name: 'Information session invite',
    sendType: 'manual',
    description: 'Invitation to prospective applicants for an upcoming info session.',
    sendCount: 5,
    body: "Hi {{first_name}},\n\nYou're invited to our upcoming information session on {{session_date}}. RSVP here: {{rsvp_link}}",
  },
];

const SEED_SENT = [
  { id: 's1', subject: 'Mid-program check-in', recipients: 64, sentAt: 'May 22, 2026 · 9:00 AM', status: 'Scheduled' },
  { id: 's2', subject: 'Welcome letter — Spring 2026', recipients: 28, sentAt: 'May 14, 2026 · 10:30 AM', status: 'Sent' },
  { id: 's3', subject: 'Monthly newsletter — May', recipients: 412, sentAt: 'May 1, 2026 · 8:00 AM', status: 'Sent' },
  { id: 's4', subject: 'Information session — May 8', recipients: 86, sentAt: 'Apr 30, 2026 · 2:15 PM', status: 'Sent' },
];

const SECTION_CONFIG = [
  {
    key: 'manual',
    title: 'Manual send',
    description: 'Templates an admin sends on demand. Use these for one-off announcements, welcome letters, and milestone congratulations.',
  },
  {
    key: 'auto',
    title: 'Auto send',
    description: 'Triggered automatically when an event happens (e.g. an applicant submits the intake form).',
  },
  {
    key: 'scheduled',
    title: 'Schedule send',
    description: 'Templates sent at a chosen date and time. Used for reminders, newsletters, and time-based check-ins.',
  },
];

// --- Component ---
export default function Communications() {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState(SEED_TEMPLATES);
  const [editing, setEditing] = useState(null);
  const [isNewTemplate, setIsNewTemplate] = useState(false);

  const openTemplate = (template) => {
    setEditing({ ...template });
    setIsNewTemplate(false);
  };

  const openNewTemplate = () => {
    setEditing({
      id: `new_${Date.now()}`,
      name: '',
      sendType: 'manual',
      description: '',
      sendCount: 0,
      body: '',
    });
    setIsNewTemplate(true);
  };

  const closeEditor = () => {
    setEditing(null);
    setIsNewTemplate(false);
  };

  const saveTemplate = () => {
    if (!editing) return;
    if (isNewTemplate) {
      setTemplates((prev) => [...prev, editing]);
    } else {
      setTemplates((prev) => prev.map((t) => (t.id === editing.id ? editing : t)));
    }
    closeEditor();
  };

  const updateField = (field, value) => {
    setEditing((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Communications</PageTitle>
        <PageSubtitle>Manage email templates and automated communications for your programs.</PageSubtitle>
      </PageHeader>

      <TabBar>
        <TabButton $active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>
          Templates
        </TabButton>
        <TabButton $active={activeTab === 'sent'} onClick={() => setActiveTab('sent')}>
          Scheduled & sent
        </TabButton>
      </TabBar>

      {activeTab === 'templates' && (
        <>
          <ActionRow>
            <PrimaryButton onClick={openNewTemplate}>+ New template</PrimaryButton>
          </ActionRow>

          {SECTION_CONFIG.map((section) => {
            const sectionTemplates = templates.filter((t) => t.sendType === section.key);
            return (
              <Section key={section.key}>
                <SectionHeader>
                  <SectionTitle>{section.title}</SectionTitle>
                  <SectionCount>{sectionTemplates.length}</SectionCount>
                </SectionHeader>
                <SectionDescription>{section.description}</SectionDescription>

                {sectionTemplates.length === 0 ? (
                  <EmptyGroup>No templates yet.</EmptyGroup>
                ) : (
                  <TemplateGrid>
                    {sectionTemplates.map((t) => (
                      <TemplateCard key={t.id} $type={t.sendType} onClick={() => openTemplate(t)}>
                        <TemplateName>{t.name}</TemplateName>
                        <TemplateDescription>{t.description}</TemplateDescription>
                        <TemplateMeta>
                          <span>{t.sendCount} sent</span>
                        </TemplateMeta>
                      </TemplateCard>
                    ))}
                  </TemplateGrid>
                )}
              </Section>
            );
          })}
        </>
      )}

      {activeTab === 'sent' && (
        <>
          <ActionRow>
            <PrimaryButton onClick={openNewTemplate}>+ Send new</PrimaryButton>
          </ActionRow>

          <SentTable>
            <thead>
              <tr>
                <Th>Subject</Th>
                <Th>Recipients</Th>
                <Th>Date</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {SEED_SENT.map((s) => (
                <tr key={s.id}>
                  <Td>{s.subject}</Td>
                  <Td>{s.recipients}</Td>
                  <Td>{s.sentAt}</Td>
                  <Td><StatusPill $status={s.status}>{s.status}</StatusPill></Td>
                </tr>
              ))}
            </tbody>
          </SentTable>

          <MobileSentList>
            {SEED_SENT.map((s) => (
              <MobileSentCard key={s.id}>
                <MobileSentRow>
                  <strong>{s.subject}</strong>
                  <StatusPill $status={s.status}>{s.status}</StatusPill>
                </MobileSentRow>
                <MobileSentRow>
                  <MobileSentLabel>Recipients</MobileSentLabel>
                  <span>{s.recipients}</span>
                </MobileSentRow>
                <MobileSentRow>
                  <MobileSentLabel>Date</MobileSentLabel>
                  <span>{s.sentAt}</span>
                </MobileSentRow>
              </MobileSentCard>
            ))}
          </MobileSentList>
        </>
      )}

      {editing && (
        <ModalOverlay onClick={closeEditor}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{isNewTemplate ? 'New template' : 'Edit template'}</ModalTitle>
              <CloseButton onClick={closeEditor}>×</CloseButton>
            </ModalHeader>

            <Field>
              <Label>Template name</Label>
              <Input
                value={editing.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Mid-program check-in"
              />
            </Field>

            <Field>
              <Label>Send type</Label>
              <Select
                value={editing.sendType}
                onChange={(e) => updateField('sendType', e.target.value)}
              >
                <option value="manual">Manual send</option>
                <option value="auto">Auto send</option>
                <option value="scheduled">Schedule send</option>
              </Select>
              <TriggerHint>
                {editing.sendType === 'manual' && 'Sent only when an admin presses Send.'}
                {editing.sendType === 'auto' && 'Sends automatically when an event happens (e.g. form submission).'}
                {editing.sendType === 'scheduled' && 'Sent at a chosen date and time.'}
              </TriggerHint>
            </Field>

            <Field>
              <Label>Description</Label>
              <Input
                value={editing.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="What is this template used for?"
              />
            </Field>

            <Field>
              <Label>Email body</Label>
              <Textarea
                value={editing.body}
                onChange={(e) => updateField('body', e.target.value)}
                placeholder="Use {{first_name}}, {{program_name}}, etc. as variables..."
              />
              <TriggerHint>
                Variables: <code>{'{{first_name}}'}</code>, <code>{'{{program_name}}'}</code>, <code>{'{{start_date}}'}</code>, <code>{'{{intake_date}}'}</code>
              </TriggerHint>
            </Field>

            <ModalFooter>
              <SecondaryButton onClick={closeEditor}>Cancel</SecondaryButton>
              <PrimaryButton onClick={saveTemplate}>
                {isNewTemplate ? 'Create template' : 'Save changes'}
              </PrimaryButton>
            </ModalFooter>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}