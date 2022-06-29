import { React, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'; 
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Modal as AntdModal } from 'antd'
import { AiFillEdit } from 'react-icons/ai'
import { FaTrash, FaSadTear, FaPen } from 'react-icons/fa'
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import moment from 'moment/min/moment-with-locales'
import axios from 'axios'

const MyAddReviewModal = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [itemRating, setItemRating] = useState(5)
    const [itemReview, setItemReview] = useState('')
    const [ownerRating, setOwnerRating] = useState(5)


    const submitReview = (e) => {
        e.preventDefault()
         axios({
             method: 'POST',
             url: `http://localhost:5000/api/review`,
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': localStorage.getItem('token')
             },
             data: {
                orderRef: props.order._id,
                itemRef: props.order.ItemDetail._id,
                itemRating: itemRating,
                itemReview: itemReview,
                ownerRating: ownerRating,
                reviewedTo: props.order.ItemDetail.ItemCreatedBy.userId
             }
         }).then(res => {
            if(res.data.statusText === 'REVIEW_CREATED'){
                AntdModal.success({
                    title: 'Terima kasih sudah memberikan ulasan!',
                    onOk: () => {
                        window.location.reload()
                    },
                    okButtonProps: {
                        style: {
                            backgroundColor: '#3D4667',
                            border: '1px solid #3D4667'
                        }
                    },
                    zIndex: 9999,
                })
            }
         })
     }

    return (
        <Modal
          show ={props.show}
          onHide={() => props.onHide()}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <strong className="secondary-font-color">Ulasan</strong>
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={submitReview}>
            <Modal.Body>
                    <p style={{marginBlockEnd: '0px'}}><strong>Berikan ulasan mu</strong></p>
                    <FloatingLabel controlId="floatingTextarea2" label={<i className="text-muted">Ulasan tentang barang...</i>}>
                        <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: '150px' }}
                        value={ itemReview }
                        onChange={(e) => setItemReview(e.target.value)}
                        />
                    </FloatingLabel>
                    <div className="mt-3">
                        <p style={{marginBlockEnd: '0px'}}><strong>Berikan bintang untuk barangnya</strong></p>
                        <Rating name="size-large" size='large' defaultValue={5} precision={0.5} onClick={(e) => setItemRating(e.target.value)}/>
                    </div>
                   
                    <div className="mt-3">
                        <p style={{marginBlockEnd: '0px'}}><strong>Berikan bintang untuk pemiliknya juga, dong!</strong></p>
                        <Rating name="size-large" size='large' defaultValue={5} precision={0.5} onClick={(e) => setOwnerRating(e.target.value)}/>
                    </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-start">
                <Button type='submit' className="tertiary-button ps-4 pe-4">Kirim</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      );
}

const AddReviewModal = (props) => {
    const [modalShow, setModalShow] = useState(false)
    return (
        <>
        <Row className="pe-0">
            {
                props.order.review ? 
                <Col className="d-flex justify-content-end pe-0">
                    <p className="secondary-font-color"><strong>Ulasan sudah diberikan</strong></p>
                </Col>
                :
                <Col className="d-flex justify-content-end">
                    <Button onClick={() => setModalShow(true)} className="btn-sm tertiary-button ps-4 pe-4"><FaPen className="me-2" /><strong>Berikan ulasan kamu!</strong></Button>
                </Col>
            }
            
        </Row>
        <MyAddReviewModal 
            show={modalShow}
            onHide={() => setModalShow(false)}
            order={props.order}
        />
        </>
    )
}

export default AddReviewModal