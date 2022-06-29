import {React, useState} from 'react'
import { useFormContext } from 'react-hook-form'
import { ErrorMessage }from '@hookform/error-message'
import Form from 'react-bootstrap/Form'
import Skeleton from '@mui/material/Skeleton';

const CustomUpdateFormInput = (props) => {
  const [labelFocus, setLabelFocus] = useState(false)
  const { register, formState: { errors } } = useFormContext()
  const inputName = props.inputName
  const inputValidation = props.inputValidation

  const validationStructure = {
    inputValidation
  }
  
  // console.log('CUSTOM FORM INPUT PROPS ' + props.inputName)
  //  console.log(errors)
  //  console.log(validationStructure.inputValidation)
  //{...register(props.inputName, validationStructure)}
  if(props.existingValue === 'NONE'){
    return (
      <div className="mb-3">
        <Skeleton variant="rectangular" width={1366} height={60} />
      </div>
    )
  }
  else{
    if(props.inputAs === 'textarea'){
      return(
          <Form.Group className="mb-4" controlId={props.inputId}>
              {labelFocus && <Form.Label className="secondary-font-color">{props.inputLabel}</Form.Label>}
              {!labelFocus && <Form.Label>{props.inputLabel}</Form.Label>}
              <Form.Control 
                defaultValue={ props.existingValue !== "NONE" ? props.existingValue : ''} 
                {...register(inputName, validationStructure.inputValidation)} 
                as="textarea" 
                name={props.inputName}  
                style={{height:'200px'}}
                rows={4} 
                className="form-input-focus" 
                onFocus={() => setLabelFocus(true)} 
                onBlur={() => setLabelFocus(false)} 
              />
              {/* <ErrorMessage errors={errors} name={inputName} as="span" className="form-error-message" /> */}
              <ErrorMessage 
                errors={errors} 
                name={inputName}
                render={({ message }) => <p style={{fontSize:'0.9rem', color:'red'}}>{message}</p>} 
              />
          </Form.Group> 
      )   
    }
  
    return (
      <Form.Group className='mb-4' controlId={props.inputId}>
          {labelFocus && <Form.Label className="secondary-font-color">{props.inputLabel}</Form.Label>}
          {!labelFocus && <Form.Label>{props.inputLabel}</Form.Label>}
          <Form.Control 
            defaultValue={ props.existingValue !== "NONE" ? props.existingValue : ''}
            {...register(inputName, validationStructure.inputValidation)} 
            type={props.inputType} 
            name={props.inputName}  
            className="form-input-focus" 
            onFocus={() => setLabelFocus(true)} 
            onBlur={() => setLabelFocus(false)}
            >
          </Form.Control>
          <ErrorMessage 
            errors={errors} 
            name={inputName}
            render={({ message }) => <p style={{fontSize:'0.9rem', color:'red'}}>{message}</p>} 
          />
      </Form.Group>
    )
  }
}

export default CustomUpdateFormInput