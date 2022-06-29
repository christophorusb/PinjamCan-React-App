import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import Rating from '@mui/material/Rating';
import moment from 'moment/min/moment-with-locales'

const ReviewContent = (props) => {
  console.log(props)

  const getLocalizedDate = (date) => {
    const localized = moment(date).locale("id").format('LL')
    return localized
  }

  return (
    <div className="review-wrapper pt-4 pb-4">
        <div style={{borderBottom: '1px solid black'}}>
            <h5 className="primary-font-color"><strong>Ulasan</strong></h5> 
        </div>
        <div>
        {props.ItemReviews.length === 0 
            ? 
            <h6 className="pt-3 pb-3"><i>Belum ada ulasan</i></h6>
            : 
            props.ItemReviews.map(review => (
            <div key={uuidv4()} className="review-item mt-3 border-bottom">
              <Rating name="read-only" value={review.ItemStarsReceived} precision={0.5} readOnly />
                <p style={{marginBlockEnd: '0px'}}><strong>{review.ReviewedBy.userFullName}</strong></p>
                <p className="text-muted"><i>{getLocalizedDate(review.ItemReviewDate)}</i></p>
                <p>{review.ItemReview}</p>
            </div>
            ))  
        }
        </div>
    </div>
  )
}

export default ReviewContent