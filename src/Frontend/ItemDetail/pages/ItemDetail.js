import axios from 'axios'
import {React, useEffect, useState, useRef} from 'react'
import {Modal, Button} from 'react-bootstrap';
import {Modal as AntDModal} from 'antd'
import { useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import Card from 'react-bootstrap/Card'
import HeadingBreadcrumbs from '../../ItemDetail/components/HeadingBreadcrumbs'
import ItemImages from '../../ItemDetail/components/ItemImages'
import AvailabilityModal from '../../ItemDetail/components/AvailabilityModal'
import Description from '../components/Description';
import ReviewContent from '../components/ReviewContent';
import ItemMainInfo from '../components/ItemMainInfo';
import Pricing from '../components/Pricing';
import ShippingOptions from '../components/ShippingOptions';
import { v4 as uuidv4 } from 'uuid';
import { style } from '@mui/system'
import { Link } from '@mui/material'
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'
import { AiOutlineFieldTime, AiFillStar } from 'react-icons/ai'
import { FaWeightHanging } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './ItemDetail.css'


const ItemDetail = () => {
    let navigate = useNavigate()
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const [item, setItem] = useState({})
    const [show, setShow] = useState(false);
    const [isItemLoading, setIsItemLoading] = useState(true)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const itemId = useParams()
    let item_api_URL = `http://localhost:5000/api/items/${itemId.itemId}`
    let itemURL = `/item/${itemId.itemId}`

    const handleAddToWishList = () => {
        axios({
            method: 'POST',
            url: `http://localhost:5000/api/wishlist/${itemId.itemId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
          if(res.data.statusText === 'ITEM_EXIST_IN_WISHLIST'){
            AntDModal.warning({
              title: 'Barang ini sudah ada di wishlist kamu!',
            })
          }
          if(res.data.statusText === 'ITEM_ADDED_TO_WISHLIST'){
            AntDModal.success({
              content: 'Barang sudah ditambah ke wishlist!',
            });
          }
        }).catch(err => {
          console.log(err.response)
          if(err.response.status === 401){
            navigate('/login', {replace: true})
          }
        })
    }

    useEffect(()=>{
        axios.get(item_api_URL)
        .then(res => {
            setItem(res.data.dataResponse)
            setBreadcrumbs([
              <Link key={uuidv4()} underline="hover" color="inherit" href="/">
                Home
              </Link>,
              <Link key={uuidv4()} underline="hover" color="inherit" href={`/home/category?ItemCategory=${item.ItemCategory._id}`}>
                <strong>{res.data.dataResponse.ItemCategory.Value}</strong>
              </Link>,
              <Link key={uuidv4()} underline="hover" color="inherit" href={itemURL}>
                <strong>{item.ItemName}</strong>
              </Link>
            ])
        }).then(() => {
            setIsItemLoading(false)
        })
    },[item.ItemName])

    console.log(item)
   
  if(isItemLoading){
    return(
      <Container>
        <CustomCircularLoading />
      </Container>  
    )
  }
  return (
    //if(item=exist)
    <Container>
      <HeadingBreadcrumbs breadcrumbs={breadcrumbs} headingTitle={'Detail Barang'}/>
      <Row className="mt-4">
        <Col sm={6}>
          <ItemImages detail={item}/>
            <Description 
              ItemDescription={item.ItemDescription} 
              ItemMinimumRentDuration = {item.ItemMinimumRentDuration}
              ItemWeight = {item.ItemWeight}
            />

            <ReviewContent 
              ItemReviews = {item.ItemReviews}
            />
        </Col>

        <Col sm={6}>
          <div className="item-detail-rhs">
            <div>
              <ItemMainInfo 
                ItemName = {item.ItemName}
                ItemCreatedBy = {item.ItemCreatedBy.user}
                ItemRatings = {item.ItemRatings}
                ItemReviewCount = {item.ItemReviews.length}
                userDetail = {item.userDetail}
              />

              <div style={{backgroundColor: '#FFDBDB', borderRadius: '15px 15px 15px 15px'}} className="p-4 mt-4 shadow">
                <h6 className="text-center pt-2 pb-4 primary-font-color"><strong>Harga Peminjaman</strong></h6>
                <Pricing
                  ItemPriceDaily = {item.ItemPriceDaily}
                  ItemPriceWeeklyPerDay = {item.ItemPriceWeeklyPerDay}
                  ItemPriceMonthlyPerDay = {item.ItemPriceMonthlyPerDay}
                />
                <div className="d-flex justify-content-between mt-5">
                  <Button onClick={handleShow} className="primary-button me-2" style={{width: '50%'}}>
                    Cek ketersediaan barang
                  </Button>
                  <Button  onClick={() => handleAddToWishList()} className="secondary-button ms-2" style={{width: '50%'}}>
                    Tambah ke wishlist
                  </Button>
                </div>
              </div>
            </div>
            
            <ShippingOptions 
              ItemDeliveryOptions = {item.ItemDeliveryOptions}
            />

          </div>
        </Col>
      </Row>
        
      {/* MODAL BELOW */}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title><h5>Cek Ketersediaan Barang</h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AvailabilityModal 
            ItemMinimumRentDuration = {item.ItemMinimumRentDuration}
            ItemBorrowDates = {item.ItemBorrowDates}
            ItemId = {item._id}
          />
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default ItemDetail