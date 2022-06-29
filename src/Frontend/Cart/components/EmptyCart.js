import React from 'react'
import {Button as BootstrapButton, Image} from 'react-bootstrap';
import { Link } from 'react-router-dom'

const EmptyCart = () => {
  return (
    <div 
        style={{
        width: '500px',
        height: '500px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        }}
    >
        <Image 
            src='/vector_assets/Cart-vector-licensed-[Converted].png' 
            fluid={true}
            alt="cart-empty-img"
        />

        <h2 className="text-center primary-font-color">Keranjang pinjaman kamu masih kosong, nih!</h2>
        <div className="text-center">
            <Link to="/home/category" onClick={() => localStorage.removeItem('searchParams')}>
                <BootstrapButton className="tertiary-button ps-5 pe-5 pt-2 pb-2">
                <h4 className="text-center" style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    margin: '0px',
                }}
                >
                    Mulai pinjam barang
                </h4>
                </BootstrapButton>
            </Link>
        </div>
    </div>
  )
}

export default EmptyCart