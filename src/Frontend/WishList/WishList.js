import { React, useEffect, useState, useRef } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomCircularLoading  from '../shared/CustomCircularLoading/CustomCircularLoading'
import ItemsDisplayed from '../shared/ItemsDisplayed/ItemsDisplayed'
import axios from 'axios'

const WishList = () => {
    const [wishList, setWishList] = useState([])
    const [isWishListFetched, setIsWishListFetched] = useState(false)
    const wishListStatus = useRef('')

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:5000/api/wishlist',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            if(res.status === 200){
                if(res.data.statusText === 'WISHLIST_FETCHED'){
                    console.log(res.data.dataResponse)
                    wishListStatus.current = 'WISHLIST_FETCHED'
                    setWishList(res.data.dataResponse)
                }
                if(res.data.statusText === 'WISHLIST_EMPTY'){
                    wishListStatus.current = 'WISHLIST_EMPTY'
                }
            }
        }).then(() => {
            setIsWishListFetched(true)
        })
    }, [])

    if(isWishListFetched === false){
        return <CustomCircularLoading />
    }
  return (
    <div>
        <Container>
            {wishList.length !== 0 &&
                <h3>Wish List</h3>
            }
            <Row className="mt-5">
                <Col sm="8" md="8" lg="10" xl="12">
                    <ItemsDisplayed 
                        itemsList={wishList.items} 
                        responseStatus={wishListStatus.current} 
                        isWishList={true}
                    />
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default WishList