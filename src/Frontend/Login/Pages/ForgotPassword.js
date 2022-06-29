import { React, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ErrorMessage }from '@hookform/error-message'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import '../../Login/Pages/Login.css';
import Container from 'react-bootstrap/Container';
import { Modal, Space } from 'antd';
import axios from 'axios'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [emailExist, setEmailExist] = useState(true)
    const { register,
            handleSubmit, 
            formState: { errors }, 
        } 
        = useForm();
    const handleError = (errors) => {};
    const validations = {
        userEmail: {
            required: "Email tidak boleh kosong!",
            pattern:{
                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Email tidak benar! Contoh: user@pinjamcan.com"
            },
            onChange: (e) => setEmailExist(true)
        },
    }
    const submitEmail = async (data, e) => {
        e.preventDefault()
        setEmailExist(true)
        console.log('submit email')
        console.log(data.userEmail)
        const response = await axios({
            method: 'post',
            url: 'http://localhost:5000/api/users/reset-password/send-recovery-email',
            data: {
                userEmail: data.userEmail
            },
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            console.log(res)
            setEmailExist(true)
            if(res.status === 200){
                if(res.data. statusText === 'PASSWORD_RECOVERY_EMAIL_SENT'){
                    Modal.success({
                        content: 'Link untuk reset password sudah dikirim ke email kamu.',
                        onOk: (e) => {
                            window.location.href = '/'
                        }
                    })
                }
            }
        }).catch(err => {
            setEmailExist(false)
        })
        // console.log(data)
    }

  return (
    <Container className="login-page-wrapper d-flex">
        <div className="login-content">
            <Link className="link-to-home" to="/">
                <h2><strong><span className="primary-font-color">Pinjam</span><span className="secondary-font-color">Can</span></strong></h2>
            </Link>

            <h1 className="primary-font-color" style={{fontWeight:600, textAlign: "center"}}>Reset password</h1>
            <Form className="login-form" onSubmit={handleSubmit(submitEmail, handleError)}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email kamu</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Email Kamu" 
                        name="userEmail" 
                        {...register('userEmail', validations.userEmail)}
                    />
                    <ErrorMessage 
                        errors={errors} 
                        name='userEmail'
                        render={({ message }) => <p style={{fontSize:'0.8rem', color:'red'}}>{message}</p>} 
                    />
                    {!emailExist && <p style={{marginBlock:0, fontSize: "0.8rem", color:"red"}}>User tidak ditemukan!</p>}
                </Form.Group>

                <Button type="submit" className="login-submit-button primary-background-color">
                    Kirim link reset password
                </Button>
            </Form>
        </div>
    </Container>
  )
}

export default ForgotPassword