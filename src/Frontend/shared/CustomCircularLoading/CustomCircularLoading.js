import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import '../../../customGeneralStyle.css'

const CustomCircularLoading = () => {
  return (
    <div className="circular-loading">
        <CircularProgress size={60}/>
    </div>
  )
}

export default CustomCircularLoading