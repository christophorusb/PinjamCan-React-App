const initialLoginState = {
    isLoggedIn: false,
    user: {
        _id: '',
        userEmail: '',
        userFullName: '',
        token: '',
        timeOfLogin: null
    }
}
const loginReducer = (state = initialLoginState, action) => {
    switch (action.type) {
      case 'LOGIN':
          //return a new state object
        return {
            ...state,
            //that has the inverted state of isLoggedIn
            isLoggedIn: !state.isLoggedIn,
            //and has the existing 'user' object state data
            user: 
            //but has the new data in thae 'user' object field
            {
                _id: action.payload._id,
                userEmail: action.payload.userEmail,
                userFullName: action.payload.userFullName,
                token: action.payload.token,
                timeOfLogin: action.payload.timeOfLogin
            }  
        }
      case 'LOGOUT':
        return {
          state
        }
      default:
        return state
    }
  }

  export default loginReducer;