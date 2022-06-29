import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { FaChevronRight } from 'react-icons/fa'

const HeadingBreadcrumbs = (props) => {
  return (
    <div className="mt-4">
        <h2>{props.headingTitle}</h2>
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