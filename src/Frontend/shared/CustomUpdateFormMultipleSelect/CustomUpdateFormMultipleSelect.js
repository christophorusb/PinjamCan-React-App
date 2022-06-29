import { React, useState, useEffect } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Form from 'react-bootstrap/Form'
import { useFormContext, Controller } from 'react-hook-form'
import { ErrorMessage }from '@hookform/error-message'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomUpdateFormMultipleSelect = (props) => {
    const [labelFocus, setLabelFocus] = useState(false)
    const [optionsChosen, setOptionsChosen] = useState([])
    const {control, register, formState: { errors } } = useFormContext()

    const selectValidation = props.selectValidation;
    const selectName = props.selectName

    //console.log(props.existingValues)

    // const getDefaultOptions = (existingValues) => {
    //     if(existingValues){
    //       let valuesArray = []
            
    //         if(optionsChosen.length === 0){
    //             return valuesArray
    //         }
    //         else{
    //             return optionsChosen
    //         }
    //     }
    //     else{
    //         return optionsChosen
    //     }
    // }
    // console.log('option state')
    // console.log(option)
  
    const handleOptionChange = (event) => {
        //console.log('event fired')
        const { target:  { value }, } = event;
        setOptionsChosen(typeof value === 'string' ? value.split(',') : value)
    }

    useEffect(() => {
      if(props.existingValues !== 'NONE'){
        let valuesArray = []
          props.existingValues.forEach(obj => {
            valuesArray.push(obj.Value)
          })

          setOptionsChosen(valuesArray)
      }
    },[props.existingValues])

  if(props.selectOptions === null || props.selectOptions.length === 0){
    return (
      <div className="mb-3">
        <Skeleton variant="rectangular" width={1366} height={50} />
      </div>
    )
  }
  if(props.existingValues === 'NONE'){
    return (
      <div className="mb-3">
        <Skeleton variant="rectangular" width={1366} height={50} />
      </div>
    )
  }
  else{
   // console.log(props)
    return (
        <div>
            {labelFocus && <Form.Label className="secondary-font-color">{props.selectLabel}</Form.Label>}
            {!labelFocus && <Form.Label>{props.selectLabel}</Form.Label>}
            <FormControl sx={{width:'100%',marginBottom:'20px', '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':{borderColor:'#FC5185'}, '& .MuiInputLabel-root.Mui-focused':{color:'#FC5185'}}}>
              <InputLabel id="custom-multiple-select">Pengiriman Barang</InputLabel>
              <Select
                  labelId="custom-multiple-select"
                  id="custom-multiple-select"
                  multiple
                  value={optionsChosen}
                  onChange = {handleOptionChange}
                  onFocus = {() => setLabelFocus(true)}
                  onBlur = {() => setLabelFocus(false)}
                  input={<OutlinedInput label="Pengiriman Barang" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                  inputProps = {
                    register(selectName, selectValidation)
                  }
                  >
                  {props.selectOptions.dataResponse.map((optionData) => (
                      <MenuItem key={optionData._id} value={optionData.Value} sx={{'&.Mui-selected': {color:'#FC5185'}}}>
                          <Checkbox sx ={{'&.Mui-checked': {color:'#FC5185'}}} checked={optionsChosen.indexOf(optionData.Value) > -1} />
                          <ListItemText primary={optionData.Label} />
                      </MenuItem>
                  ))}
                </Select> 
              </FormControl> 

              <ErrorMessage 
                errors={errors} 
                name={selectName}
                render={({ message }) => <p style={{fontSize:'0.9rem', color:'red', marginTop:'-20px'}}>{message}</p>} 
              />
        </div>
      )
  }  
}

export default CustomUpdateFormMultipleSelect
