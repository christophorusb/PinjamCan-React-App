import React from 'react'

import Container from 'react-bootstrap/Container';
import RegisterForm from  '../components/RegisterForm';

const Register = () => {
  return (
    <Container className="register-page-wrapper">
      <RegisterForm />
    </Container>
  )
}

export default Register