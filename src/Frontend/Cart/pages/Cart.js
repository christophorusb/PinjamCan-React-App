import { React, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button';
import {Container, Row, Col, Image, Button as BootstrapButton} from 'react-bootstrap';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'
import {FaTrash} from 'react-icons/fa'
import moment from 'moment/min/moment-with-locales'
import { v4 as uuidv4 } from 'uuid'

import EmptyCart from '../components/EmptyCart';

const Cart = () => {
  let cartTotalPrice = 0
  const [isCartLoading, setIsCartLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [isCartEmpty, setIsCartEmpty] = useState(true)
  const [isCheckoutActive, setIsCheckoutActive] = useState(false)
  const [checkedOutItems, setCheckedOutItems] = useState({})
  const [deliveryTotalPrice, setDeliveryTotalPrice] = useState(0)
  const [areAllDeliveryOptionsSelected, setAreAllDeliveryOptionsSelected] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isMidtransClientActive, setIsMidtransClientActive] = useState(false)
  const transactionToken = useRef('')
  const deliveryOptionsSelectedInCartCount = useRef(0)
  const totalBorrowPricePerItemArr = useRef([])
  
  // console.log('RERENDERING CART PAGE')
  // console.log(`cartTotalPriceInLocalStorage: ${localStorage.getItem('cartTotalPrice')}`)

  let auth_token = localStorage.getItem('token')

  console.log(cartItems)
  console.log(checkedOutItems)
  // if(!isCartLoading){
  //   console.log(cartItems.CartItems)
  // }
  // console.log(deliveryOptions)

  const UTC_DateStringToLocale = (dateStrings) => {
    let locale = moment(dateStrings).locale('id').format('LL')
    return locale
  }

  const calculateTotalPricePerItem = (item) => {
    const dateRange = item.ItemBorrowDate
    const startDate = moment(dateRange[0]).toDate()
    const endDate = moment(dateRange[1]).toDate()
    const dateDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
    let totalPricePerItem = 0

    if(dateDiff >= 1 && dateDiff < 7){
      //console.log('calculating price per item between 1 and 6 days')
      totalPricePerItem = item.ItemDetail.ItemPriceDaily * dateDiff

      cartTotalPrice += totalPricePerItem
      
      totalBorrowPricePerItemArr.current.push({
        itemName: item.ItemDetail.ItemName,
        totalPricePerItem: totalPricePerItem,
      })
      
      return new Intl.NumberFormat('id-ID').format(totalPricePerItem)
    }

    else if(dateDiff >= 7 && dateDiff < 30){
      //console.log('calculating price per item between 7 and 30 days')
      totalPricePerItem = item.ItemDetail.ItemPriceWeeklyPerDay * dateDiff
      cartTotalPrice += totalPricePerItem

      totalBorrowPricePerItemArr.current.push({
        itemName: item.ItemDetail.ItemName,
        totalPricePerItem: totalPricePerItem,
      })

      return new Intl.NumberFormat('id-ID').format(totalPricePerItem)
    }

    else if(dateDiff >= 30){
      //console.log('calculating price per item between 30 and 365 days')
      totalPricePerItem = item.ItemDetail.ItemPriceMonthlyPerDay * dateDiff
      cartTotalPrice += totalPricePerItem

      totalBorrowPricePerItemArr.current.push({
        itemName: item.ItemDetail.ItemName,
        totalPricePerItem: totalPricePerItem,
      })

      return  new Intl.NumberFormat('id-ID').format(totalPricePerItem)
    }
  }

  const displayCartTotalPrice = (total) => {
    localStorage.setItem('cartTotalPrice', total)
    return new Intl.NumberFormat('id-ID').format(total)
  }

  const displayDeliveryTotalPrice = (total) => {
    return new Intl.NumberFormat('id-ID').format(total)
  }

  const displayTotalPrice = (total) => {
    return new Intl.NumberFormat('id-ID').format(total)
  }

  const handleCheckoutItem = (event, itemDetail) => {
    const max = 50000
    const min = 10000
    const deliveryOptionPriceDemo = Math.floor(Math.random() * (max - min + 1)) + min
    if(event.target.value === 'Antar-Sendiri'){
      const thisItemCheckoutPrice = totalBorrowPricePerItemArr.current.find(item => item.itemName === itemDetail.ItemName).totalPricePerItem
      setCheckedOutItems({...checkedOutItems, [event.target.name]: [event.target.value, 0, itemDetail._id, thisItemCheckoutPrice]})
    }
    else{
      const thisItemCheckoutPrice = totalBorrowPricePerItemArr.current.find(item => item.itemName === itemDetail.ItemName).totalPricePerItem
      setCheckedOutItems({...checkedOutItems, [event.target.name]: [event.target.value, deliveryOptionPriceDemo, itemDetail._id, thisItemCheckoutPrice]})
    }
  }

  const getSelectValue = (itemDetail) => {
    let matchedVal
    for (const [key, value] of Object.entries(checkedOutItems)){
      if(key.includes(itemDetail.ItemName)){
        console.log('true')
        matchedVal = value[0]
      }  
    }
    return matchedVal
  }

  const handleCheckOut = () => {
    console.log('handling checkout')
    for(let i = 0; i < cartItems.CartItems.length; i++){
      for(let n = 0; n < cartItems.CartItems[i].ItemsByUser.Items.length; n++){
        deliveryOptionsSelectedInCartCount.current += 1
      }
    }
    setIsCheckoutActive(true)
  }

  const handlePreparePaymentData = (token, totalPrice) => {
    if(Object.keys(checkedOutItems).length === 0){
      setAreAllDeliveryOptionsSelected(false)
    }
    else if(deliveryOptionsSelectedInCartCount.current !== Object.keys(checkedOutItems).length){
      setAreAllDeliveryOptionsSelected(false)
    }
    else{
      axios({
        method: 'post',
        url: 'http://localhost:5000/api/transaction',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          totalPrice: totalPrice,
          checkedOutItems: checkedOutItems,
          cartItems: cartItems
        }
      }).then(res => {
        transactionToken.current = res.data.transactionToken
        setIsMidtransClientActive(true)
      }).then(() => {
        window.snap.pay(transactionToken.current)
      })
    }  
  }

  const handleDeleteItemInCart = (itemId) => {
    axios({
      method: 'put',
      url: `http://localhost:5000/api/cart/${itemId}`,
      headers: {
        'Authorization': auth_token,
        'Content-Type': 'application/json'
      } 
    }).then(res => {
      window.location.reload()
    })
  }

  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:5000/api/cart/${auth_token}`,
      headers: {
        'Authorization':auth_token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if(res.status === 200){
        if(res.data.statusText === 'CART_NOT_EMPTY'){
          setCartItems(res.data.dataResponse)
          setIsCartEmpty(false)
        }
        if(res.data.statusText === 'CART_EMPTY'){
          setIsCartEmpty(true)
        }
      }
    }).then(() => {
      setIsCartLoading(false)
    }).catch(err => {
      if(err.response.status === 401){
        document.location.href = '/login'
      }
    })
  }, []);

  //side-effect for calculating total delivery price. Depends on deliveryOptions state change
  useEffect(() => {
    if(Object.keys(checkedOutItems).length > 0){
      console.log(`cartItems Length ${deliveryOptionsSelectedInCartCount.current}`)
      console.log(`deliveryOptions Length ${Object.keys(checkedOutItems).length}`)
      let total = 0

      for (const [key, value] of Object.entries(checkedOutItems)) {
        total += value[1]
      }

      setDeliveryTotalPrice(total)

      if(deliveryOptionsSelectedInCartCount.current === Object.keys(checkedOutItems).length){
        console.log('EQUAL')
        setAreAllDeliveryOptionsSelected(true)
      }
    }
  }, [checkedOutItems])

  //side-effect for calculating total of the total of the total of the total price >:(
  //depends on deliveryTotalPrice state change
  useEffect(() => {
    const total =  parseInt(localStorage.getItem('cartTotalPrice')) + deliveryTotalPrice
    setTotalPrice(total)
  },[deliveryTotalPrice, isCheckoutActive])

  //side effect to inject midtrans snap.js to DOM
  useEffect(() => {
    console.log('USEEFFECT FOR MIDTRANS SNAP FIRED')
    console.log('==============================================================================')
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


  if(isCartLoading){
    return(
      <CustomCircularLoading />
    )
  }
  return (
    <Container>
      {
        isCartEmpty ?
          <EmptyCart />
        :
        <>
          <div className="mb-5">
            <h3 className="primary-font-color">
              {isCheckoutActive ? <span>Checkout</span> : <span>Keranjang Pinjaman</span>}
            </h3>
          </div>
          <Row>
            <Col sm={8} className="me-2">
                {
                  cartItems.CartItems.map((cartItem, index) => (
                    <Row key={uuidv4()} className="cart-user-item-wrapper border shadow-sm">
                      <div className="mb-3">
                        <h5 className="primary-font-color">{cartItem.ItemsByUser.CreatedBy.userFullName}</h5>
                        <h6 className="primary-font-color" style={{fontSize: '0.9rem'}}>{cartItem.ItemsByUser.CreatedBy.userAddress}n</h6>
                      </div>
                      {
                        cartItem.ItemsByUser.Items.map((item, index) => (
                          <Row key={uuidv4()} className="mb-3 border-bottom pb-3">
                            <Row>
                              <Col>
                                  <Image 
                                    src={item.ItemDetail.MainItemPictureLocalPath}
                                    thumbnail={true}
                                    height={100}
                                    width={100}
                                  />
                              </Col>
                              <Col>
                                <div className="primary-font-color"><strong>{item.ItemDetail.ItemName}</strong></div>
                                <div className="primary-font-color">{UTC_DateStringToLocale(item.ItemBorrowDate[0])} - {UTC_DateStringToLocale(item.ItemBorrowDate[1])}</div>
                              </Col>
                              <Col>
                                <div className="primary-font-color">Rp.{calculateTotalPricePerItem(item)}</div>
                              </Col>
                              <Col className="d-flex justify-content-end align-items-start">
                                <Button disabled={isCheckoutActive ? true : false} variant="outlined" color="error" onClick={() => handleDeleteItemInCart(item.ItemDetail._id)}>
                                  <FaTrash />
                                </Button>
                              </Col>
                            </Row>
                            <Row>
                            {
                              isCheckoutActive &&
                              <div className="mt-5" style={{width: '30%'}}>
                                <FormControl fullWidth variant='standard'>
                                  <InputLabel id="demo-simple-select-label">Metode pengiriman</InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={getSelectValue(item.ItemDetail)}
                                    defaultValue=""
                                    label="Age"
                                    onChange={(e) => handleCheckoutItem(e, item.ItemDetail)}
                                    name = {item.ItemDetail.ItemName}
                                  >
                                    {
                                      item.ItemDetail.ItemDeliveryOptions.map(deliveryOption => (
                                        <MenuItem 
                                          key={uuidv4()} 
                                          value={deliveryOption.Value}
                                        >
                                          {deliveryOption.Label}
                                        </MenuItem>
                                      ))
                                    }
                                  </Select>
                                </FormControl> 
                              </div>
                            }
                            </Row>
                          </Row>
                        ))
                      }
                    </Row>
                  ))
                }
            </Col>
            <Col className="ms-2">
              <Row 
                className="border cart-user-item-wrapper shadow-sm"
              >
                <div className="mb-5">
                  <h5 className="primary-font-color mb-3"> <strong>Ringkasan Pinjaman</strong></h5>
                  <h6>Total Harga : <span className="secondary-font-color">Rp. {displayCartTotalPrice(cartTotalPrice)}</span></h6>
                  {isCheckoutActive &&  <h6>Total Ongkos Kirim : <span className="secondary-font-color">Rp. {displayDeliveryTotalPrice(deliveryTotalPrice)}</span></h6>}
                  {isCheckoutActive && 
                    <div className="pt-4 border-top">
                      <h5>
                        Total Tagihan : <span className="secondary-font-color">Rp. {displayTotalPrice(totalPrice)}</span>
                      </h5>
                    </div>
                  }
                  {!isCheckoutActive && <span style={{fontSize:'0.8rem'}}><i>Harga belum termasuk ongkos kirim</i></span>}
                  {!areAllDeliveryOptionsSelected && <span style={{fontSize:'0.8rem'}} className="secondary-font-color"><i>Metode pengiriman masih ada yang kosong!</i></span>}
                </div>
                {
                  isCheckoutActive ?
                  <div style={{width: '100%'}}>
                    <BootstrapButton className="secondary-button full-width" onClick={() => handlePreparePaymentData(localStorage.getItem('token'), totalPrice)}>
                      Bayar
                    </BootstrapButton> 
                    <BootstrapButton className="secondary-button-outlined full-width mt-2" onClick={() => setIsCheckoutActive(false)}>
                      Kembali ke keranjang
                    </BootstrapButton>
                  </div>
                  :
                  <div style={{width: '100%'}}>
                    <BootstrapButton className="secondary-button full-width" onClick={() => handleCheckOut()}>
                      Checkout
                    </BootstrapButton>
                  </div> 
                }                      
              </Row>
            </Col>
          </Row>
        </>
      }
    </Container>
  )
}

export default Cart