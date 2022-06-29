import React from 'react'
import Form from 'react-bootstrap/Form'
import CustomFormInputWithAdornment from '../../shared/CustomFormInputWithAdornment/CustomFormInputWithAdornment'

const RentPriceAdornmentGroup = (props) => {
    const customStyle = {
        width: '80%',
    }
  return (
    <div className="mb-3">
        <Form.Label>Harga Peminjaman Barang per:</Form.Label>
        <div className="d-flex justify-content-between">
            <CustomFormInputWithAdornment
                inputId="product-rent-per-day"
                inputName="productRentPerDay"
                inputLabel="Hari"
                adornmentLabel="Rp."
                inputType="text"
                addStyle={customStyle}
                secondaryType="price"
                inputValidation={props.inputValidation}
            />
            <CustomFormInputWithAdornment
                inputId="product-rent-per-week"
                inputName="productRentPerWeek"
                inputLabel="Minggu"
                adornmentLabel="Rp."
                inputType="text"
                addStyle={customStyle}
                secondaryType="price"
            />
            <CustomFormInputWithAdornment
                inputId="product-rent-per-month"
                inputName="productRentPerMonth"
                inputLabel="Bulan"
                adornmentLabel="Rp."
                inputType="text"
                addStyle={customStyle}
                secondaryType="price"
            />
        </div>
    </div>
  )
}

export default RentPriceAdornmentGroup