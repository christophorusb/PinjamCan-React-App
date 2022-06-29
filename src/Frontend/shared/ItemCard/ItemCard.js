import React from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Skeleton from '@mui/material/Skeleton';
import '../../../customGeneralStyle.css'
import { AiFillStar } from 'react-icons/ai'

const ItemCard = (props) => {

    console.log(props)
    
    const getAverageItemRating = (ratings) => {
        console.log(ratings)
        let sum = 0
        let avg
        for(let i=0; i<ratings.length; i++){
            sum += ratings[i]
        }
        avg = sum / ratings.length
        avg = avg.toString()
        return avg
    }
  return (
    <Col>
        <Card className="item-card shadow">
            <Card.Img className="card-img" variant="top" src={props.MainItemPictureLocalPath} />
            <Card.Body style={{color: 'black'}}>
                <Card.Title className="primary-font-color"
                    style={{fontSize:'0.9rem', 
                            fontWeight:'600',
                            textOverflow:'ellipsis',
                            overflow:'hidden',
                            whiteSpace:'nowrap'}}
                >
                    {props.ItemName}
                </Card.Title>
                <Card.Text>
                    <span>
                        <i style={{fontSize: '0.7rem'}}>Mulai dari</i>
                        <br />
                        Rp {new Intl.NumberFormat('id-ID').format(props.ItemPriceDailyMinimum)} /hari
                    </span>
                </Card.Text>
                <Card.Text>
                    {props.ItemRatings.length > 0 ? 
                        <div>
                            <AiFillStar style={{color:'gold', fontSize:'1.2rem', filter: 'drop-shadow(0px 0px 20px rgb(#0000 / 0.6))'}}/>
                            <span> 
                                <span style={{fontSize: '0.8rem'}}>{getAverageItemRating(props.ItemRatings)}</span>
                                <span style={{fontSize: '0.7rem'}} className="text-muted">({props.ItemRatings.length})</span> 
                            </span>
                            
                        </div>
                        
                        :
                        <span style={{fontSize:'0.8rem'}}><i>Belum ada rating</i></span>  
                        
                    }
                </Card.Text>
            </Card.Body>
        </Card>
    </Col>
  )
}

export default ItemCard