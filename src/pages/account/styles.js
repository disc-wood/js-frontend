// defines shared styled-components used across authentication pages (login, signup, etc.).

import styled from 'styled-components';
import { Button } from '@/common/components/atoms/Button';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 16px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  margin: 60px auto;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 768px) {
    margin: 40px auto;
    padding: 28px;
  }

  @media (max-width: 480px) {
    margin: 20px auto;
    padding: 24px;
    gap: 14px;
    border-radius: 10px;
  }
`;

export const StyledPage = styled.div`
  flex: 1 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 480px) {
    align-items: flex-start;
    padding: 0 24px;
  }
`;

export const StyledButton = styled(Button.Primary)`
  font-size: 14px;
  font-weight: 500;
  padding: 10px 24px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 10px 20px;
  }
`;

export const SignupText = styled.p`
  margin: 8px 0 0 0;
  color: #555555;
  font-size: 13px;
  text-align: center;
  font-family: inherit;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;