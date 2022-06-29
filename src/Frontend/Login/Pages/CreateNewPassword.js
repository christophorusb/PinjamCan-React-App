import { React, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message'
import { Link, useParams } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import '../../Login/Pages/Login.css';
import Container from 'react-bootstrap/Container';
import { Modal, Space } from 'antd';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import CustomCircularLoading from '../../shared/CustomCircularLoading/CustomCircularLoading';
import axios from 'axios'

const CreateNewPassword = () => {
    const { register,
        handleSubmit, 
        getValues,
        formState: { errors }, 
    } 
    = useForm();

    let { resetToken } = useParams()
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
    const [tokenPayload, setTokenPayload] = useState({})
    const [resetTokenValid, setResetTokenValid] = useState(false)

    const toggleIsPasswordShown = () => {
        setIsPasswordShown(!isPasswordShown);
    };

    const toggleIsConfirmPasswordShown = () => {
        setIsConfirmPasswordShown(!isConfirmPasswordShown);
    };

    const validations = {
        userPassword: {
            required: "Password tidak boleh kosong",
            pattern: {
                value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, //pattern: min 8 letter, at least one symbol, upper and lower case letters and a number
                message: "Password harus berisi minimal 8 karakter, mempunyai setidaknya 1 simbol, mempunyai huruf kapital, huruf kecil, dan angka"
            }
        },
        userPasswordConfirmation: {
            required: "Konfirmasi password harus diisi",
            validate: (value) => value === getValues("userPassword") || "Konfirmasi password harus sama dengan password"
        }
    }

    const handleError = (errors) => {};

    const submitNewPassword = (data, e) =>{
        e.preventDefault();
        console.log(data)
        console.log('jwt payload')
        console.log(tokenPayload)
        axios({
            method: 'post',
            url: 'http://localhost:5000/api/users/reset-password/create-new-password',
            data: {
                newUserPassword: data.userPassword,
                userEmail: tokenPayload.userEmail,
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status === 200){
                if(res.data.statusText === 'PASSWORD_RESET_SUCCESS'){
                    Modal.success({
                        content: 'Yay! Password kamu berhasil diganti. Silahkan kembali ke halaman Login.',
                        onOk: (e) => {
                            window.location.href = '/login'
                        }
                    });
                }
            }
        }).catch(err => {
            console.log(err)
        })
    }

    //side effect for checking token
    useEffect(() => {
        const resetTokenUrl = `http://localhost:5000/api/users/reset-password/verify-reset-token/${resetToken}`
        axios.get(resetTokenUrl).then(res => {
            console.log(res)
            setTokenPayload(res.data.payloadResponse)
            setResetTokenValid(true)
        }).catch(err => {
            if(err.response.status === 400){
                if(err.response.data.statusText === 'PASSWORD_RESET_TOKEN_EXPIRED'){
                    Modal.error({
                        title: 'Error: Reset Password Link Expired',
                        content: 'Link ini sudah tidak berlaku, silahkan kembali ke login.',
                        onOk: (e) => {
                            window.location.href = '/login'
                        }
                    });
                }
            }
            console.log(err)
        })
    }, [])

    if(resetTokenValid === false){
        return <CustomCircularLoading />
    }
  return (
    <Container className="login-page-wrapper d-flex">
        <div className="login-content">
            <h2><strong><span className="primary-font-color">Pinjam</span><span className="secondary-font-color">Can</span></strong></h2>
            <h1 className="primary-font-color" style={{fontWeight:600, textAlign: "center"}}>Reset password</h1>
            <Form className="login-form" onSubmit={handleSubmit(submitNewPassword, handleError)}>
                <Form.Group className="mb-3" controlId="user-password">
                    <Form.Label>Password baru</Form.Label>
                    <Form.Control 
                        name="userPassword" 
                        id="user-password" 
                        type={isPasswordShown ? 'text' : 'password'} 
                        placeholder="Password baru kamu" 
                        {...register('userPassword', validations.userPassword)} 
                    />
                    {(
                        <Button className="eye-button" onClick={toggleIsPasswordShown}>
                            {isPasswordShown ? <FaEyeSlash style={{color:'black'}}/> : <FaEye style={{color:'black'}}/>}
                        </Button>
                    )}
                    <ErrorMessage 
                        errors={errors} 
                        name='userPassword'
                        render={({ message }) => <p style={{fontSize:'0.8rem', color:'red'}}>{message}</p>} 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="user-password-confirmation">
                    <Form.Label>Konfirmasi Password Baru</Form.Label>
                    <Form.Control 
                        name="userPasswordConfirmation" 
                        id="user-password-confirmation" 
                        type={isConfirmPasswordShown ? 'text' : 'password'} 
                        placeholder="Ulangi password baru kamu" 
                        {...register('userPasswordConfirmation', validations.userPasswordConfirmation)} 
                    />
                    {(
                        <Button className="eye-button" onClick={toggleIsConfirmPasswordShown}>
                            {isConfirmPasswordShown ? <FaEyeSlash style={{color:'black'}} /> : <FaEye style={{color:'black'}} />}
                        </Button>
                    )}
                    <ErrorMessage 
                        errors={errors} 
                        name='userPasswordConfirmation'
                        render={({ message }) => <p style={{fontSize:'0.8rem', color:'red'}}>{message}</p>} 
                    />
                </Form.Group>

                <Button type="submit" className="login-submit-button primary-background-color">
                    Ubah password
                </Button>
            </Form>
        </div>
    </Container>
  )
}

export default CreateNewPassword