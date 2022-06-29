import {React, useState} from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment/min/moment-with-locales'
import {AiFillCheckCircle, AiFillWarning} from 'react-icons/ai'

const PaymentSettled = (props) => {
    const [showPaymentDetail, setShowPaymentDetail] = useState(true)

    const getTransactionStatusColor = (transactionStatus) =>{
        if(transactionStatus === 'pending'){
            return '#ffc107'
        }
        if(transactionStatus === 'settlement'){
            return '#198754'
        }
    }

    const handleShowPaymentDetail = () => {
        if(showPaymentDetail === true){
            setShowPaymentDetail(false)
        }
        else{
            setShowPaymentDetail(true)
        }
    }
        return (
            <div>
                <div className="mb-3">
                    <p style={{marginBlockEnd: '0', textAlign: 'right'}} className="pe-2">
                        <strong>Status Pembayaran:</strong> 
                        &nbsp; 
                        <span style={{color: getTransactionStatusColor(props.transaction.TransactionStatus), fontSize: '16px'}}>
                            <strong>BERHASIL DIBAYAR<AiFillCheckCircle style={{marginBottom: '5px', color: '#198754'}}/></strong>
                        </span>
                    </p>
                    <p className="pe-2 secondary-font-color" style={{textAlign: 'right', textDecoration: 'underline', cursor:'pointer'}} onClick={() => handleShowPaymentDetail()}>
                        <strong>{showPaymentDetail === true ? 'Tutup detail pembayaran' : 'Lihat detail pembayaran'} </strong>
                    </p>
                </div>
                {
                    showPaymentDetail &&
                    <Row className="border p-2 me-1">
                        <Row>
                            <Col style={{textAlign: 'left'}}>
                                <strong>Tanggal pembayaran </strong>
                            </Col>
                            <Col style={{textAlign: 'left'}}>
                                {moment(props.transaction.PaymentDetail.settlement_time).locale("id").format('LLL')}
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{textAlign: 'left'}}>
                                <strong>Total pembayaran </strong>
                            </Col>
                            <Col style={{textAlign: 'left'}}>
                                Rp. {new Intl.NumberFormat('id-ID').format(props.transaction.PaymentDetail.gross_amount)}
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{textAlign: 'left'}}>
                                <strong>Tipe pembayaran </strong>
                            </Col>
                            <Col style={{textAlign: 'left'}}>
                                {props.transaction.PaymentDetail.payment_type}
                            </Col>
                        </Row>
                    </Row>
                }
            </div>
        )
    }

export default PaymentSettled