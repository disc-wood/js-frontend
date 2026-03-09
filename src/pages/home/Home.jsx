import React, { useContext } from 'react';

import styled from 'styled-components';

import { Subtitle, Title } from '@/common/components/atoms/Text';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/common/contexts/UserContext';

//Style
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 750px;
  gap: 50px;
`;

const MainText = styled(Title)`
  font-weight: 400; 
  line-height: 1.4;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const HomePage = styled.div`
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start; 
  text-align: left;
  padding: 100px 80px; 
  background-color: #cde8fa; 
`;

const BaseButton = styled.button`
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  color: #ffffff;
  font-family: inherit;
  width: fit-content;
  display: flex;         /* Added to help center text inside button */
  align-items: center;   /* Added to help center text inside button */
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const GetStartedButton = styled(BaseButton)`
  background-color: #000000;
`;

//Page
export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <HomePage>
      <TextContainer>
        <MainText>
          Empowering educators and administrators with a comprehensive system to track learner progress and automate communication.
        </MainText>
        <GetStartedButton onClick={() => navigate('/signup')}>
          Get Started
        </GetStartedButton>
      </TextContainer>
    </HomePage>
  );
}
