import React from 'react';
import Button from '../button/Button.jsx';

const SignInButton = (props) => (
  <Button
    id="btn-sign-in"
    color="w3-indigo"
    text={props.translate('Sign in with Google')}
  />
);

export default SignInButton;
