import {React, useState, useRef, useEffect} from 'react'
import Button from 'react-bootstrap/Button'
import { Modal } from 'antd' 
import {AiFillCheckCircle, AiFillWarning} from 'react-icons/ai'
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'
import axios from 'axios'

const PaymentPending = (props) => {
    console.log('PAYMENT PENDING COMPONENT CALLED')
    const [isMidtransClientActive, setIsMidtransClientActive] = useState(false)
    const transactionToken = useRef('')
    console.log('PROPS')
    console.log(props)
    const getTransactionStatusColor = (transactionStatus) =>{
        if(transactionStatus === 'pending'){
            return '#ffc107'
        }
        if(transactionStatus === 'settlement'){
            return '#198754'
        }
    }

    const triggerDeleteModal = () => {
        Modal.confirm({
            title: 'Batal Pembayaran',
            icon: <AiFillWarning style={{color: '#ffc107', fontSize: '25px'}} />,
            content: <p style={{marginBottom: '20px'}}>Apakah kamu yakin untuk membatalkan pembayaran ini?</p>,
            okText: 'Batalkan pembayaran',
            cancelText: 'Tidak jadi',
            okButtonProps: {
                style: {
                    backgroundColor: '#3D4667',
                    border: '1px solid #3D4667'
                }
            },

            onOk: () => handleCancelPayment(),
          });
    }

    const handlePreparePaymentData = (gross_amount) => {
        let orderedItems = []

        props.transaction.OrderedItems.forEach(orderedItem => {
            const itemBorrowDate = orderedItem.ItemBorrowDate
            const itemDetail = orderedItem.ItemDetail._id
            const selectedDeliveryOption = orderedItem.SelectedDeliveryOption
            const selectedDeliveryOptionPrice = orderedItem.SelectedDeliveryOptionPrice
            const itemBorrowPrice = orderedItem.ItemBorrowPrice

            orderedItems.push({
                ItemBorrowDate: itemBorrowDate,
                ItemBorrowPrice: itemBorrowPrice,
                ItemDetail: itemDetail,
                SelectedDeliveryOption: selectedDeliveryOption,
                SelectedDeliveryOptionPrice: selectedDeliveryOptionPrice
            })
        });

        axios({
          method: 'post',
          url: `http://localhost:5000/api/transaction/pending/${props.transaction.OrderId}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          data: {
            gross_amount: gross_amount,
            orderedItems: orderedItems,
          }
        }).then(res => {
          console.log(res)
          transactionToken.current = res.data.transactionToken
          console.log(transactionToken.current)
          setIsMidtransClientActive(true)
        }).then(() => {
          window.snap.pay(transactionToken.current)
        })
    }
    
    const handleCancelPayment = () => {
        axios({
            method: 'delete',
            url: `http://localhost:5000/api/transaction/${props.transaction.OrderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            window.location.reload()
        })
    }

    useEffect(() => {
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'
        const myMidtransClientKey = 'SB-Mid-client-Kjuc3gPYCZ1xQl0a'
    
        let scriptTag = document.createElement('script')
        scriptTag.src = midtransScriptUrl
        scriptTag.setAttribute('data-client-key', myMidtransClientKey)
        document.body.appendChild(scriptTag)
    
        return () => {
          document.body.removeChild(scriptTag)
        }
      }, [isMidtransClientActive])

    if(props === null || props === undefined){
        return(
            <CustomCircularLoading />
        )
    }
  return (
    <div>
        <div>
            <p style={{marginBlockEnd: '0', textAlign: 'right'}} className="pe-2">
                <strong>Status Pembayaran:</strong> 
                &nbsp; 
                <span style={{color: getTransactionStatusColor(props.transaction.TransactionStatus), fontSize: '16px', WebkitTextStroke: '0.1px #000'}}>
                    <strong>
                        {props.transaction.TransactionStatus.toUpperCase()}<AiFillWarning style={{marginBottom: '5px', color: '#ffc107'}}/>
                    </strong>
                </span>
            </p>

            <p style={{marginBlockEnd: '0', textAlign: 'right'}} className="pe-2">
                <strong>Harga:</strong> 
                &nbsp; 
                <span>
                     Rp. {new Intl.NumberFormat('id-ID').format(props.transaction.PaymentDetail.gross_amount)}
                </span>
            </p>
        </div>

        <div className="d-flex justify-content-end pe-2 mt-4" style={{width: '100%'}}>
            <Button className="btn-sm primary-button m-2" onClick={() => handlePreparePaymentData(props.transaction.PaymentDetail.gross_amount)}>Selesaikan pembayaran</Button>
            <Button className="btn-sm tertiary-button-outlined m-2" onClick={() => triggerDeleteModal()}>Batalkan pembayaran</Button>
        </div>
    </div>
  )
}

export default PaymentPending