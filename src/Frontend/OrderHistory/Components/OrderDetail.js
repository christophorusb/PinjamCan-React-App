import { React, useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import { Modal as AntdModal } from 'antd'
import moment from 'moment/min/moment-with-locales'
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'
import axios from 'axios'

import AddReviewModal from './AddReviewModal'

const OrderDetail = (props) => {
    const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(true)
    const [orderDetails, setOrderDetails] = useState([])
    const [isOrderDetailFetched, setIsOrderDetailFetched] = useState(false)
    const [addReviewModalShow, setAddReviewModalShow] = useState(false)

    console.log(orderDetails)
    console.log(props)
    const handleOrderDetailVisibility = () => {
        if(isOrderDetailVisible === false){
            setIsOrderDetailVisible(true)
        }
        else{
            setIsOrderDetailVisible(false)
        }
    }

    const getLocalizedDate = (date) => {
        const localized = moment(date).locale('id').format('LL')

        return localized
    }

    const handleReturnItem = (orderId) => {
        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/order/return-item/${orderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            if(res.data.statusText === 'ITEM_ON_RETURN'){
                AntdModal.success({
                    title: 'Terima kasih sudah mengembalikan barang!',
                    onOk: () => {
                        window.location.reload()
                    },
                    okButtonProps: {
                        style: {
                            backgroundColor: '#3D4667',
                            border: '1px solid #3D4667'
                        }
                    },
                })
            }
        })
    }

    const getReturnButtonStatus = (order) => {
        const daysBeforeReturnDate = moment(order.ItemBorrowDate[2]).diff(moment(Date.now()), 'days')

        if(daysBeforeReturnDate === 1){
            return (
                <Row>
                    <Col className="d-flex justify-content-end">
                        <Button onClick={() => handleReturnItem(order._id)} className="btn-sm tertiary-button"><strong>Klik disini saat mengembalikan barang</strong></Button>
                    </Col>
                </Row>
            )
        }
        else if(daysBeforeReturnDate === 0){
            return (
                <Row>
                    <Col className="d-flex justify-content-end">
                        <Button onClick={() => handleReturnItem(order._id)} className="btn-sm tertiary-button"><strong>Klik disini saat mengembalikan barang</strong></Button>
                    </Col>
                </Row>
            )
        }
        else{
            return (
                <Row>
                    <Col className="d-flex justify-content-end">
                        <Button 
                            // disabled 
                            className="btn-sm tertiary-button"
                            onClick={() => handleReturnItem(order._id)}
                        >
                            <strong>
                             Klik disini saat mengembalikan barang
                            </strong>
                        </Button>
                    </Col>
                </Row>
            )
        }
    }

    const handleArrivedItem = (orderId) => {
        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/order/arrived/${orderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            if(res.data.statusText === 'ITEM_ARRIVED_TO_BORROWER'){
                AntdModal.success({
                    title: 'Selamat meminjam!',
                    content: (
                        <div>
                            <p>
                                Jangan lupa kembalikan barang pada tanggal <strong>{getLocalizedDate(res.data.orderDetail.ItemBorrowDate[2])}</strong> ya!
                            </p>
                        </div>
                    ),
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

    const handleNotifyRefundRequest = (orderId) => {
        AntdModal.info({
            title: 'Pengembalian dana',
            content: (
                <div>
                    <p>
                        Pengajuan pengembalian dana sudah dikirim ke sistem kami.
                        Kamu akan menerima e-mail dalam waktu 1x24 jam.
                        <br />
                        <strong>Kami mohon maaf atas ketidaknyamanan nya, ya :(</strong>
                    </p>
                </div>
            ),
            okButtonProps: {
                style: {
                    backgroundColor: '#3D4667',
                    border: '1px solid #3D4667'
                }
            },
            onOk: () => {
                handleDeleteOrder(orderId)
            }
        })
    }

    const handleDeleteOrder = (orderId) => {
        axios({
            method: 'DELETE',
            url: `http://localhost:5000/api/order/remove/${orderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            window.location.reload()
        })
    }

    useEffect(() => {
        axios({
            method: 'GET',
            url: `http://localhost:5000/api/order/${props.transaction.OrderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            setOrderDetails(res.data.dataResponse)
        }).then(() => {
            setIsOrderDetailFetched(true)
        }).catch(err => {
            console.log(err.data)
        })
    }, [])

    if(isOrderDetailFetched === false){
        return null
    }
  return (
    <Row className="pe-0">
        {
            props.transaction.TransactionStatus === 'settlement' &&
            <div className="d-flex justify-content-end mt-5 mb-5 pe-1">
                <Button className="tertiary-button-outlined btn-sm" onClick={() => handleOrderDetailVisibility()}>
                    {isOrderDetailVisible === false ? <span>Lihat detail pesanan</span> : <span>Tutup detail pesanan</span>}
                </Button>
            </div>
        }
        
        {
            isOrderDetailVisible === true &&
            <div>
                <Row style={{fontSize: '16px'}} className="mb-2">
                    <Col>
                        <strong>Foto</strong>
                    </Col>
                    <Col>
                        <strong>Nama Barang</strong>
                    </Col>
                    <Col>
                        <strong>Pemilik Barang</strong>
                    </Col>
                    <Col>
                        <strong>Tanggal Peminjaman</strong>
                    </Col>
                    <Col>
                        <strong>Pengiriman</strong>
                    </Col>
                    <Col>
                        <strong>Harga</strong>
                    </Col>
                    <Col>
                        <strong>Status</strong>
                    </Col>
                </Row>
                {
                    orderDetails.map(orderedItem => (
                        <Row key={orderedItem._id} className="border-top pt-3 pb-3 border-bottom">
                            <Col>
                                <Image 
                                    src={orderedItem.ItemDetail.MainItemPictureLocalPath}
                                    thumbnail={true}
                                    height={100}
                                    width={100}
                                />
                            </Col>

                            <Col>
                                <p style={{marginBlockEnd: '0', fontSize:'14px'}}>{orderedItem.ItemDetail.ItemName}</p>
                            </Col>

                            <Col>
                                <p style={{marginBlockEnd: '0', fontSize:'14px'}}>{orderedItem.ItemDetail.ItemCreatedBy.user}</p>
                            </Col>

                            <Col>
                                <p style={{marginBlockEnd: '0', fontSize:'14px'}}>{getLocalizedDate(orderedItem.ItemBorrowDate[0])} - {getLocalizedDate(orderedItem.ItemBorrowDate[1])}</p>
                                {
                                    orderedItem.OrderStatus === 'BARANG SEDANG KAMU PINJAM' &&
                                    <p className="secondary-font-color mt-3"><strong>Mohon dikembalikan pada tanggal {getLocalizedDate(orderedItem.ItemBorrowDate[2])}</strong></p>
                                }
                            </Col>

                            <Col>
                                <p style={{marginBlockEnd: '0', fontSize:'14px'}}>{orderedItem.DeliveryOption}</p>
                            </Col>
                            <Col>
                                <p style={{marginBlockEnd: '0', fontSize:'14px'}}>Rp.{new Intl.NumberFormat('id-ID').format(orderedItem.OrderPrice)}</p>
                            </Col>

                            <Col>
                                {
                                    orderedItem.OrderStatus === 'PEMILIK BELUM KONFIRMASI' &&
                                    <p className="text-warning" style={{marginBlockEnd: '0', fontSize:'14px'}}><strong>{orderedItem.OrderStatus}</strong></p>
                                }
                                {
                                    orderedItem.OrderStatus === 'BARANG SEDANG DIKIRIM'  &&
                                    <p className="text-success" style={{marginBlockEnd: '0', fontSize:'14px'}}><strong>{orderedItem.OrderStatus}</strong></p>
                                }
                                {
                                    orderedItem.OrderStatus === 'PEMILIK SUDAH KONFIRMASI' &&
                                    <p className="text-success" style={{marginBlockEnd: '0', fontSize:'14px'}}><strong>{orderedItem.OrderStatus}</strong></p>
                                }
                                {
                                    orderedItem.OrderStatus === 'PESANAN DIBATALKAN OLEH PEMILIK' &&
                                    <p className="secondary-font-color" style={{marginBlockEnd: '0', fontSize:'14px'}}><strong>{orderedItem.OrderStatus}</strong></p>
                                }
                                {
                                    orderedItem.OrderStatus === 'PENGEMBALIAN DANA SEDANG DIPROSES' &&
                                    <p className="info-font-color" style={{marginBlockEnd: '0', fontSize:'14px'}}><strong>{orderedItem.OrderStatus}</strong></p>
                                }
                                {
                                    orderedItem.OrderStatus === 'BARANG SEDANG KAMU PINJAM' &&
                                    <p className="info-font-color" style={{marginBlockEnd: '0', fontSize:'14px'}}><strong>{orderedItem.OrderStatus}</strong></p>
                                }
                                {
                                    orderedItem.OrderStatus === 'BARANG SEDANG DIKEMBALIKAN' &&
                                    <p className="text-success" style={{marginBlockEnd: '0', fontSize:'14px'}}><strong>{orderedItem.OrderStatus}</strong></p>
                                }
                                {
                                    orderedItem.OrderStatus === 'PEMINJAMAN SELESAI' &&
                                    <p className="text-success" style={{marginBlockEnd: '0', fontSize:'14px'}}><strong>{orderedItem.OrderStatus}</strong></p>
                                }
                            </Col>
                            {
                                orderedItem.OrderStatus === 'BARANG SEDANG DIKIRIM' &&
                                <Row>
                                    <Col className="d-flex justify-content-end">
                                        <Button onClick={() => handleArrivedItem(orderedItem._id)} className="btn-sm tertiary-button"><strong>Klik disini jika barang sudah sampai</strong></Button>
                                    </Col>
                                </Row>
                            }
                            {
                                orderedItem.OrderStatus === 'PESANAN DIBATALKAN OLEH PEMILIK' &&
                                <Row>
                                    <Col className="d-flex justify-content-end">
                                        <Button onClick={() => handleNotifyRefundRequest(orderedItem._id)} className="btn-sm tertiary-button"><strong>Klik disini untuk mengajukan pengembalian dana</strong></Button>
                                    </Col>
                                </Row>
                            }
                            {
                                orderedItem.OrderStatus === 'BARANG SEDANG KAMU PINJAM' &&
                                getReturnButtonStatus(orderedItem)
                            }
                            {
                                orderedItem.OrderStatus === 'BARANG SEDANG DIKEMBALIKAN' &&
                                <AddReviewModal order = {orderedItem} />
                            }
                            {
                                orderedItem.OrderStatus === 'PEMINJAMAN SELESAI' &&
                                <AddReviewModal order = {orderedItem} />
                            }
                        </Row>
                    ))
                }
            </div>
        }
        
    </Row>
  )
}

export default OrderDetail