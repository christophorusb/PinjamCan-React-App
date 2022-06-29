import { React, useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';

import { Link, Outlet, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar/SearchBar';
import Footer from '../shared/Footer/Footer';
import { AiFillCaretDown, AiFillCaretUp, AiOutlineSearch } from 'react-icons/ai'
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar/Navbar.css';
import '../../customGeneralStyle.css';

const WithGuestNav = () => {
    let navigate = useNavigate()
    const [fetchedItemsData, setFetchedItemsData] = useState([]);
    const [isItemFetched, setIsItemFetched] = useState(false);
    const [filteredSearchData, setFilteredSearchData] = useState([]);
    //const [isSearching, setIsSearching] = useState(false);
    const [searchNotFoundTerm, setSearchNotFoundTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBarOnBlur, setSearchBarOnBlur] = useState(false)
    const searchBarClassName = 'data-searched-results shadow'
    const searchBarClassNameOnBlur = 'data-searched-results shadow d-none'
    const handleSearchChange = (e) => {
        //console.log(e.target.value)
        setSearchTerm(e.target.value)
        const newFilter = fetchedItemsData.filter(item => {
            return item.ItemName.toLowerCase().includes(e.target.value.toLowerCase())
        })

        if(newFilter.length === 0){
            //console.log('no data')
            setSearchNotFoundTerm(e.target.value)
        }
        else{
            //console.log('data found')
            setSearchNotFoundTerm('')
        }

        if(e.target.value === ''){
            setFilteredSearchData([])
        }else{
            setFilteredSearchData(newFilter)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        //localStorage.setItem('searchTerm', searchTerm)
        //refSearchTerm.current = localStorage.getItem('searchTerm')
        navigate(`/search/${searchTerm.replaceAll(' ', '-')}`)
    }

    const handleBlur = () => {
        //console.log('blur')
        setSearchBarOnBlur(true)
    }

    const handleFocus = () => {
       // console.log('focus')
        setSearchBarOnBlur(false)
    }

    const handleMouseDown = (itemName) => {
        navigate(`/search/${itemName.replaceAll(' ', '-')}`)
    }

    useEffect(() => {
        const URL = 'http://localhost:5000/api/items'
        axios.get(URL)
        .then(res => setFetchedItemsData(res.data.dataResponse))
        .then(() => setIsItemFetched(true))
    }, [])

  return (
      <>
        <Navbar expand="lg" 
        //className="fixed-top set-navbar-padding pt-4 pb-4 shadow-sm p-3 mb-5 bg-body rounded"
        style={
            {
                paddingLeft: '5rem', 
                paddingRight: '5rem',
                paddingTop: '1.5rem',
                paddingBottom:'1.5rem', 
                position:'sticky', 
                top:'0', 
                zIndex:'999',
                backgroundColor: '#F2F2F2',
                marginBottom:'50px'
            }}
            className="shadow"
        >
            <Navbar.Brand onClick={() => {
                navigate('/')
            }} style={{cursor: 'pointer'}}>
                <strong><span className="primary-font-color">Pinjam</span><span className="secondary-font-color">Can</span></strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="full-width justify-content-between">
                <Form onSubmit={handleSearchSubmit}>
                        <div style={{position:'relative'}}>
                            <div className="d-flex align-items-center" style={{width: '600px'}}>
                                <Form.Control 
                                    name="searchInput" 
                                    onChange={handleSearchChange} 
                                    onBlur={handleBlur}
                                    onFocus={handleFocus}
                                    className="search-input shadow-sm" 
                                    type="text" 
                                    placeholder="Mau pinjam apa hari ini?" 
                                    autoComplete='off'
                                />
                                <div>
                                    <button type="submit" className="btn search-button shadow-sm">
                                        <AiOutlineSearch style={{fontSize:'18px'}}/>
                                    </button>
                                </div>
                            </div>
                            {isItemFetched && 
                                (() => {
                                    if(searchNotFoundTerm !== ''){
                                        return(
                                        <div className={searchBarOnBlur ? searchBarClassNameOnBlur : searchBarClassName}>
                                            <div style={{padding:'10px 10px 10px 10px'}}>
                                                <p style={{margin: 0, fontStyle: "italic"}}>
                                                    hasil pencarian untuk
                                                    &nbsp; 
                                                    <span style={{fontWeight: 700}}>
                                                        "{searchNotFoundTerm}"
                                                    </span>
                                                    &nbsp; 
                                                    tidak ditemukan
                                                </p>
                                            </div>
                                        </div>
                                        )  
                                    }else{
                                        return (
                                            <div className={searchBarOnBlur ? searchBarClassNameOnBlur : searchBarClassName}>
                                                {
                                                filteredSearchData.slice(0, 10).map(itemData => (
                                                    <div key={itemData._id} className="search-result" onMouseDown={() => handleMouseDown(itemData.ItemName)}>
                                                            {itemData.ItemName}
                                                    </div>
                                                ))
                                                }
                                            </div>
                                        )
                                    }
                                })()
                            }     
                        </div>
                    </Form>

                    {/* =============================================================================================================================================== */}
                    
                    <div className="nav-links-wrapper d-flex">
                        <div>
                            <Nav.Link href="#home">Cara Kerja</Nav.Link>
                        </div>
                        <div>
                            <Link to="/login">
                                <Button variant="outline-dark" className="login-button"> 
                                    Masuk 
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="signup-button">
                                    Daftar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>

        <Outlet />

        <Footer />
        </>
  );
};

export default WithGuestNav;