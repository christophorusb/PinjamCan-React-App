import React from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
// import Skeleton from '@mui/material/Skeleton';
import '../../../customGeneralStyle.css'
// import { AiFillStar } from 'react-icons/ai'

const ItemCategoryCard = (props) => {
    console.log('inside categorycard component')
  return (
    <Col>
        <Card className="item-card shadow">
            <Card.Img variant="top" src={props.CategoryPictureLocalPath}/>
            <Card.Body style={{color: 'black'}}>
                <Card.Title className="primary-font-color"
                    style={{fontSize:'0.9rem', 
                            fontWeight:'600',
                            textOverflow:'ellipsis',
                            overflow:'hidden',
                            whiteSpace:'nowrap'}}>
                    {props.CategoryName}
                </Card.Title>
            </Card.Body>
        </Card>
    </Col>
  )
}

export default ItemCategoryCard