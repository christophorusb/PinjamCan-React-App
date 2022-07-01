import { React, useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import { AiFillEdit, AiFillExclamationCircle } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { Modal as AntdModal } from 'antd'
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'
import axios from 'axios'

import IncomingOrdersModal from '../components/IncomingOrdersModal'
import OngoingOrdersModal from '../components/OngoingOrdersModal'
import FinishedOrdersModal from '../components/FinishedOrdersModal'

const MyItems = () => {
    const [areItemsFetched, setAreItemsFetched] = useState(false)
    const [areItemsEmpty, setAreItemsEmpty] = useState(false)
    const [itemsByUserId, setItemsByUserId] = useState([])
    const [ongoingOrdersModalShow, setOngoingOrdersModalShow] = useState(false)
    const [finishedOrdersModalShow, setFinishedOrdersModalShow] = useState(false)

    console.log(itemsByUserId)

    const deleteItem = (itemId) => { 
        axios({
            method: 'DELETE',
            url: `http://localhost:5000/api/items/${itemId}`,
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status === 200){
                if(res.data.statusText === 'ITEM_DELETED'){
                    AntdModal.success({
                        title: 'Barang berhasil dihapus!',
                        okButtonProps: {
                            style: {
                                backgroundColor: '#3D4667',
                                border: '1px solid #3D4667'
                            }
                        },
                        onOk : () => {
                            window.location.reload()
                        }
                    })
                }
            }
        })
    }

    const handleDisableDeleteButton = (item) => {
        console.log(item.IncomingOrders)
        if(item.OngoingOrders.length === 0 && item.IncomingOrders.length === 0){
            return (
                <Button onClick = {() => deleteItemConfirmation(item._id)} className="btn-sm me-2 tertiary-button pe-3 ps-3">
                    <FaTrash style={{color: 'white'}}/> Hapus
                </Button>
            )
        }
        else{
            return <Button disabled className="btn-sm me-2 tertiary-button pe-3 ps-3"><FaTrash style={{color: 'white'}}/>Hapus</Button>
        }
    }

    const deleteItemConfirmation = (itemId) => {
        AntdModal.confirm({
            title: 'Apakah kamu yakin akan menghapus barang ini?',
            onOk: () => {
                deleteItem(itemId)
            },
            okButtonProps: {
                style: {
                    backgroundColor: '#FC5185',
                    border: 'none'
                }
            },
            zIndex: 9999,
            cancelText: 'Nggak jadi deh!',
            okText: 'Ya, saya yakin!'
        })
    }

    //side-effect for fetching items by userId
    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:5000/api/items/owner',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res.data)
            if(res.status === 200){
                if(res.data.statusText === 'ITEMS_FETCHED'){
                    setItemsByUserId(res.data.dataResponse)
                }
                if(res.data.statusText === 'ITEMS_EMPTY'){
                    setAreItemsEmpty(true)
                }
            }
        }).then(() => {
            setAreItemsFetched(true)
        })
    }, [])

    if(areItemsFetched === false) {
        return <CustomCircularLoading />
    }
  return (
    <Container className="pb-5">
        <h3 className="mb-5">Barangku</h3>
        
        {
            areItemsEmpty === true ?
            <div>
                {/* show empty */}
            </div>
            :
            itemsByUserId.map((item, index) => (
                <Row key={item._id} className="my-item-row border shadow mb-4 p-2 rounded">
                    <Row className="mb-3 pb-2 pt-2 border-bottom pe-1">
                        <div className="d-flex justify-content-between pe-0 ps-2">
                            <p className="secondary-font-color" style={{marginBlockEnd: '0px', fontSize: '18px'}}>
                                <strong>{item.ItemName}</strong>
                                <br />
                                {item.ItemStatus === 'Borrowed' && 
                                    <span className="info-font-color" style={{fontSize:'1rem'}}><strong>(SEDANG DIPINJAM)</strong></span>
                                }
                            </p>
                            {
                                item.OngoingOrders.length > 0 &&
                                <p className="secondary-font-color" style={{marginBlockEnd: '0px', fontSize: '14px'}}><strong>Barang ini memiliki pesanan yang sedang berlangsung</strong></p>
                            }
                            {
                                item.IncomingOrders.length > 0 &&
                                <IncomingOrdersModal 
                                    data = {item.IncomingOrders}
                                    ItemName = {item.ItemName}
                                />
                            }
                        </div>
                    </Row>
                    <Col sm={2}>
                        <Image 
                            src={item.MainItemPictureLocalPath}
                            thumbnail={true}
                            height={100}
                            width={100}
                        />
                    </Col>
                    <Col>
                        <Row>
                            <Row>
                                <Col>
                                    <strong><p style={{marginBlockEnd: '0px'}}>Kategori</p></strong>
                                </Col>
                                <Col className="mb-2">
                                    <p style={{marginBlockEnd: '0px'}}>{item.ItemCategory.Value}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong><p style={{marginBlockEnd: '0px'}}>Harga peminjaman</p></strong>
                                </Col>
                                <Col className="mb-2">
                                    <p style={{marginBlockEnd: '0px'}}>Rp.{new Intl.NumberFormat('id-ID').format(item.ItemPriceDaily)} (sehari) </p>
                                    <p style={{marginBlockEnd: '0px'}}>Rp.{new Intl.NumberFormat('id-ID').format(item.ItemPriceWeeklyPerDay)}/hari (7+ hari)</p>
                                    <p style={{marginBlockEnd: '0px'}}>Rp.{new Intl.NumberFormat('id-ID').format(item.ItemPriceMonthlyPerDay)}/hari (30+ hari)</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong><p style={{marginBlockEnd: '0px'}}>Durasi peminjaman minimum</p></strong>
                                </Col>
                                <Col className="mb-2">
                                    <p style={{marginBlockEnd: '0px'}}>{item.ItemMinimumRentDuration} hari</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong><p style={{marginBlockEnd: '0px'}}>Berat</p></strong>
                                </Col>
                                <Col className="mb-2">
                                    <p style={{marginBlockEnd: '0px'}}>{item.ItemWeight} gram</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong><p style={{marginBlockEnd: '0px'}}>Pilihan pengiriman</p></strong>
                                </Col>
                                <Col className="mb-2">
                                    {
                                        item.ItemDeliveryOptions.map(deliveryOption => (
                                            <p key={deliveryOption._id} style={{marginBlockEnd: '0px'}}>{deliveryOption.Label}</p>
                                        ))
                                    }
                                </Col>
                            </Row>
                        </Row>
                    </Col>
                    <Col>

                        <div className="d-flex flex-row justify-content-end">
                            {
                                item.OngoingOrders.length > 0 ?
                                <>
                                <Button onClick={() => setOngoingOrdersModalShow(true)} className="btn-sm me-2 primary-button pe-3 ps-3">
                                    <AiFillExclamationCircle 
                                        className="secondary-font-color me-2"
                                        style={{fontSize: '1.3rem'}}
                                    /> 
                                    Cek pesanan
                                </Button>
                                <OngoingOrdersModal 
                                    show={ongoingOrdersModalShow}
                                    onHide={() => setOngoingOrdersModalShow(false)}
                                    data = {item.OngoingOrders}
                                    ItemDetail = {item}
                                />
                                </>
                                :
                                <Button className="btn-sm me-2 primary-button pe-3 ps-3">
                                    Cek pesanan
                                </Button>
                            }
                            <Link to={`/my-items/edit/${item._id}`}>
                                <Button className="btn-sm me-2 secondary-button pe-3 ps-3"><AiFillEdit style={{color: 'white'}}/> Edit</Button>
                            </Link>
                            {
                               handleDisableDeleteButton(item)
                            }
                        </div>
                        {
                            item.FinishedOrders.length > 0 &&
                            <FinishedOrdersModal
                                data = {item.FinishedOrders}
                                ItemName = {item.ItemName}
                            />
                        }
                        
                    </Col>
                </Row>
            ))
        }
    </Container>
  )
}

export default MyItems