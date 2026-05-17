import React from 'react';
import { programs } from "@/config/programs";
import styled from 'styled-components';
import TabCard from '@/common/components/atoms/TabCard';
import { useUser } from '@/common/hooks/useUser';

// --- Styled Components ---
const PageContainer = styled.div`
  flex: 1;
  padding: 2rem 2.5rem;
  overflow: auto;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.5px;
  margin: 0 0 6px 0;
  color: #0a0a0a;
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  color: #888888;
  margin: 0;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 0 0 12px 12px;
  padding: 32px;
  min-height: 320px;
`;

const PlaceholderHeading = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #0a0a0a;
`;

const PlaceholderText = styled.p`
  font-size: 13px;
  color: #555555;
  margin: 0;
  line-height: 1.6;
`;

const LoadingState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: #555555;
  min-height: 100vh;
`;

function CommunicationsContent({ programId }) {
  return (
    <ContentWrapper>
      <PlaceholderHeading>Program: {programId}</PlaceholderHeading>
      <PlaceholderText>
        Replace this with program-specific communications data.
      </PlaceholderText>
    </ContentWrapper>
  );
}

export default function Communications() {
  const { role, assignedPrograms, loading } = useUser();

  if (loading) return <LoadingState>Loading...</LoadingState>;

  const visiblePrograms = role === 'admin'
    ? programs
    : programs.filter(p => assignedPrograms.includes(p.id));

  const tabs = visiblePrograms.map((p) => ({
    id: p.id,
    label: p.label,
    content: <CommunicationsContent programId={p.id} />,
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Communications</PageTitle>
        <PageSubtitle>Compose, schedule, and automate emails to your participants.</PageSubtitle>
      </PageHeader>
      <TabCard tabs={tabs} />
    </PageContainer>
  );
}
