import styled from 'styled-components';

import { Button } from '@/common/components/atoms/Button';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 20px;
  border-radius: 16px;
  width: 25%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
  padding: 40px;
  background: #DEDEDE;
  box-shadow: 0 8px 4px 0 rgba(0, 0, 0, 0.25);
`;

export const StyledPage = styled.div`
  flex: 1 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledButton = styled(Button.Primary)`
  font-size: 1.1rem;
  width: content;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: auto;
  margin-right: auto;
`;

export const SignupText = styled.p`
  margin: 0;
  color: black;
  font-size: 0.9rem;
  text-align: center;
`;
