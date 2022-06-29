import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { Modal as AntdModal } from 'antd'
import { AiFillEdit } from 'react-icons/ai'
import { FaTrash, FaSadTear } from 'react-icons/fa'
import moment from 'moment/min/moment-with-locales'
import axios from 'axios'

const OngoingOrdersModal = (props) => {
    console.log(props.data)

    const getLocalizedDate = (date) => {
        const localized = moment(date).locale("id").format('LL')
        return localized
    }

    const getDaysBeforeStartDate = (date) => {
        const daysBeforeStartDate = moment(date).diff(moment(Date.now()), 'days')
        return daysBeforeStartDate
    }

    const handleOnDeliveryOrder = (orderId) => {
        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/order/on-delivery/${orderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            if(res.data.statusText === 'ORDER_ON_DELIVERY'){
                AntdModal.success({
                    title: 'Terima kasih!',
                    content: (
                        <div>
                            <p>
                                Mohon segera mengirim barang kamu ya!
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

    const handleOwnerItemArrived = (orderId) => {
        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/order/owner-item-arrived/${orderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
        }).then(res => {
            if(res.data.statusText === 'ITEM_ARRIVED_TO_OWNER'){
                AntdModal.success({
                    title: 'Terima kasih sudah meminjamkan barang kamu!',
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

    const getCurrentItemStatus = (order) => {
        if(order.OrderStatus_Owner === 'BARANG SEDANG DIKIRIM'){
            return(
                <div className="full-width">
                    <p className="text-success" style={{textAlign: 'right'}}><strong>{order.OrderStatus_Owner}</strong></p>
                </div>
            )
        }
        else if(order.OrderStatus_Owner === 'BARANG SEDANG DIPINJAM'){
            return (
                <div className="full-width">
                    <p className="text-success" style={{textAlign: 'right'}}><strong>{order.OrderStatus_Owner}</strong></p>
                </div>
            )
        }
        else if(order.OrderStatus_Owner === 'BARANG SEDANG DIKEMBALIKAN'){
            return (
                <div className="full-width">
                    <p className="text-success" style={{textAlign: 'right'}}><strong>{order.OrderStatus_Owner}</strong></p>
                    <Button onClick={() => handleOwnerItemArrived(order._id)} className="btn-sm primary-button py-0">Barang sudah diterima</Button>
                </div>
            )
        }
        else if(order.OrderStatus_Owner === 'PEMINJAMAN SELESAI'){
            return (
                <div className="full-width">
                    <p className="text-success" style={{textAlign: 'right'}}><strong>{order.OrderStatus_Owner}</strong></p>
                </div>
            )
        }
        else{
            if(getDaysBeforeStartDate(order.ItemBorrowDate[0]) > 1){
                return (
                    <div className="d-flex justify-content-end full-width">
                        <Button onClick={() => handleOnDeliveryOrder(order._id)} className="btn-sm tertiary-button ps-5 pe-5" disabled>Kirim Barang</Button>
                    </div>
                )
            }
            else if(getDaysBeforeStartDate(order.ItemBorrowDate[0]) === 0){
                return (
                    <div className="d-flex justify-content-end full-width">
                        <Button onClick={() => handleOnDeliveryOrder(order._id)} className="btn-sm tertiary-button ps-5 pe-5">Kirim Barang</Button>
                    </div>
                )
            }
            else if(getDaysBeforeStartDate(order.ItemBorrowDate[0]) === 1){
                return (
                    <div className="d-flex justify-content-end full-width">
                        <Button onClick={() => handleOnDeliveryOrder(order._id)} className="btn-sm tertiary-button ps-5 pe-5">Kirim Barang</Button>
                    </div>
                )
            }                   
        }
    }

    const getBorrowDateAdditionalInfo = (order) => {
        if(order.OrderStatus_Owner === 'BARANG SEDANG DIPINJAM'){
            return (
                <p 
                    className="secondary-font-color mt-2" 
                    style={{marginBlockEnd: '0px', fontSize:'0.8rem'}}
                >
                    <strong>Barang dikembalikan pada tanggal {getLocalizedDate(order.ItemBorrowDate[2])}</strong>
                </p>
            )
        }
        else if(order.OrderStatus_Owner === 'BARANG SEDANG DIKIRIM'){
            return null
        }
        else if(order.OrderStatus_Owner === 'BARANG SEDANG DIKEMBALIKAN'){
            return null
        }
        else if(order.OrderStatus_Owner === 'PEMINJAMAN SELESAI'){
            return null
        }
        else{
            if(getDaysBeforeStartDate(order.ItemBorrowDate[0]) > 0){
                return (
                    <p 
                        className="secondary-font-color mt-2" 
                        style={{marginBlockEnd: '0px', fontSize:'0.8rem'}}
                    >
                        Barang harus dikirim {getDaysBeforeStartDate(order.ItemBorrowDate[0])} hari dari sekarang
                    </p>
                )
            }
            else if(getDaysBeforeStartDate(order.ItemBorrowDate[0]) === 0){
                return (
                    <p className="secondary-font-color mt-2" style={{marginBlockEnd: '0px', fontSize:'0.9rem'}}> <strong>Barang harus dikirim hari ini</strong></p>
                )
            }
        }
    }

    return (
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
                    <h5>Pesanan</h5>
                    <h4 className="secondary-font-color"><strong>{props.ItemDetail.ItemName}</strong></h4>
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
                    <Col sm={2}>
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
                                <br />
                                {
                                   getBorrowDateAdditionalInfo(order)
                                }
                            </Col>
                            <Col>
                                {order.DeliveryOption}
                            </Col>
                            <Col>
                                Rp.{new Intl.NumberFormat('id-ID').format(order.OrderPrice)}
                            </Col>
                            <Col sm={2} className="border-left">
                                {
                                    getCurrentItemStatus(order)
                                }
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

export default OngoingOrdersModal
