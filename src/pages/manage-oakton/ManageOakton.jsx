import { useState } from 'react';
import styled from 'styled-components';
import TermDatesModal from '@/pages/database/TermDatesModal';
import CustomQuestionModal from '@/common/components/modals/CustomQuestionModal';
import IntakeSessionsModal from './IntakeSessionsModal';

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
  margin: 0 0 8px 0;
  color: #0a0a0a;
`;

const SectionDescription = styled.p`
  font-size: 13px;
  color: #888888;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const ActionButton = styled.button`
  padding: 10px 18px;
  background-color: #0a0a0a;
  color: #ffffff;
  border: 1px solid #0a0a0a;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;

  &:hover {
    background-color: #2a2a2a;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function ManageOakton() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Manage Oakton College</PageTitle>
        <PageSubtitle>Configure settings and intake options for the Oakton College program.</PageSubtitle>
      </PageHeader>

      <Section>
        <SectionTitle>Term dates</SectionTitle>
        <SectionDescription>
          Add, edit, or remove academic term dates. Start and end dates are automatically applied to students enrolled in that term.
        </SectionDescription>
        <ActionButton onClick={() => setActiveModal('termDates')}>Manage term dates</ActionButton>
      </Section>

      <Section>
        <SectionTitle>Custom intake question</SectionTitle>
        <SectionDescription>
          Add a custom question to the Oakton intake form. Applicants answer in a text field, and their response is stored with their application.
        </SectionDescription>
        <ActionButton onClick={() => setActiveModal('customQuestion')}>Edit question</ActionButton>
      </Section>

      <Section>
        <SectionTitle>Intake session dates</SectionTitle>
        <SectionDescription>
          Manage the intake session date options shown to applicants in the Oakton intake form.
        </SectionDescription>
        <ActionButton onClick={() => setActiveModal('intakeSessions')}>Edit session dates</ActionButton>
      </Section>

      {activeModal === 'termDates' && (
        <TermDatesModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'customQuestion' && (
        <CustomQuestionModal programId="oakton" onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'intakeSessions' && (
        <IntakeSessionsModal onClose={() => setActiveModal(null)} />
      )}
    </PageContainer>
  );
}
