import { React, useState, useEffect } from 'react'
import axios from 'axios'
//import CircularProgress from '@mui/material/CircularProgress'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
//import CategoryCard from '../components/CategoryCard'
import CustomCardLinkGroup from '../../shared/CustomCardLinkGroup/CustomCardLinkGroup'
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'
import ItemCategoryCard from '../../shared/ItemCategoryCard/ItemCategoryCard'
import ItemCard from '../../shared/ItemCard/ItemCard'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from  'react-bootstrap/Row'
import '../AuthHome.css'

const AuthHome = () => {
  console.log('inside auth home page')
  const [dataResponses, setDataResponses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  let location = useLocation()
  let [searchParams, setSearchParams] = useSearchParams()
  // console.log(location)

  useEffect(()=>{
    const url = 'http://localhost:5000/api/items/home'
    axios.get(url)
    .then(res => {
      console.log(res.data.dataResponse)
      setDataResponses(res.data.dataResponse)
    }).then(() => {
      setIsLoading(false)
    })
  }, [])

  const handleLinkToCategoryClick = (categoryId) => {
    localStorage.setItem('searchParams', JSON.stringify({ItemCategory: categoryId}))
  }
    return (
      <div className="pb-5">
        <div classname="position-relative">
          <p className="primary-font-color" style={{textAlign:'left', marginBottom:'60px', marginLeft:'10px', fontSize:'1.5rem'}}><strong>Kategori</strong></p>
          {isLoading === true && 
            <CustomCircularLoading />
          }
          {isLoading === false && 
            <Col style={{
              backgroundColor:'#F2F2F2',
              paddingLeft: '2rem',
              paddingRight:'2rem',
              paddingBottom: '3rem',
              borderRadius: '20px 20px 20px 20px'
            }}
            className="shadow"
            sm="12" md="12" lg="12" xl="12" xxl="12"
            >
              <Row xs="2" sm="3" md='4' lg='5' xl='6' xxl='6' className="g-5">
                {
                  dataResponses.itemCategories.map(itemCategory => (
                    <Link 
                      key={itemCategory._id} 
                      style={{textDecoration: 'none', color:'inherit'}} 
                      to={`/home/category?ItemCategory=${itemCategory._id}`}
                      onClick={() => handleLinkToCategoryClick(itemCategory._id)}
                    >
                      <ItemCategoryCard 
                        CategoryPictureLocalPath={itemCategory.PicturePath} 
                        CategoryName = {itemCategory.Value}
                      />
                    </Link>
                  ))
                } 
              </Row>
                <div className="d-flex justify-content-center mt-5">
                  <Link to="/home/category" onClick={() => localStorage.removeItem('searchParams')}>
                    <Button className="primary-button ps-5 pe-5 ">
                      Lihat semua kategori
                    </Button>
                  </Link>
                </div>
            </Col>
          }
        </div>
        
        <div className="position-relative" style={{marginTop: '100px'}}>
          <p className="primary-font-color" style={{textAlign:'left', marginBottom:'60px', marginLeft:'10px', fontSize:'1.5rem'}}>
            <strong>Mungkin kamu tertarik</strong>
          </p>
          {isLoading === true && 
            <CustomCircularLoading />
          }
          {
            isLoading === false &&
            <Col 
              style={{
                backgroundColor:'#3FCBB1',
                paddingLeft: '2rem',
                paddingRight:'2rem',
                paddingBottom: '3rem',
                borderRadius: '20px 20px 20px 20px'
              }}
              className="shadow"
              sm="12" md="12" lg="12" xl="12" xxl="12"
            >
              <Row xs="2" sm="3" md='4' lg='5' xl='6' xxl='6' className="g-5">
                {
                  dataResponses.randomItems.map(item => (
                    <Link key={item._id} to={localStorage.getItem('token') ? `/home/item/${item._id}` : `/item/${item._id}`}>
                      <ItemCard 
                          MainItemPictureLocalPath={item.MainItemPictureLocalPath} 
                          ItemName={item.ItemName} 
                          ItemPriceDailyMinimum={item.ItemPriceDailyMinimum}
                          ItemRatings={item.ItemRatings}
                      />
                    </Link >
                  ))
                } 
              </Row>
            </Col>
          }
        </div>

        <div className="position-relative" style={{marginTop: '100px'}}>
          <p className="primary-font-color" style={{textAlign:'left', marginBottom:'60px', marginLeft:'10px', fontSize:'1.5rem'}}>
            <strong>Paling banyak dilihat</strong>
          </p>
          {isLoading === true && 
            <CustomCircularLoading />
          }
          {
            isLoading === false &&
            <Col 
              style={{
                backgroundColor:'rgb(255, 219, 219)',
                paddingLeft: '2rem',
                paddingRight:'2rem',
                paddingBottom: '3rem',
                borderRadius: '20px 20px 20px 20px'
              }}
              className="shadow"
              sm="12" md="12" lg="12" xl="12" xxl="12"
            >
              <Row xs="2" sm="3" md='4' lg='5' xl='6' xxl='6' className="g-5">
                {
                  dataResponses.mostViewed.map(item => (
                    <Link key={item._id} to={localStorage.getItem('token') ? `/home/item/${item._id}` : `/item/${item._id}`}>
                      <ItemCard 
                          MainItemPictureLocalPath={item.MainItemPictureLocalPath} 
                          ItemName={item.ItemName} 
                          ItemPriceDailyMinimum={item.ItemPriceDailyMinimum}
                          ItemRatings={item.ItemRatings}
                      />
                    </Link >
                  ))
                } 
              </Row>
            </Col>
          }
        </div>
      </div>
    )
}
  


export default AuthHome