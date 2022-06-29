import React from 'react'
import Image from 'react-bootstrap/Image'

const NoItemsDisplayed = () => {
  return (
    <div 
        style={{
        width: '500px',
        height: '500px',
        position: 'absolute',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
    }}
>
        <Image 
            src='/vector_assets/confused-man-licensed-[Converted].png' 
            fluid={true}
            alt="cart-empty-img"
        />

      
        <h3 style={{fontWeight: 500, textAlign: 'center', fontSize:'2rem', marginBlockEnd:0}}>Ups, barang yang kamu cari belum ada :(</h3>

    </div>
  )
}

export default NoItemsDisplayed