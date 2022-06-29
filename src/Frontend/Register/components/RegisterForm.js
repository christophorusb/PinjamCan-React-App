import {React, useState, useRef} from 'react'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';

import RegisterSuccess from '../../Success/pages/RegisterSuccess'
import TermsConditionsPrivacyPolicy from './TermsConditionsPrivacyPolicy';
import { useForm } from 'react-hook-form';
import { Modal, Space } from 'antd';

import '../pages/Register.css';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import axios from 'axios'
import { ModalManager } from '@mui/material';

const RegisterForm = () => {
    const toggleIsPasswordShown = () => {
        setIsPasswordShown(!isPasswordShown);
    };
    const toggleIsConfirmPasswordShown = () => {
        setIsConfirmPasswordShown(!isConfirmPasswordShown);
    };
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

    const { register,
            control,
            handleSubmit, 
            formState: { errors }, 
            getValues } 
            = useForm();

    //multistep form
    const [formStep, setFormStep] = useState(0)
    const [responseUserEmail, setResponseUserEmail] = useState('')

    const prevStep = () => {
        setFormStep(formStep - 1);
    }

    const nextStep = (retrievedUserEmail) => {
        console.log('retrievedUserEmail')
        console.log(retrievedUserEmail)
        setFormStep(formStep + 1);
        setResponseUserEmail(retrievedUserEmail)
    }

    // const handleRegistration = (data) => console.log(data);
    let navigate = useNavigate();

    async function handleRegistration(data, event){
        event.preventDefault();
        
        axios({
            method: 'POST',
            url: 'http://localhost:5000/api/users/register',
            data: {
                userEmail: responseUserEmail,
                dataRequest: data,
            },
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log('RESPONDED')
            navigate("/register-success", { replace: true });
        }).catch(error => {
            if(error.response.status === 400){
               if(error.response.data.statusText === 'USER_DATA_DUPLICATE'){
                    Modal.error({
                        title: `Error: Data duplikat (key: ${error.response.data.duplicateKey})`,
                        content: 'Kami menemukan adanya duplikasi dengan data yang kamu masukkan di sistem kami. Silahkan coba lagi ya!',
                        onOk: (e) => {document.location.reload()},
                        okButtonProps: {
                            style: {
                                backgroundColor: '#3D4667',
                                border: '1px solid #3D4667'
                            }
                        },
                    });
               }
               if(error.response.data.statusText === 'USER_EXIST'){
                    Modal.error({
                        title: 'Error: User sudah ada',
                        content: 'Ups! Sepertinya data kamu sudah terdaftar di sistem kami. Coba masuk dengan email yang lain ya!',
                        onOk: (e) => {document.location.reload()},
                        okButtonProps: {
                            style: {
                                backgroundColor: '#3D4667',
                                border: '1px solid #3D4667'
                            }
                        },
                    });
               }
            }
        })
    }

    async function handleEmailCheck(data, event){
        event.preventDefault();
        console.log('emailCheck ')
        axios({
            method: 'POST',
            url: 'http://localhost:5000/api/users/check-user',
            data: {
                userEmail: data.userEmail,
            },
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            nextStep(response.data.newUserEmail)
        }).catch(error => {
            if(error.response.status === 400){
                if(error.response.data.statusText === 'USER_EMAIL_EXIST'){
                    Modal.error({
                        title: 'Error: Email user sudah ada',
                        content: 'Ups! Sepertinya email kamu sudah ada di dalam sistem kami. Coba login kembali!',
                        onOk: (e) => {
                            window.location.href = '/login';
                        },
                        okText: 'Pergi ke halaman login',
                        okButtonProps: {
                            style: {
                                backgroundColor: '#3D4667',
                                border: '1px solid #3D4667'
                            }
                        },
                    });
                }
            }
        })
    }

    const handleError = (errors) => {};
    const registerValidations = {
        userFullName: { 
            required: "Nama Lengkap tidak boleh kosong!",
            minLength: {
                value: 3,
                message: "Nama harus lebih dari 3 karakter"
            }
        },
        userPhoneNumber:{
            required: "Nomor telepon tidak boleh kosong!",
            pattern:{
                value: /^8[1-9][0-9]{7,10}$/,
                message: "Nomor telepon tidak benar"
            },
        },
        // userNIK:{
        //     required:"Nomor Induk Kependudukan tidak boleh kosong!",
        //     pattern:{
        //         value: /^((1[1-9])|(21)|([37][1-6])|(5[1-4])|(6[1-5])|([8-9][1-2]))[0-9]{2}[0-9]{2}(([0-6][0-9])|(7[0-1]))((0[1-9])|(1[0-2]))([0-9]{2})[0-9]{4}$/,
        //         message: 'Nomor Induk Kependudukan tidak benar'
        //     },
        // },
        userEmail: {
            required: "Email tidak boleh kosong!",
            pattern:{
                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Email tidak benar. Contoh: user@pinjamcan.com"
            }
        },
        userAddress: {
            required: "Alamat tidak boleh kosong!",
            minLength: {
                value: 10,
                message: "Alamat harus lebih dari 10 karakter"
            }
        },
        userPassword: {
            required: "Password tidak boleh kosong!",
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

  return (
    <div className="register-content mb-5">
        <Link className="link-to-home" to="/">
            <h2><strong><span className="primary-font-color">Pinjam</span><span className="secondary-font-color">Can</span></strong></h2>
        </Link>
        <h1 className="primary-font-color" style={{fontWeight:600, textAlign: "center"}}>Daftar Sekarang</h1>
        
        <p style={{marginBlock:0, marginBottom:"2em", fontSize: "0.8em"}}>
            Kamu sudah terdaftar? {' '}
            <Link to="/login" className="link-to-login secondary-font-color">Masuk</Link>
        </p>

        {/* FIRST SECTION */}
        {formStep === 0 &&
            <Form className="register-form-first-section" onSubmit={handleSubmit(handleEmailCheck, handleError)}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="userEmail" id="user-email" type="email" placeholder="Email kamu" {...register('userEmail', registerValidations.userEmail)}/>
                    <span className="secondary-font-color register-invalid-message">{errors?.userEmail && errors.userEmail.message}</span>
                    <br />
                    {/* <Form.Text className="text-muted" style={{fontSize: '0.7rem'}}>
                        Contoh: email@pinjamcan.com
                    </Form.Text> */}
                </Form.Group>

                <Button type='submit' className="register-submit-button primary-background-color">
                    Lanjut
                </Button>

                <TermsConditionsPrivacyPolicy />
            </Form>
        }

        {/* SECOND SECTION */}
        {formStep === 1 && 
            <Form className="register-form-second-section" onSubmit={handleSubmit(handleRegistration, handleError)}>
                <p style={{textAlign: 'center'}} className="secondary-font-color"><strong>{responseUserEmail}</strong></p>
                <div className="d-flex">
                    <div className="m-4" style={{width:'350px'}}>
                        <Form.Group className="mb-3" controlId="user-full-name">
                            <Form.Label>Nama Lengkap</Form.Label>
                            <Form.Control name="userFullName" id="user-full-name" type="text" placeholder="Nama lengkap kamu" {...register('userFullName', registerValidations.userFullName)}/>
                            <span className="secondary-font-color register-invalid-message">{errors?.userFullName && errors.userFullName.message}</span>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="user-phone-number">
                            <Form.Label>Nomor Telepon</Form.Label>
                            <div className='d-flex'>
                                <div className='d-flex justify-content-center align-items-center' style={{border: '1px solid rgb(204, 200, 200)', paddingLeft:'5px', paddingRight:'7px', backgroundColor:'rgb(242, 241, 241)', borderRadius:'5px 0 0 5px'}}>
                                    <span>+62</span>
                                </div>
                                <Form.Control style={{borderLeft: 'none', borderRadius:'0 5px 5px 0'}} name="userPhoneNumber" id="user-phone-number" type="text" placeholder="Nomor Telepon Kamu" {...register('userPhoneNumber', registerValidations.userPhoneNumber)}/>
                            </div>
                            <span className="secondary-font-color register-invalid-message">{errors?.userPhoneNumber && errors.userPhoneNumber.message}</span>
                        </Form.Group>

                        {/* NIK: 3674031410000006 */}
                        {/* <Form.Group className="mb-3" controlId="user-nik">
                            <Form.Label>NIK</Form.Label>
                            <Form.Control name="userNIK" id="user-nik" type="text" placeholder="Nomor NIK kamu" {...register('userNIK', registerValidations.userNIK)}/>
                            <span className="secondary-font-color register-invalid-message">{errors?.userNIK && errors.userNIK.message}</span>
                        </Form.Group> */}

                        <Form.Group className="mb-3" controlId="user-nik">
                            <Form.Label>Alamat</Form.Label>
                            <Form.Control as ="textarea" name="userAddress" id="user-address" placeholder="Alamat kamu" {...register('userAddress', registerValidations.userAddress)}/>
                            <span className="secondary-font-color register-invalid-message">{errors?.userAddress && errors.userAddress.message}</span>
                        </Form.Group>
                    </div>

                    <div className="m-4" style={{width:'350px'}}>
                        <Form.Group className="mb-3" controlId="user-password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="userPassword" id="user-password" type={isPasswordShown ? 'text' : 'password'} placeholder="Password kamu" {...register('userPassword', registerValidations.userPassword)} />
                            {(
                                <Button className="eye-button" onClick={toggleIsPasswordShown}>
                                    {isPasswordShown ? <FaEyeSlash style={{color:'black'}}/> : <FaEye style={{color:'black'}}/>}
                                </Button>
                            )}
                            <span className="secondary-font-color register-invalid-message">{errors?.userPassword && errors.userPassword.message}</span>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="user-password-confirmation">
                            <Form.Label>Konfirmasi Password</Form.Label>
                            <Form.Control name="userPasswordConfirmation" id="user-password-confirmation" type={isConfirmPasswordShown ? 'text' : 'password'} placeholder="Ulangi Password kamu" {...register('userPasswordConfirmation', registerValidations.userPasswordConfirmation)} />
                            {(
                                <Button className="eye-button" onClick={toggleIsConfirmPasswordShown}>
                                    {isConfirmPasswordShown ? <FaEyeSlash style={{color:'black'}} /> : <FaEye style={{color:'black'}} />}
                                </Button>
                            )}
                            <span className="secondary-font-color register-invalid-message">{errors?.userPasswordConfirmation && errors.userPasswordConfirmation.message}</span>
                        </Form.Group>
                    </div>
                </div>
                
                <Button type="submit" className="register-submit-button primary-background-color">
                    Daftar
                </Button>

                <TermsConditionsPrivacyPolicy />
            </Form>
        }

    </div>
  )
}

export default RegisterForm