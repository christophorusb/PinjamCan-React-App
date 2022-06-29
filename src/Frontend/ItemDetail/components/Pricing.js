import React from 'react'

const Pricing = (props) => {
  return (
    <div className="d-flex justify-content-between">
        <div className="p-3 shadow" style={{backgroundColor: '#FFFFFF', borderRadius: '10px 10px 10px 10px'}}>
            <p className="primary-font-color text-center" style={{fontSize: '0.8rem'}}><strong>Pinjam sehari</strong></p>
            <h5>Rp. {new Intl.NumberFormat('id-ID').format(props.ItemPriceDaily)} <span style={{fontSize: '0.9rem'}}>/hari</span></h5>
        </div>
        {
            props.ItemPriceWeeklyPerDay !== null &&
            <div className="p-3 shadow" style={{backgroundColor: '#FFFFFF', borderRadius: '10px 10px 10px 10px'}}>
                <p className="primary-font-color text-center" style={{fontSize: '0.8rem'}}><strong>Pinjam 7+ hari</strong></p>
                <h5>Rp. {new Intl.NumberFormat('id-ID').format(props.ItemPriceWeeklyPerDay)} <span style={{fontSize: '0.9rem'}}>/hari</span></h5>
            </div>
        }
        {
            props.ItemPriceMonthlyPerDay !== null &&
            <div className="p-3 shadow" style={{backgroundColor: '#FFFFFF', borderRadius: '10px 10px 10px 10px'}}>
                <p className="primary-font-color text-center" style={{fontSize: '0.8rem'}}><strong>Pinjam 30+ hari</strong></p>
                <h5>Rp. {new Intl.NumberFormat('id-ID').format(props.ItemPriceMonthlyPerDay)} <span style={{fontSize: '0.9rem'}}>/hari</span></h5>
            </div>
        }
    </div>
  )
}

export default Pricing