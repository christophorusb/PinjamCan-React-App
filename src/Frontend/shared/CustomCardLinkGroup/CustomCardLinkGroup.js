import {React, useRef} from 'react'
import { Link } from 'react-router-dom'
import CustomCardLink from '../CustomCardLink/CustomCardLink'

const CustomCardLinkGroup = (props) => {
  //called by authHome.js
  const idRef = useRef(null)

  const setUrl = (id) => {
    idRef.current = id
    let url = `/home/category/${idRef.current}`

    return url
  }
  console.log(props)
  return (
    <div className="row row-cols-2 row-cols-lg-6 g-2 g-lg-4">
        {props.cardData.dataResponse.map(response => (
            <CustomCardLink key = {response._id} thisCardData = {response} urlTo={setUrl(response._id)} />
          ))
        }
    </div>
  )
}

export default CustomCardLinkGroup