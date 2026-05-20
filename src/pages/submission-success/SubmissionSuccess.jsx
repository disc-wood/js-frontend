import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import React from 'react';

// --- Animations ---
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const checkPop = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ringPulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
`;

// --- Styled Components ---
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8faf9 0%, #f0f2f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 56px 48px;
  max-width: 520px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04), 0 16px 48px rgba(0, 0, 0, 0.06);
  border: 1px solid #eaeaea;
  animation: ${fadeInUp} 0.5s ease-out;

  @media (max-width: 480px) {
    padding: 40px 28px;
  }
`;

const CheckmarkContainer = styled.div`
  width: 88px;
  height: 88px;
  margin: 0 auto 28px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckRing = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  opacity: 0.15;
  animation: ${ringPulse} 1.5s ease-out 0.3s infinite;
`;

const CheckCircle = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${checkPop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 1;
`;

const Checkmark = styled.svg`
  width: 44px;
  height: 44px;
  stroke: #ffffff;
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #0a0a0a;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #555555;
  margin: 0 0 24px 0;
  line-height: 1.6;
  animation: ${fadeInUp} 0.6s ease-out 0.3s both;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const InfoBox = styled.div`
  background-color: #f5f9f7;
  border: 1px solid #d4e8de;
  border-radius: 10px;
  padding: 16px 20px;
  margin: 20px 0;
  font-size: 14px;
  color: #2a4a3f;
  line-height: 1.6;
  text-align: left;
  animation: ${fadeInUp} 0.6s ease-out 0.4s both;
`;

const InfoBoxTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ $color }) => $color};
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const Footer = styled.p`
  font-size: 13px;
  color: #888888;
  margin: 32px 0 0 0;
  line-height: 1.5;
  animation: ${fadeInUp} 0.6s ease-out 0.5s both;
`;

const Link = styled.a`
  color: ${({ $color }) => $color};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// --- Program Configuration ---
const PROGRAM_CONFIG = {
  oakton: {
    name: 'Oakton Workforce Empowerment Initiative (WEI)',
    shortName: 'Oakton WEI',
    color: '#006853',
    contactEmail: 'wei@oakton.edu',
    aboutUrl: 'https://www.oakton.edu/paying-for-college/wei-grant.php',
  },
  ihtu: {
    name: 'IHTU Program',
    shortName: 'IHTU',
    color: '#0C447C',
    contactEmail: 'info@ihtu.org',
    aboutUrl: '#',
  },
};

// --- Component ---
export default function SubmissionSuccess() {
  const location = useLocation();

  // Read program from query string (?program=oakton) or from navigation state
  const params = new URLSearchParams(location.search);
  const programId = params.get('program') || location.state?.program || 'oakton';

  const config = PROGRAM_CONFIG[programId] || PROGRAM_CONFIG.oakton;

  return (
    <PageWrapper>
      <Card>
        <CheckmarkContainer>
          <CheckRing $color={config.color} />
          <CheckCircle $color={config.color}>
            <Checkmark viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </Checkmark>
          </CheckCircle>
        </CheckmarkContainer>

        <Title>Application submitted!</Title>

        <Subtitle>
          Thank you for filling out the <strong>{config.name}</strong> application.
        </Subtitle>

        <InfoBox>
          <InfoBoxTitle $color={config.color}>What's next</InfoBoxTitle>
          You should receive a confirmation email in a few minutes with next steps. Be sure to check your spam folder if you don't see it.
        </InfoBox>

        <Footer>
          Questions? Email{' '}
          <Link href={`mailto:${config.contactEmail}`} $color={config.color}>
            {config.contactEmail}
          </Link>
        </Footer>
      </Card>
    </PageWrapper>
  );
}