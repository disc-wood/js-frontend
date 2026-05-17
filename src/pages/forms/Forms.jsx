import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '@/common/hooks/useUser';

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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const FormCard = styled.div`
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: #0a0a0a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  &:active {
    transform: scale(0.99);
  }
`;

const FormCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const FormCardIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #0C447C;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
`;

const FormCardTitle = styled.h3`
  font-size: 15px;
  font-weight: 500;
  color: #0a0a0a;
  margin: 0;
`;

const FormCardDescription = styled.p`
  font-size: 13px;
  color: #555555;
  margin: 0 0 14px 0;
  line-height: 1.5;
`;

const FormCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid #f3f3f3;
`;

const FormCardLink = styled.span`
  font-size: 12px;
  color: #888888;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
`;

const OpenIcon = styled.span`
  font-size: 13px;
  color: #0a0a0a;
  font-weight: 500;
`;

const LoadingState = styled.div`
  font-size: 13px;
  color: #555555;
  padding: 2rem 0;
`;

const EmptyState = styled.div`
  border: 1px dashed #eaeaea;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  background-color: #fafafa;
`;

const EmptyStateTitle = styled.h3`
  font-size: 15px;
  font-weight: 500;
  color: #0a0a0a;
  margin: 0 0 8px 0;
`;

const EmptyStateText = styled.p`
  font-size: 13px;
  color: #888888;
  margin: 0;
  line-height: 1.6;
`;

// --- Form definitions ---
const forms = [
  {
    id: 'oakton',
    title: 'Oakton WEI Application',
    description: 'Workforce Empowerment Initiative intake form for Oakton College applicants.',
    path: '/apply/oakton',
    initial: 'O',
    programId: 'oakton',
  },
  {
    id: 'ihtu',
    title: 'IHTU Application',
    description: 'Intake form for I Hope They Understand program applicants.',
    path: '/apply/ihtu',
    initial: 'I',
    programId: 'ihtu',
  },
];

// --- Component ---
export default function Forms() {
  const navigate = useNavigate();
  const { role, assignedPrograms, loading } = useUser();

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading...</LoadingState>
      </PageContainer>
    );
  }

  // Admins see all forms; supervisors only see forms for their assigned programs
  const visibleForms = role === 'admin'
    ? forms
    : forms.filter((f) => assignedPrograms?.includes(f.programId));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Forms</PageTitle>
        <PageSubtitle>Share these intake links with prospective applicants.</PageSubtitle>
      </PageHeader>

      {visibleForms.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No forms available</EmptyStateTitle>
          <EmptyStateText>
            You don't have access to any program forms yet. Contact an admin to request access.
          </EmptyStateText>
        </EmptyState>
      ) : (
        <FormGrid>
          {visibleForms.map((form) => (
            <FormCard key={form.id} onClick={() => navigate(form.path)}>
              <FormCardHeader>
                <FormCardIcon>{form.initial}</FormCardIcon>
                <FormCardTitle>{form.title}</FormCardTitle>
              </FormCardHeader>
              <FormCardDescription>{form.description}</FormCardDescription>
              <FormCardFooter>
                <FormCardLink>{form.path}</FormCardLink>
                <OpenIcon>Open →</OpenIcon>
              </FormCardFooter>
            </FormCard>
          ))}
        </FormGrid>
      )}
    </PageContainer>
  );
}