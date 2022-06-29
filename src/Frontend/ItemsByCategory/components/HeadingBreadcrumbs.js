import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { FaChevronRight } from 'react-icons/fa'

const HeadingBreadcrumbs = (props) => {
  //console.log(props)
  return (
    <div className="mt-4">
        {props.headingFor === 'SearchedItems'
          &&
          <div style={{width: '50%'}}>
            <h5>Hasil pencarian untuk "<span className="secondary-font-color" style={{textOverflow: 'ellipsis'}}>{props.headingTitle.replaceAll('-',' ')}</span>"</h5>
          </div>
        }
        {
          props.headingFor === 'ItemsByCategory'
          &&
          <h2>
            {props.headingTitle === 'Semua' ? 'Semua Kategori' : props.headingTitle}
          </h2>
        }
        
        <Stack spacing={2}>
            <Breadcrumbs
              separator={<FaChevronRight />}
              aria-label="breadcrumb"
            >
            {props.breadcrumbs}
            </Breadcrumbs>
        </Stack>
    </div>
  )
}

export default HeadingBreadcrumbs