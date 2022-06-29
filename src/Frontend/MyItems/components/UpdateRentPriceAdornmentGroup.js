import React from 'react'
import Form from 'react-bootstrap/Form'
import CustomUpdateFormInputWithAdornment from '../../shared/CustomUpdateFormInputWithAdornment/CustomUpdateFormInputWithAdornment'
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'

const UpdateRentPriceAdornmentGroup = (props) => {
    
    const customStyle = {
        width: '80%',
    }

    if(props.existingValues === 'NONE'){
        return <div></div>
    }
    else{
        return (
            <div className="mb-3">
                <Form.Label>Harga Peminjaman Barang per:</Form.Label>
                <div className="d-flex justify-content-between">
                    <CustomUpdateFormInputWithAdornment
                        inputId="product-rent-per-day"
                        inputName="productRentPerDay"
                        inputLabel="Hari"
                        adornmentLabel="Rp."
                        inputType="text"
                        addStyle={customStyle}
                        secondaryType="price"
                        inputValidation={props.inputValidation}
                        isDaily={true}
                        existingValue={props.existingValues.daily}
                    />
                    <CustomUpdateFormInputWithAdornment
                        inputId="product-rent-per-week"
                        inputName="productRentPerWeek"
                        inputLabel="Minggu"
                        adornmentLabel="Rp."
                        inputType="text"
                        addStyle={customStyle}
                        secondaryType="price"
                        isWeekly={true}
                        existingValue={props.existingValues.weekly}
                    />
                    <CustomUpdateFormInputWithAdornment
                        inputId="product-rent-per-month"
                        inputName="productRentPerMonth"
                        inputLabel="Bulan"
                        adornmentLabel="Rp."
                        inputType="text"
                        addStyle={customStyle}
                        secondaryType="price"
                        isMonthly={true}
                        existingValue={props.existingValues.monthly}
                    />
                </div>
            </div>
          )
    }
}

export default UpdateRentPriceAdornmentGroup