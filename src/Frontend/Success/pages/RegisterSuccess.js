import { React, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import './RegisterSuccess.css'
import '../../../customGeneralStyle.css'

const RegisterSuccessModal = (props) => {
    return (
        <Modal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="modal-50w"
          backdrop="static"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
            <h3><strong><span className="primary-font-color">Pinjam</span><span className="secondary-font-color">Can</span></strong></h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="custom-register-success-modal">
            <strong><h4 style={{textAlign: 'center'}}>Akun kamu berhasil dibuat!</h4></strong>
            <Link to="/login" style={{marginTop: '5em'}}>
                <Button className="primary-background-color back-to-login-btn">Kembali Ke Login</Button>
            </Link>
          </Modal.Body>
        </Modal>
      );
}
const RegisterSuccess = () => {
    const modalShow = true
    return (
        <RegisterSuccessModal
          show={modalShow}
        />
    );
}

export default RegisterSuccess