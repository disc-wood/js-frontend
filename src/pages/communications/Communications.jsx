import React from 'react';
import { programs } from "@/config/programs";
import styled from 'styled-components';
import TabCard from '@/common/components/atoms/TabCard';
import { useUser } from '@/common/hooks/useUser';

// --- Styled Components ---
const PageContainer = styled.div`
  flex: 1;
  padding: 2rem;
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

function CommunicationsContent({ programId }) {
  return (
    <div>
      <h3>Program: {programId}</h3>
      <p>Replace this with program-specific communications data.</p>
    </div>
  );
}

export default function Communications() {
  const { role, assignedPrograms, loading } = useUser();

  if (loading) return <div>Loading...</div>;

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
      </PageHeader>
      <TabCard tabs={tabs} />
    </PageContainer>
  );
}