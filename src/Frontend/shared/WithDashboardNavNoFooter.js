import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
//import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
//import Dropdown from 'react-bootstrap/Dropdown'
//import SearchBar from './SearchBar/SearchBar'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AiFillCaretDown, AiFillCaretUp, AiOutlineSearch } from 'react-icons/ai'
import { HiShoppingCart } from 'react-icons/hi'
import { FaHeart } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import {React, useState, useEffect, useRef} from 'react'
import Footer from '../shared/Footer/Footer'; 
// import { useLocation, useSearchParams } from 'react-router-dom'
import axios from 'axios'

//import '../../customGeneralStyle.css'
import './DashboardNav.css'

const WithDashboardNav = (props) => {   

    let navigate = useNavigate()
    const dispatch = useDispatch()
    const [dropDownArrowDirection, setDropDownArrowDirection] = useState('down');
    const [fetchedItemsData, setFetchedItemsData] = useState([]);
    const [isItemFetched, setIsItemFetched] = useState(false);
    const [filteredSearchData, setFilteredSearchData] = useState([]);
    //const [isSearching, setIsSearching] = useState(false);
    const [searchKeywordNotFound, setSearchKeywordNotFound] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchBarOnBlur, setSearchBarOnBlur] = useState(false)
    const searchBarClassName = 'data-searched-results shadow'
    const searchBarClassNameOnBlur = 'data-searched-results shadow d-none'
    //let isSearchBarFocused = useRef(false)
    //console.log(searchBarOnBlur)
    useEffect(() => {
        const URL = 'http://localhost:5000/api/items'
        axios.get(URL)
        .then(res => setFetchedItemsData(res.data.dataResponse))
        .then(() => setIsItemFetched(true))
    }, [])

    const handleSearchChange = (e) => {
        //console.log(e.target.value)
        setSearchKeyword(e.target.value)
        const newFilter = fetchedItemsData.filter(item => {
            return item.ItemName.toLowerCase().includes(e.target.value.toLowerCase())
        })

        if(newFilter.length === 0){
            //console.log('no data')
            setSearchKeywordNotFound(e.target.value)
        }
        else{
            //console.log('data found')
            setSearchKeywordNotFound('')
        }

        if(e.target.value === ''){
            setFilteredSearchData([])
        }else{
            setFilteredSearchData(newFilter)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if(searchKeyword !== ''){
            const keyword = searchKeyword.replaceAll(' ', '-')
            navigate(`/home/search/${keyword}`)
        }
    }

    const handleMouseDown = (itemName) => {
        const keyword = itemName.replaceAll(' ', '-')
        navigate(`/home/search/${keyword}`)
    }

    const handleBlur = () => {
        //console.log('blur')
        setSearchBarOnBlur(true)
    }

    const handleFocus = () => {
       // console.log('focus')
        setSearchBarOnBlur(false)
    }

    const handleDropdownArrow = () => {
        console.log(dropDownArrowDirection)
        if(dropDownArrowDirection === 'up'){
            setDropDownArrowDirection('down')
        }
        else{
            setDropDownArrowDirection('up')
        }
    }

    const getNavName =(name) =>{
        const modified = name.split(' ')[0]
        const navName = 'Hi, ' + modified
        return (
            <strong>{navName}</strong>
        )
    }

    const handleLogout = () =>{
        localStorage.clear();
        dispatch({type: 'LOGOUT'})
        navigate('/', {replace: true})
    }

    // console.log('filteredSearchDataState')
    // console.log(filteredSearchData)
    // console.log('searchNotFoundTerm')
    // console.log(searchNotFoundTerm)
  return (
    <>
        <Navbar expand="lg" style={
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
            <Link to="/" style={{textDecoration: 'none'}}><Navbar.Brand><strong><span className="primary-font-color">Pinjam</span><span className="secondary-font-color">Can</span></strong></Navbar.Brand></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
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
                                    if(searchKeywordNotFound !== ''){
                                        return(
                                        <div className={searchBarOnBlur ? searchBarClassNameOnBlur : searchBarClassName}>
                                            <div style={{padding:'10px 10px 10px 10px'}}>
                                                <p style={{margin: 0, fontStyle: "italic"}}>
                                                    hasil pencarian untuk
                                                    &nbsp; 
                                                    <span style={{fontWeight: 700}}>
                                                        "{searchKeywordNotFound}"
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
 
                </Nav>
                <Nav>
                    <div className="me-5" style={{display: 'flex', justifyContent:'center', alignItems:'center', cursor:'pointer'}}>
                        <div className="me-5">
                            <Link to="/product-listing" style={{textDecoration: 'none'}}>
                                <Button className="secondary-button-outlined btn-sm">Daftarkan barangmu!</Button>
                            </Link>
                        </div>
                        <div className="me-4">
                            <Link to="/cart" style={{textDecoration: 'none'}} className="me-2">
                                <HiShoppingCart className="primary-font-color cart-icon" style={{fontSize: '1.3rem'}}/>
                            </Link>
                            <Link to="/wishlist" style={{textDecoration: 'none'}} className="ms-2">
                                <FaHeart className="secondary-font-color wishlist-icon" style={{fontSize: '1.2rem'}}/>
                            </Link>
                        </div>
                        
                        <NavDropdown 
                            title={getNavName(localStorage.getItem('userFullName'))} 
                            id="user-dropdown" 
                            onClick={handleDropdownArrow} 
                        >
                            <NavDropdown.Item>
                                <Link to="/order-history" style={{textDecoration: 'none', color: '#3D4667'}}>Riwayat peminjaman</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to="/my-items" style={{textDecoration: 'none', color: '#3D4667'}}>Barangku</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to="/profile" style={{textDecoration: 'none', color: '#3D4667'}}>Profilku</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                                <Button className="btn-sm ms-3" onClick={handleLogout} variant="outline-danger">Logout</Button>
                            </NavDropdown>
                        {dropDownArrowDirection === 'up' && <AiFillCaretUp />}
                        {dropDownArrowDirection ==='down' && <AiFillCaretDown />}
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        
        <Outlet />
    </>
  )
}

export default WithDashboardNav

