import { React, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link as RouterLink, useLocation, useSearchParams } from 'react-router-dom'
import HeadingBreadcrumbs from '../components/HeadingBreadcrumbs';
import Link from '@mui/material/Link';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilterBar from '../../shared/FilterBar/FilterBar'
import ItemCard from '../../shared/ItemCard/ItemCard';
import Skeleton from '@mui/material/Skeleton';
import { v4 as uuidv4 } from 'uuid';
import ItemsDisplayed from '../../shared/ItemsDisplayed/ItemsDisplayed'
import axios from 'axios'
import '../../../customGeneralStyle.css'

const ItemsByCategory = () => {
    //get curret URL and use it as side-effect dependency where everytime the location changes because of filter's state changes,
    //the side effect runs again and fetches the API with the URL query parameters
    let location = useLocation(); 
    let [queryParams] = useSearchParams();
    const breadCrumbKey = useRef(0)
    const itemsByCategoryResponseStatus = useRef('')
    const itemCategoryId = (queryParams.get('ItemCategory') === null) ? '' : queryParams.get('ItemCategory') //returns an object containing categoryId
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const [itemsByCategoryResponse, setItemsByCategoryResponse] = useState([])
    const [thisItemsCategory, setThisItemsCategory] = useState('')
    const [itemsByCategoryLoading, setItemsByCategoryLoading] = useState(true)
    let itemsByCategory_api_URL = `http://localhost:5000/api/items/filter`

    //console.log(itemsByCategory_api_URL)
    //parse search params object from string into JSON object to be passed to param attribute in axios
     let searchParams = JSON.parse(localStorage.getItem('searchParams'))
     let updateSearchParams = {}
    //if there are no filters to be applied (parsed returns null), just set the searchParams to an empty object
     if(searchParams === null){
       searchParams = {}
     }
     else{
    
      //loop through the searchParams object and update the searchParams object with the new format
      //spread existing search params to updateSearchParams variable then update what's necessary within the loop
      //this format follows the mongoDB's query documentation
      updateSearchParams = {
        ...searchParams,
      }
      for (const [key, value] of Object.entries(searchParams)) {
        //ItemPriceDailyMinimum is an array
        if(key === 'ItemPriceDailyMinimum'){
          //db.student.find({ u1 : { $gt :  30, $lt : 60}});
          const gteIndex = value.findIndex(item => item.includes('$gte')) //returns the index if found, otherwise returns -1
          const lteIndex = value.findIndex(item => item.includes('$lte')) //returns the index if found, otherwise returns -1
          let minMaxPriceQueryObj = {}
          if(gteIndex !== -1){
            minMaxPriceQueryObj = {
              ...minMaxPriceQueryObj,
              $gte: parseInt(value[gteIndex].substring(4))
            }
            updateSearchParams = {
              ...updateSearchParams,
              [key]: {
                ...minMaxPriceQueryObj,
              }
            }
          }
          if(lteIndex !== -1){
            minMaxPriceQueryObj = {
              ...minMaxPriceQueryObj,
              $lte: parseInt(value[lteIndex].substring(4))
            }
            updateSearchParams = {
              ...updateSearchParams,
              [key]: {
                ...minMaxPriceQueryObj,
              }
            }
          }
        }
        //ItemRating is a number
        if(key === 'ItemRatingAverage'){
          updateSearchParams = {
            ...updateSearchParams,
            [key]: { $gt: parseInt(value) }
          }
        }
        //ItemDeliveryOptions is an array
        if(key === 'ItemDeliveryOptions'){
          updateSearchParams = {
            ...updateSearchParams,
            [key]: { $in: value }
          }
        }
      }
    }
  
    //=========================================================================================

    const incrementBreadCrumbKey = () => {
      breadCrumbKey.current = breadCrumbKey.current + 1
      return breadCrumbKey.current
    }

    //side effect for filtering the items
    //hits everytime filter options change
    useEffect(() => {
      setItemsByCategoryLoading(true)
      //console.log('side effect running due to location change or initial render')
      axios({
        method: 'get',
        url: itemsByCategory_api_URL,
        params: {
          queryParams: JSON.stringify(updateSearchParams)
        }
      }).then(res => {
          itemsByCategoryResponseStatus.current = res.data.status
          setItemsByCategoryResponse(res.data.dataResponse.itemsByCategory)
          setThisItemsCategory(res.data.itemCategory)
          setBreadcrumbs([
              <Link key={incrementBreadCrumbKey} underline="hover" color="inherit" href="/">
                  Home
              </Link>,
              <Link key={incrementBreadCrumbKey} underline="hover" color="inherit" href={`/home/category/${itemCategoryId}`}>
                  <strong>
                    {
                      itemCategoryId === '' ? 'Semua' : res.data.itemCategory
                    }
                  </strong>
              </Link>
          ])
        }).then(() => {
          setItemsByCategoryLoading(false)
        })
    }, [itemsByCategory_api_URL, location])

    return (
        <Container>
          {itemsByCategoryLoading? 
            (
              <div>
                <Skeleton variant="text" width={60}/>
                <Skeleton variant="text" width={100} />
              </div>
            )
            : 
            <HeadingBreadcrumbs breadcrumbs={breadcrumbs} headingTitle={thisItemsCategory} headingFor="ItemsByCategory"/>
          }
          <Row className="mt-5">
            <Col sm="4" md="4" lg="3" xl="2">
              <FilterBar />
            </Col>
            
            <Col sm="8" md="8" lg="9" xl="10">
              {itemsByCategoryLoading ?
                 <Row sm="2" md='2' lg='4' xl='4' xxl='5' className="g-4" >
                   {
                     Array.from(new Array(15)).map(skeletonCard => (
                       <div key={uuidv4()}>
                         <Skeleton variant="rectangular" height={250}/>
                       </div>
                     ))
                   }
                 </Row>
                 :
                <ItemsDisplayed 
                  itemsList={itemsByCategoryResponse} 
                  category={thisItemsCategory}
                  responseStatus={itemsByCategoryResponseStatus.current} 
                />
              } 
            </Col>
          </Row>
        </Container> 
    )
}

export default ItemsByCategory