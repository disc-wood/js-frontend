import React, { useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { Title } from '@/common/components/atoms/Text';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/common/contexts/UserContext';

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const floatY = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
`;

const drawPath = keyframes`
  to { stroke-dashoffset: 0; }
`;

const growBar = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
`;

// ─── Page shell ──────────────────────────────────────────────────────────────

const PageOuter = styled.div`
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

// ─── Hero ────────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
  padding: 80px;

  @media (max-width: 1100px) { padding: 64px 48px; gap: 36px; }
  @media (max-width: 768px)  { grid-template-columns: 1fr; padding: 40px 24px; gap: 32px; }
  @media (max-width: 480px)  { padding: 32px 20px; }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeInUp} 0.4s ease-out both;
`;

const MainText = styled(Title)`
  font-weight: 500;
  font-size: 44px;
  line-height: 1.15;
  letter-spacing: -1px;
  color: #0a0a0a;
  font-family: inherit;
  margin: 0;

  @media (max-width: 1100px) { font-size: 36px; letter-spacing: -0.75px; }
  @media (max-width: 768px)  { font-size: 28px; letter-spacing: -0.5px; line-height: 1.2; }
  @media (max-width: 480px)  { font-size: 24px; letter-spacing: -0.3px; }
`;

const SubText = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #555;
  line-height: 1.65;
  margin: 0;
  max-width: 480px;

  @media (max-width: 768px) { font-size: 14px; max-width: 100%; }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
`;

const BaseButton = styled.button`
  border: 1px solid transparent;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  width: fit-content;
  display: flex;
  align-items: center;
  transition: transform 0.1s ease, background-color 0.15s ease, border-color 0.15s ease;
  &:active { transform: scale(0.98); }
`;

const GetStartedButton = styled(BaseButton)`
  background-color: #0a0a0a;
  color: #ffffff;
  &:hover { background-color: #2a2a2a; }
`;

// ─── Panel ───────────────────────────────────────────────────────────────────

const PanelWrapper = styled.div`
  display: flex;
  justify-content: center;
  animation: ${floatY} 5s ease-in-out 0.6s infinite;

  @media (max-width: 768px) { animation: none; }
  @media (max-width: 480px) { display: none; }
`;

const Panel = styled.div`
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05);
  animation: ${fadeInUp} 0.45s ease-out 0.15s both;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 14px;
`;

const LiveDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #006853;
  flex-shrink: 0;
  animation: ${blink} 2.2s ease-in-out infinite;
`;

const PanelTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #0a0a0a;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const PanelBadge = styled.div`
  margin-left: auto;
  font-size: 10px;
  color: #bbb;
  letter-spacing: 0.3px;
`;

// ─── KPI grid ────────────────────────────────────────────────────────────────

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;
`;

const KpiTile = styled.div`
  background: #fafafa;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 11px 13px;
  animation: ${fadeInUp} 0.35s ease-out ${({ $d }) => $d}s both;
`;

const KpiLabel = styled.div`
  font-size: 10px;
  color: #888;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

const KpiValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #0a0a0a;
  letter-spacing: -0.5px;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
`;

const KpiSub = styled.div`
  font-size: 10px;
  color: #bbb;
  margin-top: 2px;
`;

// ─── Chart ───────────────────────────────────────────────────────────────────

const ChartWrap = styled.div`
  background: #fafafa;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 10px 12px 6px;
  margin-bottom: 14px;
`;

const ChartLabel = styled.div`
  font-size: 10px;
  color: #888;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const AnimatedPath = styled.path`
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: ${drawPath} 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.55s both;
`;

// ─── Bars ────────────────────────────────────────────────────────────────────

const Bars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BarLabel = styled.span`
  width: 88px;
  font-size: 10.5px;
  color: #555;
  flex-shrink: 0;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 5px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 3px;
  transform-origin: left center;
  animation: ${growBar} 0.85s ease-out ${({ $d }) => $d}s both;
`;

const BarPct = styled.span`
  width: 26px;
  text-align: right;
  font-size: 10.5px;
  color: #888;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
`;

// ─── Features section ────────────────────────────────────────────────────────

const FeaturesDivider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 0 80px;

  @media (max-width: 1100px) { margin: 0 48px; }
  @media (max-width: 768px)  { margin: 0 24px; }
`;

const FeaturesSection = styled.section`
  padding: 64px 80px;

  @media (max-width: 1100px) { padding: 48px 48px; }
  @media (max-width: 768px)  { padding: 40px 24px; }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 12px; }
`;

const FeatureCard = styled.div`
  background: #fafafa;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 24px;
  animation: ${fadeInUp} 0.4s ease-out ${({ $d }) => $d}s both;
`;

const FeatureIconWrap = styled.div`
  width: 36px;
  height: 36px;
  background: ${({ $bg }) => $bg};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  color: ${({ $color }) => $color};
`;

const FeatureTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #0a0a0a;
  margin-bottom: 6px;
`;

const FeatureDesc = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.65;
`;

const CtaRow = styled.div`
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`;

const CtaText = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #0a0a0a;
  letter-spacing: -0.3px;
`;

// ─── Count-up hook ───────────────────────────────────────────────────────────

function useCountUp(end, delay = 300, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const tid = setTimeout(() => {
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        setN(Math.round(end * (1 - (1 - p) ** 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(tid); cancelAnimationFrame(raf); };
  }, [end, delay, duration]);
  return n;
}

// ─── Mini chart ──────────────────────────────────────────────────────────────

function MiniChart() {
  const line = 'M0,54 C25,50 45,42 70,35 S110,24 140,18 S185,9 225,6 S270,3 300,2';
  const area = `${line} L300,68 L0,68 Z`;
  return (
    <svg viewBox="0 0 300 68" width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0C447C" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0C447C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#chartGrad)" />
      <AnimatedPath d={line} stroke="#0C447C" strokeWidth="1.75" fill="none" strokeLinecap="round" />
      <circle cx="300" cy="2" r="3" fill="#0C447C" />
    </svg>
  );
}

// ─── Dashboard preview ───────────────────────────────────────────────────────

function DashboardPreview() {
  const students   = useCountUp(248, 400);
  const completion = useCountUp(84,  550);
  const wage       = useCountUp(28,  700);
  const employed   = useCountUp(165, 850);

  return (
    <PanelWrapper>
      <Panel>
        <PanelHeader>
          <LiveDot />
          <PanelTitle>Dashboard Preview</PanelTitle>
          <PanelBadge>sample data</PanelBadge>
        </PanelHeader>

        <KpiGrid>
          <KpiTile $d={0.25}>
            <KpiLabel>Students</KpiLabel>
            <KpiValue>{students}</KpiValue>
            <KpiSub>enrolled</KpiSub>
          </KpiTile>
          <KpiTile $d={0.35}>
            <KpiLabel>Completion</KpiLabel>
            <KpiValue>{completion}%</KpiValue>
            <KpiSub>rate</KpiSub>
          </KpiTile>
          <KpiTile $d={0.45}>
            <KpiLabel>Avg Wage</KpiLabel>
            <KpiValue>${wage}/hr</KpiValue>
            <KpiSub>hourly</KpiSub>
          </KpiTile>
          <KpiTile $d={0.55}>
            <KpiLabel>Employed</KpiLabel>
            <KpiValue>{employed}</KpiValue>
            <KpiSub>graduates</KpiSub>
          </KpiTile>
        </KpiGrid>

        <ChartWrap>
          <ChartLabel>Placement Rate — 2021–2024</ChartLabel>
          <MiniChart />
        </ChartWrap>

        <Bars>
          <BarRow>
            <BarLabel>Completion</BarLabel>
            <BarTrack><BarFill style={{ width: '84%', background: '#0C447C' }} $d={0.9} /></BarTrack>
            <BarPct>84%</BarPct>
          </BarRow>
          <BarRow>
            <BarLabel>Employment</BarLabel>
            <BarTrack><BarFill style={{ width: '67%', background: '#006853' }} $d={1.0} /></BarTrack>
            <BarPct>67%</BarPct>
          </BarRow>
          <BarRow>
            <BarLabel>Wage ≥ $25/hr</BarLabel>
            <BarTrack><BarFill style={{ width: '58%', background: '#854F0B' }} $d={1.1} /></BarTrack>
            <BarPct>58%</BarPct>
          </BarRow>
        </Bars>
      </Panel>
    </PanelWrapper>
  );
}

// ─── Feature cards ───────────────────────────────────────────────────────────

const FEATURES = [
  {
    bg: '#eef4fb',
    color: '#0C447C',
    title: 'Track Learner Progress',
    desc: 'Collect and edit student progress across all programs in one custom database.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    bg: '#eaf4f1',
    color: '#006853',
    title: 'Automate Communications',
    desc: 'Send targeted emails and status updates to learners automatically.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    bg: '#fef7ec',
    color: '#854F0B',
    title: 'Data-Driven Insights',
    desc: 'Visualize program performance with filterable dashboards built to display program metrics.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(user ? '/dashboard' : '/signup');
  };

  return (
    <PageOuter>
      <HeroSection>
        <TextContainer>
          <MainText>
            Empowering educators with a system to track learner progress and automate communication.
          </MainText>
          <ButtonRow>
            <GetStartedButton onClick={handleGetStarted}>
              Get started
            </GetStartedButton>
          </ButtonRow>
        </TextContainer>
        <DashboardPreview />
      </HeroSection>

      <FeaturesDivider />

      <FeaturesSection>
        <FeaturesGrid>
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} $d={0.1 + i * 0.1}>
              <FeatureIconWrap $bg={f.bg} $color={f.color}>
                {f.icon}
              </FeatureIconWrap>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>

        <CtaRow>
          <CtaText>Ready to get started?</CtaText>
          <GetStartedButton onClick={handleGetStarted}>
            {user ? 'Go to dashboard' : 'Create an account'}
          </GetStartedButton>
        </CtaRow>
      </FeaturesSection>
    </PageOuter>
  );
}
