const initialFilterState = {
    category: '',
    minPrice: 0,
    maxPrice: 0,
    deliveryOptions: [],
    applyRatingThreshold: false,
    applyAvailabilityCheck: false,
}

const filterReducer = (state = initialFilterState, action) => {
    switch (action.type){
        case 'CHANGE_CATEGORY':
            return{
                ...state,
                category: action.payload.category
            }
        case 'CHANGE_MIN_PRICE':
            return{
                ...state,
                minPrice: action.payload.minPrice
            }
        case 'CHANGE_MAX_PRICE':
            return{
                ...state,
                maxPrice: action.payload.maxPrice
            }
        case 'CHANGE_DELIVERY_OPTIONS':
            return{
                ...state,
            }
        case 'APPLY_RATING_THRESHOLD':
            return{
                ...state,
            }
        case 'APPLY_AVAILABILITY_CHECK':
            return{
                ...state,
            }
        default:
            return state
    }
}

export default filterReducer;