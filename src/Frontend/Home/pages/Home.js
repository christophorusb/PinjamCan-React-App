import { useEffect, useRef, React } from 'react';
import Container from 'react-bootstrap/Container';
import HomeSearchBar from '../../shared/SearchBar/HomeSearchBar'
import MainHomeImageAsset from '../components/MainHomeImageAsset';
import SecondaryHomeImageAsset from '../../Home/components/SecondaryHomeImageAsset';
import ExploreCategory from '../components/ExploreCategory';
import BenefitsCard from '../components/BenefitsCard';
import { useSelector, useDispatch } from 'react-redux'
import {  useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import './Home.css';

const Home = () =>{
    const state = useSelector(state => state.login)
    const isTokenValid = useRef(false)
    const dispatch = useDispatch()
    let navigate = useNavigate()

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
        const token = localStorage.getItem('token')
        const timeOfLogin = localStorage.getItem('timeOfLogin')
        isTokenValid.current = checkTokenValidity(token, timeOfLogin)

        if(isTokenValid.current === true){
            navigate('/home', {replace: true})    
        }
    } , [])


    return (
        <Container>
            <MainHomeImageAsset />
            <div className="first-heading-parent-wrapper">
                <div className="first-heading-wrapper">
                    <p style={{marginBottom: '20px'}} className="first-heading primary-font-color">
                        Pinjam apapun dari orang-orang di dekat kamu
                    </p>
                    <div className="first-sub-heading-wrapper">
                        <p className="first-sub-heading">
                            Pinjam barang-barang untuk keperluan <span className="secondary-font-color"><strong>hobi</strong></span> kamu sekarang juga!
                        </p>
                    </div>
                </div>
            </div>

            {/* <HomeSearchBar /> */}

            <SecondaryHomeImageAsset />

            <div className="second-heading-parent-wrapper">
                <div className="second-heading-wrapper">
                    <p className="second-heading primary-font-color">
                        Atau barang kamu lagi nganggur? Pinjamkan yuk!
                    </p>
                </div>
                <div className="second-sub-heading-wrapper">
                    <p className="second-sub-heading">
                        Pinjamkan barang kamu ke orang lain dan dapatkan keuntungannya!
                    </p>
                </div>
                <div className="mt-5">
                    <Button className="list-item-btn tertiary-button">Daftarkan barangmu sekarang</Button>
                </div>
            </div>

            <BenefitsCard />

            <ExploreCategory />

        </Container>
    )
}

export default Home;