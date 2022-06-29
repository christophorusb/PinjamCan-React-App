import {React, useState} from 'react'
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem';
import Form from 'react-bootstrap/Form'
import CircularProgress from '@mui/material/CircularProgress'
import { useFormContext, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message';
import Skeleton from '@mui/material/Skeleton';
// import { makeStyles } from '@mui/styles';


const CustomFormSelect = (props) => {
    const [option, setOption] = useState('');
    const [labelFocus, setLabelFocus] = useState(false);
    const { register, formState: { errors } } = useFormContext();
    const selectValidation = props.selectValidation
    const selectName = props.selectName

    const getDefaultValue = (existingValue) => {
        if(existingValue){
            if(option === ''){
                return existingValue
            }
            else{
                return option
            }
        }
        else{
            return option
        }
    }

    const handleOptionChange = (event) => {
        setOption(event.target.value)
    }
// console.log('inside ProductCategorySelect.js')

    if(props.selectOptions === null || props.selectOptions.length === 0){
        // console.log('category not yet loaded')
        return (
            <div className="mb-3">
              <Skeleton variant="rectangular" width={1366} height={50} />
            </div>
          )
    }
    // console.log('category loaded')
    // console.log(props)
    return (
        <>
            {labelFocus && <Form.Label className="secondary-font-color">{props.selectLabel}</Form.Label>}
            {!labelFocus && <Form.Label>{props.selectLabel}</Form.Label>}
            <TextField
                id="category-select"
                name={selectName}
                select
                //defaultValue={props.existingValue.Value ? props.existingValue.Value : ''}
                value={option}
                inputProps={
                    register(selectName, selectValidation)
                }
                onChange={handleOptionChange}
                onFocus={() => setLabelFocus(true)}
                onBlur={() => setLabelFocus(false)}
                label="Kategori"
                sx={{width:'100%',marginBottom:'20px', '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':{borderColor:'#FC5185'}, '& .MuiInputLabel-root.Mui-focused':{color:'#FC5185'}}}
            >
            {props.selectOptions.dataResponse.map(response => (
                <MenuItem 
                    sx={{'&.Mui-selected': {color:'#FC5185'}}} 
                    key={response._id} 
                    value={response.Value}
                >
                    {response.Value}
                </MenuItem>
            ))
            }
            </TextField>

            <ErrorMessage 
                errors={errors} 
                name={selectName}
                render={({ message }) => <p style={{fontSize:'0.9rem', color:'red', marginTop:'-20px'}}>{message}</p>} 
            />
        </>
    )
}

export default CustomFormSelect