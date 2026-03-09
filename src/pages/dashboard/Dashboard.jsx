import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TabCard from '@/common/components/atoms/TabCard';
import DemographicPieChart from '@/common/components/charts/DemographicPieChart';
import ProgressLineChart from '@/common/components/charts/ProgressLineChart';

// --- Styled Components ---
const PageContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--text);
`;

const EditButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  text-decoration: underline;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 30px;
  background-color: white;
  border-radius: 0 0 12px 12px;
`;

const MetricsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 3rem;
  font-weight: 600;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const PieGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

//Mock Data (Will be replaced later)
const mockPieData = [
  { name: 'Group A', value: 800 },
  { name: 'Group B', value: 400 },
  { name: 'Group C', value: 500 },
  { name: 'Group D', value: 200 },
];

const mockLineData = [
  { name: 'Jan', program1: 20, program2: 50, program3: 100 },
  { name: 'Feb', program1: 50, program2: 30, program3: 120 },
  { name: 'Mar', program1: 200, program2: 150, program3: 300 },
  { name: 'Apr', program1: 180, program2: 300, program3: 250 },
  { name: 'May', program1: 320, program2: 200, program3: 450 },
];

//Sub Components
const DashboardContent = () => (
  <DashboardGrid>
    {/* Left Column: Pie Charts */}
    <PieGrid>
      <DemographicPieChart data={mockPieData} title="Ethnicity Representation" />
      <DemographicPieChart data={mockPieData} title="Enrollment by Program" />
      <DemographicPieChart data={mockPieData} title="Gender Representation" />
      <DemographicPieChart data={mockPieData} title="Job Placements" />
    </PieGrid>

    {/* Right Column: Top Metrics & Line Chart */}
    <div>
      <MetricsRow>
        <Metric>
          <MetricLabel>Employment Rate</MetricLabel>
          <MetricValue>87%</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>Completion Rate</MetricLabel>
          <MetricValue>87%</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>Enrolled Students</MetricLabel>
          <MetricValue>430</MetricValue>
        </Metric>
      </MetricsRow>
      <ProgressLineChart data={mockLineData} />
    </div>
  </DashboardGrid>
);

//Main Page Components
export default function Dashboard() {
  const tabs = [
    { label: 'Oakton Community College', content: <DashboardContent /> },
    { label: 'I Hope They Understand', content: <div>Second Tab Content</div> },
  ];

  return (
    <PageContainer>
      <HeaderRow>
        <PageTitle>Dashboard</PageTitle>
        <EditButton>Edit Programs</EditButton>
      </HeaderRow>
      <TabCard tabs={tabs} />
    </PageContainer>
  );
}