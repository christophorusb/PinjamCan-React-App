import React from 'react'
import { AiFillStar } from 'react-icons/ai'

const ItemMainInfo = (props) => {
    const getAverageItemRating = (ratings) => {
        if(ratings.length !== 0){
            let sum = 0
            let avg
            for(let i=0; i<ratings.length; i++){
                sum += ratings[i]
            }
            avg = sum / ratings.length
            avg = avg.toString()

            return avg
        }
        return 0
    }

    const getChatLink = (userPhoneNumber) => {
        let split = userPhoneNumber.split('+')[1]
        const link = `https://wa.me/${split}?text=PinjamCan%20-%20Halo%20saya%20ingin%20bertanya%20tentang%20barang%20anda%20${props.ItemName}`

        return link
    }

    console.log(props)
  return (
    <div style={{borderBottom: '1px solid black'}}>
        <h2 className="primary-font-color">{props.ItemName}</h2>
        <div className="d-flex justify-content-between">
            <div>
                <p className="primary-font-color" style={{fontSize: '1.2rem'}}>
                    Dari <span className="secondary-font-color"><strong>{props.ItemCreatedBy}</strong></span>
                    <br /> 
                    <span style={{fontSize:'1rem'}}>di {props.userDetail.userAddress}</span>
                </p>
                <p>
                    <a href={getChatLink(props.userDetail.userPhoneNumber)} target="_blank" className="text-decoration-underline primary-font-color">
                        <strong>Chat dengan owner via WhatsApp</strong>
                    </a>
                </p>
            </div>
            <div className="item-rating d-flex">
                <div>
                    <span style={{fontSize: '1rem'}}>{getAverageItemRating(props.ItemRatings)}</span>
                </div>
                <div>
                    <AiFillStar style={{ color: '#FDCC0D', fontSize:'1.2rem'}}/>
                </div>
                <div>
                    <span style={{fontSize: '0.7rem'}}>({props.ItemReviewCount})</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ItemMainInfo