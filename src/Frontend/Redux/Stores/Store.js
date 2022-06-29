import { createStore } from 'redux'
import reducers from '../Reducers/Reducers'
//simple example
// const counterReducer = (state = { counter: 0 }, action) => {
//   if (action.type === 'INCREMENT'){
//     return{
//       counter: state.counter + 1
//     }
//   }

//   if (action.type === 'DECREMENT'){
//     return{
//       counter: state.counter - 1
//     }
//   }
//   else{
//     return state
//   }
// })

const store = createStore(
    reducers,
)

export default store