import { React, useState, useEffect, useRef } from 'react'
import { useLocation, useSearchParams, Link as RouterLink, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import axios from 'axios'
import FilterBarForSearchedItems from '../../shared/FilterBar/FilterBarForSearchedItems'
import HeadingBreadcrumbs from '../../ItemsByCategory/components/HeadingBreadcrumbs'
import Link from '@mui/material/Link';
import { v4 as uuidv4 } from 'uuid';
import ItemsDisplayed from '../../shared/ItemsDisplayed/ItemsDisplayed'
import Skeleton from '@mui/material/Skeleton';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const SearchedItems = () => {
    console.log('inside search items page')
    console.log(JSON.parse(localStorage.getItem('searchParams_searchedItems')))
    let location = useLocation()
    let [searchParams, setSearchParams] = useSearchParams()
    const [itemsByKeyword, setItemsByKeyword] = useState([]);
    const [isItemsByKewordExist, setIsItemsByKeywordExist] = useState(true)
    const [itemsByKeywordLoading, setItemsByKeywordLoading] = useState(true)
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const [responseStatus, setResponseStatus] = useState('')

    let { searchKeyword } = useParams()
    let updatedSearchParams = {}

    let searchParamsInLocalStorage = JSON.parse(localStorage.getItem('searchParams_searchedItems')) 

    if(searchParamsInLocalStorage === null){
        searchParamsInLocalStorage = {}
    }
    else{
        //loop through the searchParams object and update the searchParams object with the new format
        //spread existing search params to updateSearchParams variable then update what's necessary within the loop
        //this format follows the mongoDB's query documentation
        updatedSearchParams = {
            ...searchParamsInLocalStorage,
        }
        for (const [key, value] of Object.entries(searchParamsInLocalStorage)) {
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
                updatedSearchParams = {
                    ...updatedSearchParams,
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
                updatedSearchParams = {
                    ...updatedSearchParams,
                    [key]: {
                    ...minMaxPriceQueryObj,
                    }
                }
                }
            }
            //ItemRating is a number
            if(key === 'ItemRating'){
                updatedSearchParams = {
                ...updatedSearchParams,
                [key]: { $gt: parseInt(value) }
                }
            }
            //ItemDeliveryOptions is an array
            if(key === 'ItemDeliveryOptions'){
                updatedSearchParams = {
                ...updatedSearchParams,
                [key]: { $in: value }
                }
            }
        }
    }


    //==========================================================================================
    
  
    //side effect for fetching searched items along with filter
    //hits everytime filter search params options change
    useEffect(() => {
        console.log('inside useEffect for searched items')
        const URL = `http://localhost:5000/api/items/search/filter/${searchKeyword}`
        setItemsByKeywordLoading(true)
        axios({
            method: 'get',
            url: URL,
            params:{
                queryParams: JSON.stringify(updatedSearchParams)
            }
        }).then(res => {
          if(res.status === 200){
            setBreadcrumbs([
              <Link key={uuidv4()} underline="hover" color="inherit" href="/">
                  Home
              </Link>,
              <Link key={uuidv4()} underline="hover" color="inherit" href={`/home/search/${searchKeyword}`}>
                  <strong>
                    {searchKeyword.replaceAll('-', ' ')}
                  </strong>
              </Link>
            ])
            if(res.data.statusText === 'SUCCESS_NO_ITEM'){
              setIsItemsByKeywordExist(false)
              setResponseStatus(res.data.statusText)
            }
            if(res.data.statusText === 'SUCCESS'){
              setItemsByKeyword(res.data.dataResponse.searchedItemsByKeyword)
              setIsItemsByKeywordExist(true)
              setResponseStatus(res.data.statusText)
            }
          }
        }).then(() => {
            setItemsByKeywordLoading(false)
        }).catch(err => {
            console.log(err)
        })
    },[location])

  return (
    <Container>
          {itemsByKeywordLoading? 
            (
              <div>
                <Skeleton variant="text" width={60}/>
                <Skeleton variant="text" width={100} />
              </div>
            )
            : 
            <HeadingBreadcrumbs breadcrumbs={breadcrumbs} headingTitle={searchKeyword} headingFor="SearchedItems" />
          }
          <Row className="mt-5">
            <Col sm="4" md="4" lg="3" xl="2">
              <FilterBarForSearchedItems />
            </Col>
            <Col sm="8" md="8" lg="9" xl="10">
              {itemsByKeywordLoading?
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
                  itemsList={itemsByKeyword} 
                  responseStatus={responseStatus} 
                />
              } 
            </Col>
          </Row>
        </Container> 
  )
}

export default SearchedItems