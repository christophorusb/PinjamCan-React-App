import { React, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { Modal as AntdModal } from 'antd'
import { AiFillEdit } from 'react-icons/ai'
import { FaTrash, FaSadTear } from 'react-icons/fa'
import moment from 'moment/min/moment-with-locales'
import axios from 'axios'

const IncomingOrdersModal = (props) => {
    const [incomingOrdersModalShow, setIncomingOrdersModalShow] = useState(false)
    console.log(props)

    const getLocalizedDate = (date) => {
        const localized = moment(date).locale("id").format('LL')
        return localized
    }

    const handleAcceptOrder = (orderId) => {
        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/order/accept/${orderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            console.log(res)
            if(res.data.statusText === 'ORDER_ACCEPTED'){
                console.log(res.data)
                AntdModal.success({
                    title: 'Terima kasih sudah menerima pesanan!',
                    content: (
                        <div>
                            <p>
                                Silahkan cek pesanan dan segera lakukan pengiriman
                                <strong> sehari sebelum {getLocalizedDate(res.data.ItemBorrowDate[0])}</strong> ya!
                            </p>
                        </div>
                    ),
                    zIndex: 9999,
                    onOk: () => {
                        window.location.reload()
                    },
                    okButtonProps: {
                        style: {
                            backgroundColor: '#3D4667',
                            border: '1px solid #3D4667'
                        }
                    }
                })
            }
        })
    }

    const handleConfirmRejectOrder = (orderId) => {
        AntdModal.confirm({
            title: 'Apakah kamu yakin akan menolak pesanan ini?',
            content: 'Peminjam mungkin sedang sangat membutuhkan barangnya, lho :(',
            onOk: () => {
                handleRejectOrder(orderId)
            },
            okButtonProps: {
                style: {
                    backgroundColor: '#FC5185',
                }
            },
            zIndex: 9999,
            cancelText: 'Nggak jadi deh!',
            okText: 'Ya, saya yakin!'
        })
    }

    const handleRejectOrder = (orderId) => {
        console.log('order highkey rejected')
        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/order/reject/${orderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            console.log(res)
            if(res.data.statusText === 'ORDER_REJECTED_BY_OWNER'){
                AntdModal.info({
                    title: 'Pesanan berhasil ditolak',
                    content: (
                        <div>
                            <p>
                                Uang akan dikembalikan kepada peminjam.
                                Semoga kamu tidak sering-sering menolak pesanan, ya!
                            </p>
                        </div>
                    ),
                    icon: <FaSadTear style={{color: '#ffc107', fontSize: '16px'}}/>,
                    zIndex: 9999,
                    onOk: () => {
                        window.location.reload()
                    },
                    okButtonProps: {
                        style: {
                            backgroundColor: '#3D4667',
                            border: '1px solid #3D4667'
                        }
                    }
                })
            }
        })
    }

    const MyIncomingOrdersModal = (props) => {
        return(
            <Modal
                show = {props.show}
                scrollable = {true}
                onHide = {props.onHide}
                size= "xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h5>Pesanan Datang</h5>
                        <h4 className="secondary-font-color"><strong>{props.ItemName}</strong></h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="border-bottom border-top pt-2 pb-2 " style={{fontSize: '1rem'}}>
                        <Col>
                            <strong>Peminjam</strong>
                        </Col>
                        <Col>
                            <strong>Alamat</strong>
                        </Col>
                        <Col>
                            <strong>Tanggal Peminjaman</strong>
                        </Col>
                        <Col>
                            <strong>Pilihan Pengiriman</strong>
                        </Col>
                        <Col>
                            <strong>Harga</strong>
                        </Col>
                        <Col sm={1}>
                        </Col>
                    </Row>
                    {
                        props.data.map((order, index) => (
                            <Row key={order._id} className="border-bottom pt-4 pb-4" style={{fontSize: '1rem'}}>
                                <Col>
                                    {order.OrderedBy.userFullName}
                                </Col>
                                <Col>
                                    {order.OrderedBy.userAddress}
                                </Col>
                                <Col>
                                    {getLocalizedDate(order.ItemBorrowDate[0])} - {getLocalizedDate(order.ItemBorrowDate[1])}
                                </Col>
                                <Col>
                                    {order.DeliveryOption}
                                </Col>
                                <Col>
                                    Rp.{new Intl.NumberFormat('id-ID').format(order.OrderPrice)}
                                </Col>
                                <Col sm={1} className="border-left">
                                    <div className="d-flex justify-content-end">
                                        <Button onClick={() => handleAcceptOrder(order._id)} className="btn-sm me-2 primary-button ps-3 pe-3">Terima</Button>
                                        <Button onClick={() => handleConfirmRejectOrder(order._id)} className="btn-sm tertiary-button ps-3 pe-3">Tolak</Button>
                                    </div>
                                </Col>
                            </Row>
                        ))
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide} className="tertiary-button-outlined">Tutup</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <>
        <Alert variant = "success">
            <p style={{marginBlockEnd: '0px', fontSize: '0.9rem'}}>
                Barang ini mendapat pesanan baru!
                <br />
                <Alert.Link 
                    onClick={() => setIncomingOrdersModalShow(true)} 
                    className="text-decoration-underline"
                >
                    Klik untuk melihat
                </Alert.Link>
            </p>
        </Alert>
        <MyIncomingOrdersModal 
            show={incomingOrdersModalShow}
            onHide={() => setIncomingOrdersModalShow(false)}
            data = {props.data}
            ItemName = {props.ItemName}
        />
        
        </>
    )
}

export default IncomingOrdersModal
