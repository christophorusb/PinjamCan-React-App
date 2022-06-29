import { React, useState, useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container'

const ProtectRoute = (props) => {
  //const state = useSelector(state => state.login)
  let navigate = useNavigate()
  const dispatch = useDispatch()
  const isTokenValid = useRef(false)

  const checkTokenValidity = (token, timeOfLogin) => {
    if(token !== null && timeOfLogin !== null){
      console.log('check token function is fired')
      const timeOfLogin = localStorage.getItem('timeOfLogin')
      const currentTime = new Date(Date.now()).getTime()
      const timeDifference = currentTime - timeOfLogin
      const tokenValidityDuration = 30 * 24 * 60 * 60 * 1000 //30 days
      //if token duration is within validity duration
      if(timeDifference < tokenValidityDuration){
        console.log('token is valid')
        return true
      }
      //if token duration is outside validity duration
      else{
        return false
      }
    }
    else{
      return false
    }
  }

  useEffect(() => {
    // console.log('useEffect is running')
    // console.log('token status before validation ' + isTokenValid)
    const token = localStorage.getItem('token')
    const timeOfLogin = localStorage.getItem('timeOfLogin')
    // console.log('token? ' + token)
    // console.log('time of login? ' + timeOfLogin)
    isTokenValid.current = checkTokenValidity(token, timeOfLogin)
    // console.log('token status after validation ' + isTokenValid.current)

    if(isTokenValid.current === false){
      localStorage.removeItem('token')
      localStorage.removeItem('timeOfLogin')
      localStorage.removeItem('userFullName')
      dispatch({type: 'LOGOUT'})
      navigate('/login', {replace: true})
    }
  }, [])

  return(
    <Container>
      {props.children}
    </Container>
  )
}

export default ProtectRoute