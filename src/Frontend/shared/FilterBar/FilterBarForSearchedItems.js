import {React, useState, useEffect, useRef} from 'react'
//import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useSearchParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import Skeleton from '@mui/material/Skeleton';
import Form from 'react-bootstrap/Form'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup'
import Checkbox from '@mui/material/Checkbox';
import { AiFillStar } from 'react-icons/ai'
//import CustomCirularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading'

//READ THIS FOR MORE UNDERSTANDING OF URLQUERYPARAMS
//WE'RE USING HOOKS AND HELPERS FROM REACT-ROUTER WHICH FOLLOW MDN URLQUERYPARAMS PRINCIPLES
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams


const FilterBar = () => {
    //console.log(JSON.parse(localStorage.getItem('searchParams')))

    const [itemCategoriesResponse, setItemCategoriesResponse] = useState([])
    const [deliveryOptionResponse, setDeliveryOptionResponse] = useState([])
    const [isFilterPrepared, setIsFilterPrepared] = useState(false)
    const deliveryOptionsArr = useRef([])
    const priceMinMaxArr = useRef([])
    const minPriceDefault = useRef('')
    const maxPriceDefault = useRef('')
    const searchParamsObj = useRef({})
    let [searchParams, setSearchParams] = useSearchParams()
    let location = useLocation()
    // let activeCategoryFilterClassName = "active-filter-category-selection filter-category-selection"
    // let inactiveCategoryFilterClassName = "filter-category-selection"

    //checking if query params still exist
    //if query params still exist, just mutate the refs with the query params because
    //refs reset after unmounting / page refreshing
    if(localStorage.getItem('searchParams_searchedItems') !== null && Object.keys(JSON.parse(localStorage.getItem('searchParams_searchedItems'))).length > 0) {
        console.log('params exist')
        if(location.search === ''){
            setSearchParams(JSON.parse(localStorage.getItem('searchParams_searchedItems')))
        }
        if(JSON.parse(localStorage.getItem('searchParams_searchedItems')).ItemDeliveryOptions !== undefined) {
            deliveryOptionsArr.current = JSON.parse(localStorage.getItem('searchParams_searchedItems')).ItemDeliveryOptions
        }

        if(JSON.parse(localStorage.getItem('searchParams_searchedItems')).ItemPriceDailyMinimum !== undefined) {
            priceMinMaxArr.current = JSON.parse(localStorage.getItem('searchParams_searchedItems')).ItemPriceDailyMinimum
            const minPriceDefaultIndex = priceMinMaxArr.current.findIndex(item => item.includes('$gte'))
            const maxPriceDefaultIndex = priceMinMaxArr.current.findIndex(item => item.includes('$lte'))

            if(minPriceDefaultIndex !== -1){
                minPriceDefault.current = priceMinMaxArr.current[minPriceDefaultIndex].split('$gte')[1]
            }
            if(maxPriceDefaultIndex !== -1){
                maxPriceDefault.current = priceMinMaxArr.current[maxPriceDefaultIndex].split('$lte')[1]
            }
        }
        searchParamsObj.current = JSON.parse(localStorage.getItem('searchParams_searchedItems'))
    } else{
        localStorage.removeItem('searchParams_searchedItems')
    }

    // console.log(priceMinMaxArr.current.find(item => item.includes('$lte')).substring(4))
    // console.log(priceMinMaxArr.current.find(item => item.includes('$gte')).substring(4))

    useEffect(() => {
        const filterSelections_api_URL = [
            'http://localhost:5000/api/items/item-categories',
            'http://localhost:5000/api/delivery-options'
        ]
        const fetchFilterSelections_api_URL = async () => {
            axios.all(filterSelections_api_URL.map((url) => axios.get(url))).then(
                axios.spread((itemCategories, deliveryOptions) => {
                    setItemCategoriesResponse(itemCategories.data)
                    setDeliveryOptionResponse(deliveryOptions.data)
                })
            ).then(() => {
                setIsFilterPrepared(true)
            })
        }
        fetchFilterSelections_api_URL()
    },[])

    const handleDeliveryOptionChange = (e) => {
        //check event logic
        if(e.target.checked){
            deliveryOptionsArr.current.push(e.target.value)
            //declare const of updated values so it maintains immutability state
            const updated = {
                ItemDeliveryOptions: deliveryOptionsArr.current
            }
            searchParamsObj.current = {...searchParamsObj.current, ...updated}
            localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
            setSearchParams(searchParamsObj.current)
        }
        //uncheck event logic
        else{
            //update the ref by removing that item from the array ref
            deliveryOptionsArr.current = deliveryOptionsArr.current.filter(item => item !== e.target.value)
            //if during this logic, delivery option checkboxes are all unchecked, remove from searchParamsObj
            if(deliveryOptionsArr.current.length === 0){
                delete searchParamsObj.current.ItemDeliveryOptions
                localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
                setSearchParams(searchParamsObj.current)
            }
            //if there are remaining checkboxes after an uncheck event, update the array
            //using the updated array ref
            else{
                const updated = {
                    ItemDeliveryOptions: deliveryOptionsArr.current
                }
                searchParamsObj.current = {...searchParamsObj.current, ...updated}
                localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
                setSearchParams(searchParamsObj.current)     
            }      
        }
    }

    const handleApplyRatingChange = (e) => {
        if(e.target.checked){
            const ratingNumberFromValue = e.target.value.slice(-1)
            const parsedRatingNumberFromValue = parseInt(ratingNumberFromValue)
            //declare const of updated values so it maintains immutability state
            const updated = {
                ItemRatingAverage: parsedRatingNumberFromValue
            }
            //insert the new object into the searchParamsObj ref
            searchParamsObj.current = {...searchParamsObj.current, ...updated}
            //update the localStorage with the updated searchParamsObj ref
            localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
            //update the URL query params with the updated searchParamsObj ref
            setSearchParams(searchParamsObj.current)
        }
        else{
            //console.log('rating target unchecked')
            //remove rating property from object
            delete searchParamsObj.current.ItemRating
            localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
            setSearchParams(searchParamsObj.current)
        }
    }

    //similar algorithm to handleApplyRatingChange
    const handleApplyItemAvailableChange = (e) => {
        if(e.target.checked){
            //declare const of updated values so it maintains immutability state
            const updated = {
                ItemStatus: e.target.value
            }
            searchParamsObj.current = {...searchParamsObj.current, ...updated}
            localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
            setSearchParams(searchParamsObj.current)
        }
        else{
            //console.log('rating target unchecked')
            delete searchParamsObj.current.ItemStatus
            localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
            setSearchParams(searchParamsObj.current)
        }
    }

    //fire api not during input change event, but after the focusout event
    const handleMinPriceBlur = (e) => {
        // if input state is not empty, set it to localStorage and searchParams ref
        if(e.target.value !== ''){
            const valueQueryOp = '$gte'.concat(e.target.value)
            // find index where in the array ref, it holds a value with $gte substring
            const index = priceMinMaxArr.current.findIndex(item => item.includes('$gte'))
            // if index is found, remove the old value and replace it with the new value
            if(index !== -1){
                priceMinMaxArr.current.splice(index, 1, valueQueryOp)
            }

            //if index is not found, just push the new value to the array ref
            else{
                priceMinMaxArr.current.push(valueQueryOp)
            }

            //declare const of updated values so it maintains immutability state
            const updated = {
                ItemPriceDailyMinimum: priceMinMaxArr.current
            }
            searchParamsObj.current = {...searchParamsObj.current, ...updated}
            localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
            setSearchParams(searchParamsObj.current)
        }

        //if input state is empty
        if(e.target.value === ''){
            //checking if the array ref contains a value with $gte substring
            const index = priceMinMaxArr.current.findIndex(item => item.includes('$gte'))

            //delete if found
            if(index !== -1){
                priceMinMaxArr.current.splice(index, 1)
            }

            //if array ref is empty after splice, delete from searchParamsObj
            if(priceMinMaxArr.current.length === 0){
                delete searchParamsObj.current.ItemPriceDailyMinimum
                localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
                setSearchParams(searchParamsObj.current)
            }
            else{
                const updated = {
                    ItemPriceDailyMinimum: priceMinMaxArr.current
                }
                //remove the min price query param from the searchParamsObj ref
                searchParamsObj.current = {...searchParamsObj.current, ...updated}
                localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
                setSearchParams(searchParamsObj.current)
            }
        }
    }

    const handleMaxPriceBlur = (e) => {
        //if input state is not empty, set it to localStorage and searchParams ref
        if(e.target.value !== ''){
            const valueQueryOp = '$lte'.concat(e.target.value)
            //find index where in the array ref, it holds a value with $gte substring
            const index = priceMinMaxArr.current.findIndex(item => item.includes('$lte'))
            //if index is found, remove the old value and replace it with the new value
            if(index !== -1){
                priceMinMaxArr.current.splice(index, 1, valueQueryOp)
            }
            //if index is not found, just push the new value to the array ref
            else{
                priceMinMaxArr.current.push(valueQueryOp)
            }
             //declare const of updated values so it maintains immutability state
            const updated = {
                ItemPriceDailyMinimum: priceMinMaxArr.current
            }
            searchParamsObj.current = {...searchParamsObj.current, ...updated}
            localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
            setSearchParams(searchParamsObj.current)
        }

        if(e.target.value === ''){
            //checking if the array ref contains a value with $gte substring
            const index = priceMinMaxArr.current.findIndex(item => item.includes('$lte'))

            //delete if found
            if(index !== -1){
                priceMinMaxArr.current.splice(index, 1)
            }

            //if array ref is empty after splice, delete from searchParamsObj
            if(priceMinMaxArr.current.length === 0){
                delete searchParamsObj.current.ItemPriceDailyMinimum
                localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
                setSearchParams(searchParamsObj.current)
            }
            else{
                const updated = {
                    ItemPriceDailyMinimum: priceMinMaxArr.current
                }
                //remove the min price query param from the searchParamsObj ref
                searchParamsObj.current = {...searchParamsObj.current, ...updated}
                localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
                setSearchParams(searchParamsObj.current)
            }
        }
    }

    const handleCategoryRadioChange = (e) => {
        //declare const of updated values so it maintains immutability stat
        const updated = {
            ItemCategory: e.target.value
        }
        searchParamsObj.current = {...searchParamsObj.current, ...updated}
        localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
        setSearchParams(searchParamsObj.current)
    }

    const handleInactiveRadio = (e) => {
        delete searchParamsObj.current.ItemCategory
        localStorage.setItem('searchParams_searchedItems', JSON.stringify(searchParamsObj.current))
        setSearchParams(searchParamsObj.current)
    }

  if(isFilterPrepared){
    //console.log('filter prepared')
    return (
        <div className="filter-wrapper">
            <h4>Filter</h4>
            <div className="filter-content-wrapper shadow-sm">

                {/* FILTER BY CATEGORY */}
                <div className="filter-category mt-3">
                    <FormControl>
                        <FormLabel id="category-radio-group-label">
                            <h6><strong>Kategori</strong></h6>
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="category-radio-group-label"
                            name="radio-buttons-group"
                            onChange={handleCategoryRadioChange}
                        >
                            {itemCategoriesResponse.dataResponse.map(itemCategory => (
                                <FormControlLabel 
                                    key={itemCategory._id}
                                    value={itemCategory._id} 
                                    control={
                                        <Radio 
                                            onClick={handleInactiveRadio}
                                            checked={location.search.includes(itemCategory._id) ? true : false}
                                            sx={{color:'#FC5185', '&.Mui-checked': {color:'#FC5185'}}}
                                        />          
                                    } 
                                    label={<span style={{fontSize:'0.9rem'}}>{itemCategory.Value}</span>} />
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                </div>

                {/* FILTER BY PRICE */}
                <div className="filter-price mt-3">
                    <div><h6><strong>Harga</strong></h6></div>
                    <div>
                        <Form.Control 
                            onBlur = {handleMinPriceBlur}
                            className="mt-2 form-input-focus" size="sm" type="text" placeholder="Min. Harga" 
                            defaultValue = {minPriceDefault.current}
                        />
                        <Form.Control 
                            onBlur = {handleMaxPriceBlur}
                            className="mt-2 form-input-focus" size="sm" type="text" placeholder="Max. Harga" 
                            defaultValue={maxPriceDefault.current}
                        />
                    </div>
                </div>

                {/* FILTER BY DELIVERY OPTIONS */}
                <div className="filter-delivery-option mt-3">
                    <div><h6><strong>Pengiriman</strong></h6></div>
                    <FormGroup>
                    {
                        deliveryOptionResponse.dataResponse.map(deliveryOption => (
                        <FormControlLabel 
                            key={deliveryOption._id} 
                            control={
                            <Checkbox 
                                id={`checkbox-${deliveryOption._id}`}
                                sx={{color:'#FC5185', '&.Mui-checked': {color:'#FC5185'}}}
                                value={deliveryOption._id}
                                onChange={handleDeliveryOptionChange}
                                checked={location.search.includes(deliveryOption._id) ? true : false}
                            />
                            } 
                            label={<span style={{fontSize:'0.9rem'}}>{deliveryOption.Label}</span>} 
                        />
                        ))
                    }
                    </FormGroup>
                </div>

                {/* FILTER BY RATING */}
                <div className="mt-3">
                    <div><h6><strong>Rating</strong></h6></div>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id='checkbox-rating-above-4'
                                    value= "RATING_ABOVE_4" 
                                    sx={{color:'#FC5185', '&.Mui-checked': {color:'#FC5185'}}}
                                    onChange={handleApplyRatingChange}
                                    checked={location.search.includes('ItemRating') ? true : false}
                                />
                            }
                            label={<span style={{fontSize:'0.9rem'}}><AiFillStar style={{color: '#fdc140'}}/> 4 ke atas</span>}
                        />
                    </FormGroup>
                </div>

                {/* FILTER BY AVAILABILITY */}
                <div className="mt-3">
                    <div><h6><strong>Status</strong></h6></div>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id='checkbox-item-available'
                                    value="Available" 
                                    sx={{color:'#FC5185', '&.Mui-checked': {color:'#FC5185'}}}
                                    onChange={handleApplyItemAvailableChange}
                                    checked={location.search.includes('ItemStatus') ? true : false}
                                />
                            } 
                            label={<span style={{fontSize:'0.9rem'}}>Barang tersedia</span>}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    )
  }

  return(
    <div className="filter-wrapper">
        <div>
            <Skeleton variant="rectangular" height={650}/>
        </div>
    </div>
  )
}

export default FilterBar