import React from 'react'
import {v4 as uuidv4} from 'uuid'
import Avatar from '@mui/material/Avatar';

const ShippingOptions = (props) => {
    const getFirstLetters = (string) => {
        const firstLetters = string
        .split(' ')
        .map(word => word[0])
        .join('');

        return firstLetters;
    }
  return (
    <div className="shadow shipping-options-wrapper mt-4 p-4" style={{backgroundColor: '#FFDBDB', borderRadius: '15px 15px 15px 15px'}} >
        <h6 className="text-center pt-2 pb-4 primary-font-color"><strong>Pilihan Pengiriman</strong></h6>
        <div className="shipping-options d-flex flex-wrap ">
            {
                props.ItemDeliveryOptions.map(deliveryOption => (
                <div 
                    style={{backgroundColor: '#FFFFFF', borderRadius: '10px 10px 10px 10px'}} 
                    className="shadow d-flex justify-content-center align-items-center pe-3 ps-3 pt-2 pb-2 m-2 ms-0"
                    key={uuidv4()}
                >
                    <div>
                    <Avatar 
                        style={{backgroundColor: deliveryOption.ColorHex, color: 'white'}}
                    >
                        {getFirstLetters(deliveryOption.Label)}
                    </Avatar>
                    </div>

                    <div className="ms-2">
                        <span style={{fontSize: '1.0rem'}} className="primary-font-color">
                        <strong>{deliveryOption.Label}</strong>
                        </span>
                    </div>   
                </div>
                ))
            }
        </div>
    </div>
  )
}

export default ShippingOptions