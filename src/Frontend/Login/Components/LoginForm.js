import React from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector,  useDispatch } from 'react-redux'
import { message } from 'antd'
import '../../Login/Pages/Login.css';
import '../../../customGeneralStyle.css';
import {FaEye, FaEyeSlash} from 'react-icons/fa';

const LoginForm = () => {
    const state = useSelector(state => state.login) //useSelector automatically sets up subscription to store
    const dispatch = useDispatch()
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [isBadRequest, setIsBadRequest] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    let navigate = useNavigate()
    const loginHandler = async (e) => {
        e.preventDefault()
        setIsBadRequest(false)
        const hide = message.loading({ content: <strong className="secondary-font-color">Sedang mengecek akun kamu...</strong>, duration: 0})
        const response = await fetch(`${process.env.REACT_APP_URL_TO_BACKEND}/api/users/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: loginEmail,
                    userPassword: loginPassword,
                }),
            })

        const data = await response.json()

        //if login credentials are incorrect
        if(!response.ok){
            hide()
            setIsBadRequest(true)
        }
        //if login credentials are correct, save token to localStorage 
        //and dispatch LOGIN action to store with user data as payload
        else{
            hide()
            setIsBadRequest(false)
            dispatch({type: 'LOGIN', payload: data})
            //set token and time of login to local storage
            localStorage.setItem('token', data.token)
            localStorage.setItem('timeOfLogin', data.timeOfLogin)
            localStorage.setItem('userFullName',data.userFullName)
            navigate('/home', {replace: true})
        }   
    }

    useEffect(() => {
        console.log(state)
    }, [isBadRequest])

    const toggleIsPasswordShown = () => {
        setIsPasswordShown(!isPasswordShown);
    };

  return (
    <div className="login-content">
        <Link className="link-to-home" to="/">
            <h2><strong><span className="primary-font-color">Pinjam</span><span className="secondary-font-color">Can</span></strong></h2>
        </Link>

        <h1 className="primary-font-color" style={{fontWeight:600, textAlign: "center"}}>Masuk ke akun kamu</h1>
        <Form className="login-form" onSubmit = {loginHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type="email" placeholder="Email Kamu" name="userEmail" />
                <Form.Text className="text-muted">
                    Contoh: email@pinjamcan.com
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type={isPasswordShown ? 'text' : 'password'} placeholder="Password Kamu" name="userPassword" />
                {loginPassword && (
                    <Button className="eye-button" onClick={toggleIsPasswordShown}>
                        {isPasswordShown ? <FaEyeSlash style={{color: 'black'}}/> : <FaEye style={{color: 'black'}}/>}
                    </Button>
                )}
            </Form.Group>
            <Link to="/reset-password" className="secondary-font-color" style={{fontSize:'0.7rem'}}>
                <span>Lupa password kamu?</span>
            </Link>
            {isBadRequest && <p style={{marginBlock:0, marginTop:"2em", fontSize: "0.8em"}} className="secondary-font-color"><strong>Email atau password salah</strong></p>}
            <Button type="submit" className="login-submit-button primary-background-color">
                Masuk
            </Button>
            
            <div>
                <p style={{marginBlock:0, marginTop:"2em", textAlign:"center", fontSize: "0.8em"}}>
                    Belum punya akun? <Link to="/register" className="link-to-register secondary-font-color">Daftar</Link>
                </p>
            </div>
        </Form>
        
    </div>
  )
}

export default LoginForm