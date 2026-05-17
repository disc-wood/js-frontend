import React, { useContext } from 'react';
import styled from 'styled-components';

import { Subtitle, Title } from '@/common/components/atoms/Text';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/common/contexts/UserContext';

//Style
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 720px;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 18px;
  }
`;

const MainText = styled(Title)`
  font-weight: 500;
  font-size: 44px;
  line-height: 1.15;
  letter-spacing: -1px;
  color: #0a0a0a;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 36px;
    letter-spacing: -0.75px;
  }

  @media (max-width: 768px) {
    font-size: 28px;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    letter-spacing: -0.3px;
  }
`;

const HomePage = styled.div`
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  padding: 96px 80px;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 1024px) {
    padding: 64px 48px;
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
  }

  @media (max-width: 480px) {
    padding: 32px 20px;
  }
`;

const BaseButton = styled.button`
  border: 1px solid transparent;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  color: #ffffff;
  font-family: inherit;
  width: fit-content;
  display: flex;
  align-items: center;
  transition: transform 0.1s ease, background-color 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const GetStartedButton = styled(BaseButton)`
  background-color: #0a0a0a;
  margin-top: 8px;

  &:hover {
    background-color: #2a2a2a;
  }
`;

//Page
export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard'); // or wherever logged-in users go
    } else {
      navigate('/signup');
    }
  };

  return (
    <HomePage>
      <TextContainer>
        <MainText>
          Empowering educators and administrators with a comprehensive system to track learner progress and automate communication.
        </MainText>
        <GetStartedButton onClick={handleGetStarted}>
          Get started
        </GetStartedButton>
      </TextContainer>
    </HomePage>
  );
}