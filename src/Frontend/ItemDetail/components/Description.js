import React from 'react'
import { AiOutlineFieldTime } from 'react-icons/ai'
import { FaWeightHanging } from 'react-icons/fa'

const Description = (props) => {
  return (
    <div className="description-wrapper mt-4">
        <div style={{borderBottom: '1px solid black'}}>
            <h5 className="primary-font-color"><strong>Deskripsi</strong></h5>
        </div>
        <div className="pb-3 pt-4 d-flex">
            <div className="me-2"> 
                <h6 className="mb-1"><AiOutlineFieldTime className="primary-flat-font-color" /></h6>
                <h6 className="mb-1"><FaWeightHanging className="primary-flat-font-color" /></h6>
            </div>
            <div>
                <h6 className="primary-font-color">Durasi Pinjam Minimum : <span className="secondary-font-color">{props.ItemMinimumRentDuration} hari</span></h6>
                <h6 className="primary-font-color">Berat Barang : <span className="secondary-font-color">{props.ItemWeight} gram</span> </h6>
            </div>
        </div>
        <div className="pt-2 pb-4">
            <p>
                {props.ItemDescription}
            </p>
        </div>
    </div>
  )
}

export default Description