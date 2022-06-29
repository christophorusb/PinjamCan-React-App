import {React, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'
import ItemCategoryCard from '../../shared/ItemCategoryCard/ItemCategoryCard'

import './ExploreCategory.css';

const ExploreCategory = () => {
    const [itemCategoriesResponse, setItemCategoriesResponse] = useState([])
    const [itemCategoriesLoading, setItemCategoriesLoading] = useState(true)

    useEffect(()=>{
        const itemCategoryURL = 'http://localhost:5000/api/items/item-categories'
        axios.get(itemCategoryURL)
        .then(res => {
            setItemCategoriesResponse(res.data)
            setItemCategoriesLoading(false)
        })
    }, [])

    const handleLinkToCategoryClick = (categoryId) => {
        localStorage.setItem('searchParams', JSON.stringify({ItemCategory: categoryId}))
    }

    if(itemCategoriesLoading){
        return(
            <CustomCircularLoading />
        )
    }
  return (
    <div className="category-wrapper">
        <p className="category-sub-title">Jelajahi kategori kami</p>
        <Row xs="2" sm="3" md='4' lg='5' xl='6' xxl='6' className="g-5">
             {
               itemCategoriesResponse.dataResponse.map(itemCategory => (
                <Link 
                  key={itemCategory._id} 
                  style={{textDecoration: 'none', color:'inherit'}} 
                  to={`/category?ItemCategory=${itemCategory._id}`}
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
    </div>
  )
}

export default ExploreCategory