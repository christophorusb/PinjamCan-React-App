import { React, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import moment from 'moment/min/moment-with-locales'

const FinishedOrdersModal = (props) => {
    const [finishedOrdersModalShow, setFinishedOrdersModalShow] = useState(false)

    const getLocalizedDate = (date) => {
        const localized = moment(date).locale("id").format('LL')
        return localized
    }

    const MyFinishedOrdersModal = (props) => {
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
                        <h5>Riwayat Pesanan</h5>
                        <h4 className="secondary-font-color"><strong>{props.ItemName}</strong></h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="border-bottom border-top pt-2 pb-2  primary-font-color" style={{fontSize: '1rem'}}>
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
                        {/* <Col sm={2}>
                        </Col> */}
                    </Row>
                    {
                        props.data.map((order, index) => (
                            <Row key={order._id} className="border-bottom pt-4 pb-4 primary-font-color" style={{fontSize: '1rem'}}>
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
                                {/* <Col sm={2} className="border-left">
                                    <p className="text-success" style={{textAlign: 'left', marginBlockEnd:'0px'}}><strong>{order.OrderStatus}</strong></p>
                                </Col> */}
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
            <div className="d-flex justify-content-end mt-2 me-2">
                <p 
                    className="text-decoration-underline secondary-font-color" 
                    style={{cursor: 'pointer'}}
                    onClick={() => setFinishedOrdersModalShow(true)}
                >
                    <strong>Lihat riwayat pesanan</strong>
                </p>
            </div>
            <MyFinishedOrdersModal 
                show={finishedOrdersModalShow}
                onHide={() => setFinishedOrdersModalShow(false)}
                data = {props.data}
                ItemName = {props.ItemName}
            />
        </>
    )
}

export default FinishedOrdersModal