import React, { useState } from 'react';

import { Icon } from '@/assets/icons/icons';
import PropTypes from 'prop-types';

import {
  IconContainer,
  InputContainer,
  InputName,
  InputTitle,
  PasswordContainer,
  RedSpan,
  StyledInput,
} from './styles';

function TitledInput({ title, required, children }) {
  return (
    <InputContainer>
      <InputName>
        <InputTitle>{title}</InputTitle>
        {required}
      </InputName>
      {children}
    </InputContainer>
  );
}

TitledInput.propTypes = {
  title: PropTypes.string.isRequired,
  required: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const InputPropTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
};

function TextField(props) {
  props.placeholder ??= 'Text Here';
  return <StyledInput type='text' {...props} />;
}

TextField.propTypes = InputPropTypes;

function InputText({ title, ...rest }) {
  return (
    <TitledInput title={title} required={rest.required}>
      <TextField {...rest} />
    </TitledInput>
  );
}

InputText.propTypes = {
  title: PropTypes.string.isRequired,
  ...InputPropTypes,
};

function PasswordField(props) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PasswordContainer>
      <StyledInput type={showPassword ? 'text' : 'password'} {...props} />
      <IconContainer onClick={toggleShowPassword}>
        {showPassword ? <Icon.eyeClosed /> : <Icon.eye />}
      </IconContainer>
    </PasswordContainer>
  );
}

PasswordField.propTypes = InputPropTypes;

function InputPassword({ title, ...rest }) {
  return (
    <TitledInput title={title} required={rest.required}>
      <PasswordField {...rest} />
    </TitledInput>
  );
}

InputPassword.propTypes = {
  title: PropTypes.string.isRequired,
  ...InputPropTypes,
};

export const Input = {
  Text: InputText,
  Password: InputPassword,
};
