import React from 'react'

import LoginImageAsset from '../Components/LoginImageAsset';
import LoginForm from '../Components/LoginForm';
import Container from 'react-bootstrap/Container';

import './Login.css';
import '../../../customGeneralStyle.css';

const Login = () => {
  return (
    <Container className="login-page-wrapper d-flex">
      <LoginForm />
    </Container>
  )
}

export default Login;