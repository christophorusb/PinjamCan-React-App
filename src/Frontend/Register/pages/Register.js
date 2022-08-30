import { React, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import RegisterForm from  '../components/RegisterForm';

const Register = () => {
  //T&C Modal
  const [showModal, setShowModal] = useState(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true)

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
              <Modal.Title>Sebelum lanjut registrasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Baca <a href="/terms-and-conditions" className='secondary-font-color' target="_blank"><strong><u>syarat dan ketentuan</u></strong></a> kami dulu yuk biar kamu lebih paham!
          </Modal.Body>
          <Modal.Footer>
              <Button className="secondary-button" onClick={handleCloseModal}>
                  Sudah!
              </Button>
              {/* <Button variant="primary" onClick={handleCloseModal}>
                  Save Changes
              </Button> */}
          </Modal.Footer>
      </Modal>
      <Container className="register-page-wrapper">
        <RegisterForm />
      </Container>
    </>
  )
}

export default Register