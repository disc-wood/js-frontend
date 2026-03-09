import React from 'react';
import styled from 'styled-components';
import TabCard from '@/common/components/atoms/TabCard';

const PageContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: auto;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--text);
`;

export default function Database() {
  const tabs = [
    { label: 'Oakton College', content: <div>Content coming soon</div> },
    { label: 'I Hope They Understand', content: <div>Content coming soon</div> },
  ];

  return (
    <PageContainer>
      <PageTitle>Database</PageTitle>
        
      <TabCard tabs={tabs} />
    </PageContainer>
  );
}