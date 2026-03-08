import styled from 'styled-components';

import { Button } from '@/common/components/atoms/Button';

export const InputContainer = styled.div``;

export const InputName = styled.h3`
  margin: 0;
  text-align: left;
  font-weight: normal;
  font-size: 1rem;
  margin-bottom: 4px;
`;
export const InputTitle = styled.span`
  margin-right: 2px;
`;
export const RedSpan = styled.span`
  color: red;
`;

export const StyledInput = styled.input`
  font-size: 1rem;
  padding: 10px;
  border: transparent;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  background: #C8C8C8;
  color: #636363;
  line-height: 2;
`;

export const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const IconContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 8px;
  cursor: pointer;
`;

export const StyledButton = styled(Button.Primary)`
  font-size: 1rem;        /* bigger text inside buttons */
  width: 100%;
  font-align: center;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  line-height: 2;
`;
