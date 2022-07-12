import {React, useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { Modal, message } from 'antd'
import Skeleton from '@mui/material/Skeleton';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { FaEyeSlash, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' 

const Profile = () => {
    const [isProfileLoading, setIsProfileLoading] = useState(true)
    const [userData, setUserData] = useState({})
    const [isEditProfileActive, setIsEditProfileActive] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [showNewPasswordInput, setShowNewPasswordInput] = useState(false)
    const [isOldPasswordIncorrect, setIsOldPasswordIncorrect] = useState(false)
    const formResetData = useRef({})
    let navigate = useNavigate();

    console.log(userData)

    const { register,
        control,
        handleSubmit, 
        formState: { errors }, 
        getValues,
        reset } 
        = useForm();

    const showDottedPassword = (originalPasswordLength) =>{
        let dottedPassword = ''
        for(let i = 0; i < originalPasswordLength; i++){
            dottedPassword += '•'
        }

        return dottedPassword
    }

    const toggleIsPasswordShown = () => {
        setIsPasswordShown(!isPasswordShown);
    };

    const getModifiedPhoneNumber = (phoneNumber) => {
        const phoneNumberSplitCountryCode = phoneNumber.split('+62')[1]

        return phoneNumberSplitCountryCode
    }

    const handleOldPasswordChangeEvent = (e) => {
        console.log('blur called')
        if(e.target.value.length !== 0){
            console.log(e.target.value)
            setShowNewPasswordInput(true)
        }
        else{
            setShowNewPasswordInput(false)
        }
    }

    const handleAbortEdit = () => {
        reset(formResetData.current)
        setIsEditProfileActive(false)
    }

    const handleResetPassword = () => {
        localStorage.removeItem('token')
        window.open('/reset-password', '_blank')
    }

    const handleSubmitEditProfile = (data, e) => {
        e.preventDefault()
        // console.log(data)
        setIsOldPasswordIncorrect(false)
        const modifiedForChecking = {
            ...data,
            userPhoneNumber: '+62' + data.userPhoneNumber
        }
        let changedData = {}
        
        for(let [key, value] of Object.entries(modifiedForChecking)){
            const foundKeyInUserData = Object.keys(userData).find(keyInUserData => key.toString().includes(keyInUserData.toString()))
            if(foundKeyInUserData){
                if(value === userData[foundKeyInUserData] || value === ''){
                    continue
                }
                else if(value !== userData[foundKeyInUserData]){
                    changedData[key] = value
                }
            }
        }
        if(Object.keys(changedData).length === 0){
            console.log('Nothing to update')
        }
        else{
            // console.log('data to be updated')
            // console.log(changedData)
            const hide = message.loading({ content: <strong className="secondary-font-color">Mengubah data kamu...</strong>, duration: 0})
            setIsOldPasswordIncorrect(false)
            axios({
                method: 'PUT',
                url: `${process.env.REACT_APP_URL_TO_BACKEND}/api/users/profile/edit`,
                data: changedData,
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if(res.data.statusText === 'PROFILE_UPDATED'){
                    hide()
                    Modal.success({
                        title: 'Profil berhasil diubah!',
                        onOk: () => {
                            window.location.reload()
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
                if(err.response.status === 400){
                    if(err.response.data.statusText === 'PASSWORD_NOT_MATCH'){
                        hide()
                        setIsOldPasswordIncorrect(true)
                    }
                }
            })
        }
    }

    const handleError = (errors) => {};
    const editProfileValidations = {
        userPhoneNumber:{
            pattern:{
                value: /^8[1-9][0-9]{7,10}$/,
                message: "Nomor telepon tidak benar"
            },
        },
        userEmail: {
            required: 'Email tidak boleh kosong!',
            pattern:{
                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Email tidak benar. Contoh: user@pinjamcan.com"
            }
        },
        userAddress: {
            required: 'Alamat tidak boleh kosong!',
            minLength   : {
                value   : 10,
                message : "Alamat harus lebih dari 10 karakter"
            }
        },
        userPassword_old: {
            pattern: {
                value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, //pattern: min 8 letter, at least one symbol, upper and lower case letters and a number
                message: "Password harus berisi minimal 8 karakter, mempunyai setidaknya 1 simbol, mempunyai huruf kapital, huruf kecil, dan angka"
            },
            onChange: handleOldPasswordChangeEvent
        },
        userPassword_new: {
            required: 'Password baru tidak boleh kosong!',
            pattern: {
                value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, //pattern: min 8 letter, at least one symbol, upper and lower case letters and a number
                message: "Password harus berisi minimal 8 karakter, mempunyai setidaknya 1 simbol, mempunyai huruf kapital, huruf kecil, dan angka"
            },
            validate: (value) => value !== getValues("userPassword_old") || "Password baru tidak boleh sama dengan password lama"
        },
        userPhoneNumber:{
            required: "Nomor telepon tidak boleh kosong!",
            pattern:{
                value: /^8[1-9][0-9]{7,10}$/,
                message: "Format nomor telepon tidak benar"
            },
        },
        userAddress: {
            required: "Alamat tidak boleh kosong!",
            minLength: {
                value: 10,
                message: "Alamat harus lebih dari 10 karakter"
            }
        },
    }
    //side-effect for fetching user data
    useEffect(() => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_URL_TO_BACKEND}/api/users/profile`,
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(res => {
            const dataForFormReset = {
                userEmail: res.data.dataResponse.userEmail,
                userPhoneNumber: res.data.dataResponse.userPhoneNumber.split('+62')[1],
                userAddress: res.data.dataResponse.userAddress,
            }
            formResetData.current = dataForFormReset
            setUserData(res.data.dataResponse)
        }).then(() => {
            setIsProfileLoading(false)
        })
    }, [])

  return (
    <Container>
        <div className="border p-5 shadow rounded" style={{
            position: 'absolute',
            width: '50%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            WebkitTransform: 'translate(-50%, -50%)',
        }}
        >
            <Form onSubmit={ handleSubmit(handleSubmitEditProfile, handleError) }>
                {
                    isProfileLoading ?
                    <Skeleton variant="text" height={60} className="mb-5 pb-5" />
                    :
                    <h1 className="text-center primary-font-color mb-5 pb-5 border-bottom"><strong>{userData.userFullName}</strong></h1>
                }
                
                <Row>
                    <Col>
                        <p style={{fontSize: '20px'}}><strong>E-mail</strong></p>
                    </Col>
                    {
                        isProfileLoading ? 
                        <Col>
                            <Skeleton variant="text" height={40} />
                        </Col>
                        :
                        <Col>
                        {
                            isEditProfileActive ? 
                            <Form.Group>
                                <Form.Control type="text" name='userEmail' defaultValue={userData.userEmail} {...register('userEmail', editProfileValidations.userEmail)} />
                                <span className="secondary-font-color register-invalid-message">{errors?.userEmail && errors.userEmail.message}</span>
                            </Form.Group>
                            
                            :
                            <p style={{fontSize: '20px'}}>{userData.userEmail}</p>
                        }
                        </Col>
                    }
                </Row>
                <Row>
                    <Col>
                        <p style={{fontSize: '20px'}}><strong>Password</strong></p>
                    </Col>
                    {
                        isProfileLoading ? 
                        <Col>
                            <Skeleton variant="text" height={40} />
                        </Col>
                        :
                        <Col>
                            {
                                isEditProfileActive ?
                                <div>
                                    <Form.Group className="mb-4">
                                        <Form.Control 
                                            placeHolder='Masukkan password lama kamu' 
                                            name='userPassword_old' 
                                            type={isPasswordShown ? 'text' : 'password'} 
                                            {...register('userPassword_old', editProfileValidations.userPassword_old)}
                                        />
                                        {(
                                            <Button className="eye-button" onClick={toggleIsPasswordShown}>
                                                {isPasswordShown ? <FaEyeSlash style={{color:'black'}}/> : <FaEye style={{color:'black'}}/>}
                                            </Button>
                                        )}
                                        <span className="secondary-font-color register-invalid-message">{errors?.userPassword_old && errors.userPassword_old.message}</span>
                                        <br />
                                        
                                        {isOldPasswordIncorrect && <><span className="secondary-font-color" style={{fontSize: '0.8rem'}}>Password lama kamu salah!</span> <br /><br /></>}
                                        <Button onClick={() => handleResetPassword()} className="btn-sm py-0 secondary-button-outlined " style={{fontSize: '0.8rem'}}>Lupa password kamu?</Button>
                                    </Form.Group>
                                    {
                                        showNewPasswordInput === true &&
                                        <Form.Group className="mb-4">
                                            <Form.Control placeHolder='Masukkan password baru kamu' name='userPassword_new' type={isPasswordShown ? 'text' : 'password'} {...register('userPassword_new', editProfileValidations.userPassword_new)}/>
                                            {(
                                                <Button className="eye-button" onClick={toggleIsPasswordShown}>
                                                    {isPasswordShown ? <FaEyeSlash style={{color:'black'}}/> : <FaEye style={{color:'black'}}/>}
                                                </Button>
                                            )}
                                            <span className="secondary-font-color register-invalid-message">{errors?.userPassword_new && errors.userPassword_new.message}</span>
                                            <br />
                                        </Form.Group>
                                    }
                                </div>
                                :
                                <p style={{fontSize: '20px'}}>{showDottedPassword(userData.userOriginalPasswordLength)}</p>
                            }
                        </Col>
                    }
                </Row>
                <Row>
                    <Col>
                        <p style={{fontSize: '20px'}}><strong>Nomor Telepon</strong></p>
                    </Col>
                    {
                        isProfileLoading ?
                        <Col>
                            <Skeleton variant="text" height={40} />
                        </Col>
                        :
                        <Col>
                            {
                                isEditProfileActive ?
                                <Form.Group>
                                    <div className='d-flex'>
                                        <div className='d-flex justify-content-center align-items-center' style={{border: '1px solid rgb(204, 200, 200)', paddingLeft:'5px', paddingRight:'7px', backgroundColor:'rgb(242, 241, 241)', borderRadius:'5px 0 0 5px'}}>
                                            <span>+62</span>
                                        </div>
                                        <Form.Control style={{borderLeft: 'none', borderRadius:'0 5px 5px 0'}} name='userPhoneNumber' defaultValue={getModifiedPhoneNumber(userData.userPhoneNumber)} {...register('userPhoneNumber', editProfileValidations.userPhoneNumber)}/>
                                    </div>
                                    <span className="secondary-font-color register-invalid-message">{errors?.userPhoneNumber && errors.userPhoneNumber.message}</span>
                                </Form.Group>
                                :
                                <p style={{fontSize: '20px'}}>{userData.userPhoneNumber}</p>
                            }
                        </Col>
                    }
                </Row>
                <Row>
                    <Col>
                        <p style={{fontSize: '20px'}}><strong>Alamat</strong></p>
                    </Col>
                    {
                        isProfileLoading ?
                        <Col>
                            <Skeleton variant="text" height={40} />
                        </Col>
                        :
                        <Col>
                            {
                                isEditProfileActive ?
                                <Form.Group className="mb-3" controlId="user-nik">
                                    <Form.Control style={{height: '100px'}} as ="textarea" name="userAddress" id="user-address" defaultValue={userData.userAddress} {...register('userAddress', editProfileValidations.userAddress)}/>
                                    <span className="secondary-font-color register-invalid-message">{errors?.userAddress && errors.userAddress.message}</span>
                                </Form.Group>
                                :
                                <p style={{fontSize: '20px'}}>{userData.userAddress}</p>
                            }
                        </Col>
                    }
                </Row>
                <Row>
                    <div className="d-flex justify-content-center mt-5">
                        {
                            isEditProfileActive && 
                            <Button type='submit' className="tertiary-button m-2" style={{width: '30%'}}>
                                Ubah Profil
                            </Button>
    
                        }
                        {
                            !isEditProfileActive &&
                            <Button onClick={() => setIsEditProfileActive(true)} className="tertiary-button m-2" style={{width: '30%'}}>
                                Edit Profil
                            </Button>
                        }
                    
                        {
                            isEditProfileActive &&
                            <Button onClick={() => handleAbortEdit()} className="tertiary-button-outlined m-2" style={{width: '30%'}}>Batal</Button>
                        }
                    </div>
                </Row>
            </Form>
        </div>
    </Container>
  )
}

export default Profile