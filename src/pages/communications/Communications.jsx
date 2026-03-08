import React, { useState } from 'react';

import styled from 'styled-components';

import { Button } from '../../common/components/atoms/Button';

const PAGE_PADDING = '2rem';
const PRIMARY_BLUE = '#2563eb';
const LIGHT_BG = '#f8f9fa';
const CARD_BG = '#f3f3f3';
const BORDER_GRAY = '#e5e7eb';
const TEXT_MUTED = '#6b7280';

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

const TAB_TRIANGLE_BLUE = '#e0f2fe';
const TAB_INACTIVE_GRAY = '#d1d5db';

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
  display: flex;
  gap: 1.5rem;
  min-height: 400px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Panel = styled.section`
  flex: 1;
  background: ${LIGHT_BG};
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const PanelHeader = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text);
`;

const SubHeader = styled.p`
  font-size: 0.9rem;
  margin: 0 0 0.75rem 0;
  color: var(--text);
`;

const TemplateOption = styled.button`
  display: block;
  width: 100%;
  padding: 0.6rem 0.9rem;
  margin-bottom: 0.5rem;
  background: ${CARD_BG};
  border: 1px solid ${BORDER_GRAY};
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  color: var(--text);
  transition: background 0.15s;

  &:hover {
    background: #e5e7eb;
  }
`;

const ViewAllLink = styled.a`
  font-size: 0.9rem;
  color: ${PRIMARY_BLUE};
  text-decoration: none;
  margin-top: 0.5rem;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const ComposeButton = styled(Button.Primary)`
  margin-top: auto;
  align-self: flex-start;
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
  padding: 0.5rem 0;
  font-weight: 600;
  color: var(--text);
`;

const Td = styled.td`
  padding: 0.6rem 0;
  border-bottom: 1px solid #f0f0f0;
  color: var(--text);
`;

const SubjectLink = styled.a`
  color: ${PRIMARY_BLUE};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #1d4ed8;
  }
`;

const RowActions = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${TEXT_MUTED};
  cursor: pointer;
  padding: 0 0.25rem;
  font-size: 0.9rem;
  line-height: 1;

  &:hover {
    color: var(--text);
  }
`;

const TABS = ['Oakton College', 'I Hope They Understand'];

const TEMPLATES = [
  'Follow-Up Email',
  'Announcement',
  'Newsletter',
  'Event Invitation',
];

const SCHEDULED = [
  { subject: 'March Newsletter', recipients: 'Enrolled Students', date: '3/1/26 10:00am' },
  { subject: 'April Newsletter', recipients: 'Enrolled Students', date: '4/1/26 10:00am' },
  { subject: 'Mid-Year Congrats', recipients: 'Enrolled Students', date: '4/1/26 10:00am' },
  { subject: 'May Newsletter', recipients: 'Enrolled Students', date: '5/1/26 10:00am' },
];

const SENT = [
  { subject: 'February Newsletter', recipients: 'Enrolled Students', date: '2/1/26 10:00am', showClose: false },
  { subject: 'Follow-Up', recipients: 'John Smith', date: '2/1/26 10:00am', showClose: false },
];

export default function Communications() {
  const [activeTab, setActiveTab] = useState(0);

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
              type="button"
              $active={activeTab === index}
              $first={index === 0}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>
        <MainCard>
          <Panel>
            <PanelHeader>Create an Email</PanelHeader>
            <SubHeader>Choose a Template:</SubHeader>
            {TEMPLATES.map((name) => (
              <TemplateOption key={name} type="button">
                {name}
              </TemplateOption>
            ))}
            <ViewAllLink href="#">View all templates &gt;</ViewAllLink>
            <ComposeButton type="button">Compose Email</ComposeButton>
          </Panel>

          <Panel>
            <PanelHeader>Scheduled</PanelHeader>
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
                      <SubjectLink href="#">{row.subject}</SubjectLink>
                    </Td>
                    <Td>{row.recipients}</Td>
                    <Td>{row.date}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Panel>

          <Panel>
            <PanelHeader>Sent</PanelHeader>
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
                      <SubjectLink href="#">{row.subject}</SubjectLink>
                    </Td>
                    <Td>{row.recipients}</Td>
                    <Td>
                      <RowActions>
                        {row.date}
                        {row.showClose && (
                          <CloseButton type="button" aria-label="Dismiss">
                            ×
                          </CloseButton>
                        )}
                      </RowActions>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Panel>
        </MainCard>
      </TabCardWrapper>
    </PageContainer>
  );
}
