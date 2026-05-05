import { useState } from 'react';

import { Button } from '@/common/components/atoms/Button';
import styled from 'styled-components';

const PAGE_PADDING = '2rem';
const PRIMARY_BLUE = '#2563eb';
const LIGHT_BG = '#f8f9fa';
const CARD_BG = '#f3f3f3';
const BORDER_GRAY = '#e5e7eb';
const TEXT_MUTED = '#6b7280';
const TAB_TRIANGLE_BLUE = '#c0e6ff';
const TAB_INACTIVE_GRAY = '#d1d5db';

const PageContainer = styled.div`
  flex: 1;
  padding: ${PAGE_PADDING};
  overflow: auto;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--text);
`;

const TabCardWrapper = styled.div`
  background: ${CARD_BG};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const Tabs = styled.div`
  display: flex;
  align-items: stretch;
  background: ${TAB_TRIANGLE_BLUE};
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.65rem 1.5rem;
  font-size: 0.95rem;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  color: ${({ $active }) => ($active ? 'var(--text)' : TEXT_MUTED)};
  background: ${({ $active }) => ($active ? CARD_BG : TAB_INACTIVE_GRAY)};
  border: none;
  border-radius: ${({ $first }) => ($first ? '0 16px 0 0' : '16px 0 0 0')};
  cursor: pointer;
  position: relative;
  z-index: ${({ $active }) => ($active ? 1 : 0)};

  &:hover {
    color: var(--text);
    background: ${({ $active }) => ($active ? CARD_BG : '#c9cdd3')};
  }
`;

const MainCard = styled.div`
  background: ${CARD_BG};
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 1.5rem;
  min-height: 430px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: ${LIGHT_BG};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ComposeButton = styled(Button.Primary)`
  width: 100%;
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  @media (max-width: 800px) {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const SidebarItem = styled.button`
  width: 100%;
  padding: 0.7rem 0.85rem;
  background: ${({ $active }) => ($active ? '#e8f0ff' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? PRIMARY_BLUE : 'transparent')};
  border-radius: 6px;
  color: ${({ $active }) => ($active ? '#1d4ed8' : 'var(--text)')};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  text-align: left;

  &:hover {
    background: ${({ $active }) => ($active ? '#e8f0ff' : '#eceff3')};
  }
`;

const ContentPanel = styled.section`
  background: ${LIGHT_BG};
  border-radius: 8px;
  padding: 1.25rem;
  min-width: 0;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const PanelTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.3rem 0;
  color: var(--text);
`;

const PanelDescription = styled.p`
  font-size: 0.85rem;
  margin: 0;
  color: ${TEXT_MUTED};
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
`;

const TableHead = styled.thead`
  border-bottom: 1px solid ${BORDER_GRAY};
`;

const Th = styled.th`
  text-align: left;
  padding: 0.5rem 0.75rem 0.5rem 0;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 0.7rem 0.75rem 0.7rem 0;
  border-bottom: 1px solid #f0f0f0;
  color: var(--text);
  vertical-align: middle;
`;

const SubjectButton = styled.button`
  background: none;
  border: none;
  color: ${PRIMARY_BLUE};
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-align: left;
  text-decoration: underline;

  &:hover {
    color: #1d4ed8;
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: ${PRIMARY_BLUE};
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: #1d4ed8;
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TemplateOption = styled.button`
  min-height: 4.5rem;
  padding: 0.85rem 1rem;
  background: ${CARD_BG};
  border: 1px solid ${BORDER_GRAY};
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  color: var(--text);
  transition: background 0.15s;

  &:hover {
    background: #e5e7eb;
  }
`;

const EmptyState = styled.div`
  border: 1px dashed ${BORDER_GRAY};
  border-radius: 8px;
  padding: 2rem;
  color: ${TEXT_MUTED};
  text-align: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(25, 26, 35, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
`;

const ModalContent = styled.form`
  width: min(640px, 100%);
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.18);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: ${CARD_BG};
  border-bottom: 1px solid ${BORDER_GRAY};
  padding: 0.9rem 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${TEXT_MUTED};
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0.25rem;

  &:hover {
    color: var(--text);
  }
`;

const ModalBody = styled.div`
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
`;

const Field = styled.label`
  display: grid;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${TEXT_MUTED};
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${BORDER_GRAY};
  border-radius: 6px;
  padding: 0.65rem 0.75rem;
  font: inherit;
  color: var(--text);
`;

const Select = styled.select`
  width: 100%;
  border: 1px solid ${BORDER_GRAY};
  border-radius: 6px;
  padding: 0.65rem 0.75rem;
  font: inherit;
  color: var(--text);
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 180px;
  border: 1px solid ${BORDER_GRAY};
  border-radius: 6px;
  padding: 0.75rem;
  font: inherit;
  color: var(--text);
  resize: vertical;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid ${BORDER_GRAY};
  padding: 1rem;
`;

const CancelButton = styled(Button.Secondary)`
  min-width: 92px;
`;

const SaveButton = styled(Button.Primary)`
  min-width: 112px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const TABS = ['Oakton College', 'I Hope They Understand'];

const SECTIONS = [
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'sent', label: 'Sent' },
  { id: 'templates', label: 'Templates' },
  { id: 'drafts', label: 'Drafts' },
];

const SECTION_DETAILS = {
  scheduled: {
    title: 'Scheduled',
    description: 'Emails queued to go out later.',
  },
  sent: {
    title: 'Sent',
    description: 'Previously delivered emails.',
  },
  templates: {
    title: 'Templates',
    description: 'Start a draft from a common message type.',
  },
  drafts: {
    title: 'Drafts',
    description: 'Locally saved drafts for this session.',
  },
};

const TEMPLATES = [
  'Follow-Up Email',
  'Announcement',
  'Newsletter',
  'Event Invitation',
];

const SCHEDULED = [
  {
    subject: 'March Newsletter',
    recipients: 'Enrolled Students',
    date: '3/1/26 10:00am',
  },
  {
    subject: 'April Newsletter',
    recipients: 'Enrolled Students',
    date: '4/1/26 10:00am',
  },
  {
    subject: 'Mid-Year Congrats',
    recipients: 'Enrolled Students',
    date: '4/1/26 10:00am',
  },
  {
    subject: 'May Newsletter',
    recipients: 'Enrolled Students',
    date: '5/1/26 10:00am',
  },
];

const SENT = [
  {
    subject: 'February Newsletter',
    recipients: 'Enrolled Students',
    date: '2/1/26 10:00am',
  },
  {
    subject: 'Follow-Up',
    recipients: 'John Smith',
    date: '2/1/26 10:00am',
  },
];

const EMPTY_DRAFT = {
  id: null,
  recipients: '',
  template: TEMPLATES[0],
  subject: '',
  body: '',
};

const formatDraftDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

export default function Communications() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSection, setActiveSection] = useState('scheduled');
  const [drafts, setDrafts] = useState([]);
  const [draftForm, setDraftForm] = useState(EMPTY_DRAFT);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const currentSection = SECTION_DETAILS[activeSection];
  const canSaveDraft = Boolean(
    draftForm.recipients.trim() ||
    draftForm.subject.trim() ||
    draftForm.body.trim()
  );

  const openComposeModal = (template = TEMPLATES[0]) => {
    setDraftForm({ ...EMPTY_DRAFT, template });
    setIsDraftModalOpen(true);
  };

  const openDraftModal = (draft) => {
    setDraftForm(draft);
    setIsDraftModalOpen(true);
  };

  const closeDraftModal = () => {
    setIsDraftModalOpen(false);
    setDraftForm(EMPTY_DRAFT);
  };

  const handleDraftChange = (event) => {
    const { name, value } = event.target;

    setDraftForm((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  };

  const handleSaveDraft = (event) => {
    event.preventDefault();

    if (!canSaveDraft) {
      return;
    }

    const savedDraft = {
      ...draftForm,
      id: draftForm.id ?? Date.now(),
      updatedAt: formatDraftDate(new Date()),
    };

    setDrafts((currentDrafts) => {
      if (draftForm.id) {
        return currentDrafts.map((draft) =>
          draft.id === draftForm.id ? savedDraft : draft
        );
      }

      return [savedDraft, ...currentDrafts];
    });
    setActiveSection('drafts');
    closeDraftModal();
  };

  const renderScheduled = () => (
    <TableScroll>
      <Table>
        <TableHead>
          <tr>
            <Th>Subject</Th>
            <Th>Recipient List</Th>
            <Th>Send Date</Th>
          </tr>
        </TableHead>
        <tbody>
          {SCHEDULED.map((row) => (
            <tr key={row.subject}>
              <Td>
                <SubjectButton type='button'>{row.subject}</SubjectButton>
              </Td>
              <Td>{row.recipients}</Td>
              <Td>{row.date}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );

  const renderSent = () => (
    <TableScroll>
      <Table>
        <TableHead>
          <tr>
            <Th>Subject</Th>
            <Th>Recipient List</Th>
            <Th>Send Date</Th>
          </tr>
        </TableHead>
        <tbody>
          {SENT.map((row) => (
            <tr key={`${row.subject}-${row.recipients}`}>
              <Td>
                <SubjectButton type='button'>{row.subject}</SubjectButton>
              </Td>
              <Td>{row.recipients}</Td>
              <Td>{row.date}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );

  const renderTemplates = () => (
    <TemplateGrid>
      {TEMPLATES.map((name) => (
        <TemplateOption
          key={name}
          type='button'
          onClick={() => openComposeModal(name)}
        >
          {name}
        </TemplateOption>
      ))}
    </TemplateGrid>
  );

  const renderDrafts = () => {
    if (drafts.length === 0) {
      return (
        <EmptyState>No drafts yet. Compose an email to save one.</EmptyState>
      );
    }

    return (
      <TableScroll>
        <Table>
          <TableHead>
            <tr>
              <Th>Subject</Th>
              <Th>Recipient List</Th>
              <Th>Last Updated</Th>
              <Th>Action</Th>
            </tr>
          </TableHead>
          <tbody>
            {drafts.map((draft) => (
              <tr key={draft.id}>
                <Td>{draft.subject.trim() || 'Untitled draft'}</Td>
                <Td>{draft.recipients.trim() || 'No recipient'}</Td>
                <Td>{draft.updatedAt}</Td>
                <Td>
                  <ActionButton
                    type='button'
                    onClick={() => openDraftModal(draft)}
                  >
                    Resume
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableScroll>
    );
  };

  const renderContent = () => {
    if (activeSection === 'scheduled') {
      return renderScheduled();
    }

    if (activeSection === 'sent') {
      return renderSent();
    }

    if (activeSection === 'templates') {
      return renderTemplates();
    }

    return renderDrafts();
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Communications</PageTitle>
      </PageHeader>

      <TabCardWrapper>
        <Tabs>
          {TABS.map((tab, index) => (
            <Tab
              key={tab}
              type='button'
              $active={activeTab === index}
              $first={index === 0}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>

        <MainCard>
          <Sidebar>
            <ComposeButton type='button' onClick={() => openComposeModal()}>
              Compose Email
            </ComposeButton>

            <SidebarNav aria-label='Communication sections'>
              {SECTIONS.map((section) => (
                <SidebarItem
                  key={section.id}
                  type='button'
                  $active={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </SidebarItem>
              ))}
            </SidebarNav>
          </Sidebar>

          <ContentPanel>
            <ContentHeader>
              <div>
                <PanelTitle>{currentSection.title}</PanelTitle>
                <PanelDescription>
                  {currentSection.description}
                </PanelDescription>
              </div>
            </ContentHeader>

            {renderContent()}
          </ContentPanel>
        </MainCard>
      </TabCardWrapper>

      {isDraftModalOpen && (
        <ModalOverlay onClick={closeDraftModal}>
          <ModalContent
            onSubmit={handleSaveDraft}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>
                {draftForm.id ? 'Edit Draft' : 'Compose Email'}
              </ModalTitle>
              <IconButton
                type='button'
                aria-label='Close compose modal'
                onClick={closeDraftModal}
              >
                ×
              </IconButton>
            </ModalHeader>

            <ModalBody>
              <Field>
                Recipient/List
                <Input
                  name='recipients'
                  value={draftForm.recipients}
                  onChange={handleDraftChange}
                  placeholder='Enrolled Students'
                />
              </Field>

              <Field>
                Template
                <Select
                  name='template'
                  value={draftForm.template}
                  onChange={handleDraftChange}
                >
                  {TEMPLATES.map((template) => (
                    <option key={template} value={template}>
                      {template}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                Subject
                <Input
                  name='subject'
                  value={draftForm.subject}
                  onChange={handleDraftChange}
                  placeholder='Email subject'
                />
              </Field>

              <Field>
                Message
                <Textarea
                  name='body'
                  value={draftForm.body}
                  onChange={handleDraftChange}
                  placeholder='Write your message here...'
                />
              </Field>
            </ModalBody>

            <ModalActions>
              <CancelButton type='button' onClick={closeDraftModal}>
                Cancel
              </CancelButton>
              <SaveButton type='submit' disabled={!canSaveDraft}>
                Save Draft
              </SaveButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}
