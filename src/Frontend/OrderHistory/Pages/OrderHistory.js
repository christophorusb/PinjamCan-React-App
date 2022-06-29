import { React, useEffect, useState }  from 'react'
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import PaymentSettled from '../Components/PaymentSettled'
import PaymentPending from '../Components/PaymentPending'
import OrderDetail from '../Components/OrderDetail'

const OrderHistory = () => {
    const [transactions, setTransactions] = useState([])
    const [areTransactionsFetched, setAreTransactionsFetched] = useState(false)

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:5000/api/transaction/history',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            console.log(res.data.dataResponse)
            setTransactions(res.data.dataResponse)
        }).then(() => {
            setAreTransactionsFetched(true)
        }).catch(err => {
            console.log(err.data)
        })
    },[])

    if(areTransactionsFetched === false) {
        return <CustomCircularLoading />
    }
    return (
        <Container>
            <h3 className="primary-font-color mb-5">Riwayat Peminjaman</h3>
            {
                transactions.map(transaction => (
                    <Row key={transaction.TransactionId} className="border rounded shadow p-3 order-history-row primary-font-color mb-5">
                        <Col sm={7}>
                            <Row>
                                <p style={{marginBlockEnd: '0', fontSize:'16px'}}><strong>ID Pesanan: </strong>{transaction.OrderId}</p>
                                {transaction.TransactionStatus === 'settlement' && <p style={{marginBlockEnd: '0', fontSize:'16px'}}><strong>ID Transaksi: </strong>{transaction.TransactionId}</p>}
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                {
                                    transaction.TransactionStatus === 'settlement' ?
                                    <PaymentSettled transaction = {transaction} />
                                    :
                                    <PaymentPending transaction = {transaction} />
                                }
                            </Row>
                        </Col>
                        
                        <OrderDetail transaction = {transaction} />
                    </Row> 
                ))
            }
        </Container>
    )
}

export default OrderHistory