import React from 'react';
import styled from 'styled-components';
import TabCard from '@/common/components/atoms/TabCard';
import DemographicPieChart from '@/common/components/charts/DemographicPieChart';
import ProgressLineChart from '@/common/components/charts/ProgressLineChart';
import { programs } from "@/config/programs";
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

const EditButton = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: #555555;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s ease;

  &:hover {
    color: #0a0a0a;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 0 0 12px 12px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
    margin-bottom: 16px;
  }
`;

const Metric = styled.div`
  background-color: #fafafa;
  border-radius: 8px;
  padding: 16px;
  text-align: left;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #888888;
  font-weight: 400;
  margin-bottom: 6px;
  letter-spacing: 0.2px;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 500;
  color: #0a0a0a;
  letter-spacing: -0.5px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const PieGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
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

// Mock Data (Will be replaced later)
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

const DashboardContent = (props) => (
  <DashboardGrid data-program={props.programId}>
    <PieGrid>
      <DemographicPieChart data={mockPieData} title="Ethnicity representation" />
      <DemographicPieChart data={mockPieData} title="Enrollment by program" />
      <DemographicPieChart data={mockPieData} title="Gender representation" />
      <DemographicPieChart data={mockPieData} title="Job placements" />
    </PieGrid>
    <div>
      <MetricsRow>
        <Metric>
          <MetricLabel>Employment rate</MetricLabel>
          <MetricValue>87%</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>Completion rate</MetricLabel>
          <MetricValue>87%</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>Enrolled students</MetricLabel>
          <MetricValue>430</MetricValue>
        </Metric>
      </MetricsRow>
      <div style={{ minHeight: '350px', width: '100%' }}>
        <ProgressLineChart data={mockLineData} />
      </div>
    </div>
  </DashboardGrid>
);

export default function Dashboard() {
  const { role, assignedPrograms, loading } = useUser();

  if (loading) return <LoadingState>Loading...</LoadingState>;

  const visiblePrograms = role === 'admin'
    ? programs
    : programs.filter(p => assignedPrograms.includes(p.id));

  const tabs = visiblePrograms.map((p) => ({
    id: p.id,
    label: p.label,
    content: <DashboardContent programId={p.id} />,
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Program performance and learner outcomes at a glance.</PageSubtitle>
      </PageHeader>
      <TabCard tabs={tabs} />
    </PageContainer>
  );
}