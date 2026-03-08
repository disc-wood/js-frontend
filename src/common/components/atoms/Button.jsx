import styled from 'styled-components';

const ButtonBase = styled.button`
  font-size: 0.8em;
  padding: 10px;
  border-radius: 6px;
  border: transparent;
  color: var(--text);
  cursor: pointer;
`;

const ButtonPrimary = styled(ButtonBase)`
  background: linear-gradient(to right, #204775, #3491FF);
  border-color: transparent;
  color: var(--white);
`;

const ButtonSecondary = styled(ButtonBase)`
  background-color: var(--secondary-lightgrey);
  border-color: var(--text);
`;

const ButtonTransparent = styled(ButtonBase)`
  background-color: transparent;
`;

const ButtonInvisible = styled(ButtonBase)`
  background-color: transparent;
  border-color: transparent;
`;

export const Button = {
  Primary: ButtonPrimary,
  Secondary: ButtonSecondary,
  Transparent: ButtonTransparent,
  Invisible: ButtonInvisible,
};