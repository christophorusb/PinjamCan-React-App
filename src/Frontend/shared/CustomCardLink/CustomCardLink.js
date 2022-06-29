import React from 'react'
import { Link } from 'react-router-dom'
import '../../AuthHome/AuthHome.css'

const CustomCardLink = (props) => {
  //called by CustomCardLinkGroup.js
  return (
    <Link style={{textDecoration: 'none', color:'inherit'}} to={props.urlTo}>
         <div className="col category-wrap">
            <div className="bg-light border category-img-wrapper">
                <div className='category-img-holder'>IMAGE HOLDER</div>
                <div className="p-3">{props.thisCardData.Value}</div>
            </div>
        </div>
    </Link>
  )
}

export default CustomCardLink