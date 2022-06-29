import React from 'react'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { AiFillCheckCircle, AiFillClockCircle } from 'react-icons/ai'

const PaymentNotification = () => {
    let location = useLocation()
    let [searchParams, setSearchParams] = useSearchParams()

    console.log(searchParams)
  return (
    <Container>
      {
        searchParams.get('transaction_status') === 'pending' &&
        <Row>
          <Col className="d-flex align-items-center" sm={6}>
            <div>
              <h3 className="text-left primary-font-color"><strong>Kamu belum menyelesaikan pembayaran!</strong></h3>
              <p style={{fontSize: '1.2rem'}} className="primary-font-color text-left">
                Klik <Link to="/order-history" className="payment-notification-hyperlink"><strong>Link ini</strong></Link> untuk pergi ke riwayat peminjaman kamu 
                dan menyelesaikan pembayaran!
              </p>
              <p style={{fontSize: '1.2rem'}} className="primary-font-color text-left mt-5">
                Order ID: <strong>{searchParams.get('order_id')}</strong>
              </p>
            </div>
          </Col>
          <Col>
            <Image 
                src='/vector_assets/payment-pending-licensed-[Converted].png' 
                fluid={true}
                alt="payment-pending-img"
            />
          </Col>
        </Row>
      }
      {
        searchParams.get('transaction_status') === 'settlement' &&
        <Row style={{height: '100%'}} >
          <Col className="d-flex align-items-center" sm={6}>
            <div>
              <h3 className="text-left">
                <strong>Terima kasih sudah membayar!</strong>
                <AiFillCheckCircle style={{marginBottom: '5px', color: '#198754'}}/>
              </h3>
              <p style={{fontSize: '1.2rem'}} className="primary-font-color text-left">
                Klik <Link to="/order-history" className="payment-notification-hyperlink"><strong>Link ini</strong></Link> untuk pergi ke riwayat peminjaman dan lihat detail pesanan kamu ya!
              </p>
              <p style={{fontSize: '1.2rem'}} className="primary-font-color text-left">
                Order ID: <strong>{searchParams.get('order_id')}</strong>
              </p>
            </div>
          </Col>
          <Col>
              <Image 
                  src='/vector_assets/payment-successful-licensed-[Converted].png' 
                  fluid={true}
                  alt="payment-successful-img"
              />
          </Col>
        </Row>
      }      
    </Container>
  )
}

export default PaymentNotification