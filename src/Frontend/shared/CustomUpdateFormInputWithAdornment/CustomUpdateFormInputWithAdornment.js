import {React, useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import Form from 'react-bootstrap/Form'

const CustomUpdateFormInputWithAdornment = (props) => {
    const [labelFocus, setLabelFocus] = useState(false)
    const [price, setPrice] = useState(props.existingValue)
    const [priceDisplay, setPriceDisplay] = useState(props.existingValue)
    const [dailyPriceDisplay, setDailyPriceDisplay] = useState('0')
    const [adornmentFocus, setAdornmentFocus] = useState(false)
    const { register, formState: { errors } } = useFormContext()
    const inputName = props.inputName
    const inputValidation = props.inputValidation
    const labelCheckControl = ['Hari', 'Minggu', 'Bulan']; //can add more


    const handleFocus = () => {
      setLabelFocus(true)
      setAdornmentFocus(true)
    }
  
    const handleBlur = () => {
      setLabelFocus(false)
      setAdornmentFocus(false)
    }
  
    const renderInputUnit = () => {
      if(labelCheckControl.includes(props.inputLabel))
      {
        return <span>/{props.inputLabel}</span>  
      }    
    };

    const renderDaily = () => {
      if(props.inputLabel !== 'Hari'){
        if(props.inputLabel === 'Minggu'){
          return (
            <div>(Rp. {dailyPriceDisplay} /Hari)</div>
          )
        }
        else if(props.inputLabel === 'Bulan'){
          return (
            <div>(Rp. {dailyPriceDisplay} /Hari)</div>
          )
        }
        else{ 
          return null
        }
      }
    }
  
    const validationStructure = {
      ...inputValidation,
      onChange: (e) => setPrice(e.target.value),
      onBlur:() => handleBlur(),
    };
  
    //side effect to display price in price format
    useEffect(() => {
      //console.log(new Intl.NumberFormat('id-ID').format(price))
      setPriceDisplay(new Intl.NumberFormat('id-ID').format(price))
      if(labelCheckControl.includes(props.inputLabel))
      {
        console.log('label exist')
        if(props.inputLabel === 'Minggu'){
          const dailyPriceDisplay = Math.floor(parseInt(price) / 7)
          setDailyPriceDisplay(new Intl.NumberFormat('id-ID').format(dailyPriceDisplay))
        }

        if(props.inputLabel === 'Bulan'){
          const dailyPriceDisplay = Math.floor(parseInt(price) / 30)
          setDailyPriceDisplay(new Intl.NumberFormat('id-ID').format(dailyPriceDisplay))
        }
      }
    }, [price])

  
    if(props.secondaryType === 'price'){
      return (
        <Form.Group className="me-3"style={props.addStyle} controlId={props.inputId}>
          {labelFocus && <Form.Label className="secondary-font-color">{props.inputLabel}</Form.Label>}
          {!labelFocus && <Form.Label>{props.inputLabel}</Form.Label>}
          <div className="d-flex align-items-center justify-content-center">
              <div className={adornmentFocus? 'adornment-wrapper adornment-wrapper-focused' : 'adornment-wrapper'}>
                  <div><span>{props.adornmentLabel}</span></div>
              </div>
              {props.inputValidation? 
                <Form.Control type={props.inputType} 
                  defaultValue={props.existingValue}
                  className="form-input-with-adornment form-input-focus" 
                  name={inputName}
                  {...register(inputName, validationStructure)}
                  onFocus={handleFocus}     
                />
                :
                <Form.Control type={props.inputType} 
                  defaultValue={props.existingValue}
                  className="form-input-with-adornment form-input-focus" 
                  name={inputName}
                  {...register(inputName,{
                    onChange: (e) => setPrice(e.target.value)   
                  })}
                  onFocus={handleFocus} 
                  onBlur={handleBlur}  
                />
              }
              
          </div>
          {props.adornmentLabel === 'Rp.' &&
            <i style={{fontSize:'0.8rem', marginLeft:'10px'}}>
              {labelFocus? 
              <p className="secondary-font-color">
                 Rp. {priceDisplay} {renderInputUnit()} {renderDaily()}
              </p> 
              : 
              <p>Rp. {priceDisplay} {renderInputUnit()} {renderDaily()}</p>}
            </i>
          }
  
          <ErrorMessage 
            errors={errors} 
            name={inputName}
            render={({ message }) => <p style={{fontSize:'0.9rem', color:'red'}}>{message}</p>} 
          />
         
        </Form.Group>
      )
    }
    
    return (
      <Form.Group className="me-3"style={props.addStyle} controlId={props.inputId}>
          {labelFocus && <Form.Label className="secondary-font-color">{props.inputLabel}</Form.Label>}
          {!labelFocus && <Form.Label>{props.inputLabel}</Form.Label>}
          <div className="d-flex align-items-center justify-content-center">
              <div className={adornmentFocus? 'adornment-wrapper adornment-wrapper-focused' : 'adornment-wrapper'}>
                  <div><span>{props.adornmentLabel}</span></div>
              </div>
              <Form.Control type={props.inputType} 
                className="form-input-with-adornment form-input-focus" 
                {...register(inputName, validationStructure.inputValidation)}
                onFocus={() => setLabelFocus(true)} 
                onBlur={() => setLabelFocus(false)}  
              />
          </div>
          <ErrorMessage 
            errors={errors} 
            name={inputName}
            render={({ message }) => <p style={{fontSize:'0.9rem', color:'red'}}>{message}</p>} 
          />
  
      </Form.Group>
    )
}

export default CustomUpdateFormInputWithAdornment