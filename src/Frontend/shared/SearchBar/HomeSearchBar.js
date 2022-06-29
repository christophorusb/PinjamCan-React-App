import React from 'react';
import './HomeSearchBar.css';
import Button from 'react-bootstrap/Button';

const HomeSearchBar = () => {
    return(
        <form className="mt-4">
            <div className="home-search-bar-wrapper">
                <div>
                    <button className="home-search-bar-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
                <input className="home-search-input-field" type="text" placeholder="Gitar, Kamera, Drone, Buku..." />
                <div className="home-search-btn-wrapper d-flex align-items-center">
                    <Button className="home-search-btn secondary-background-color">Cari</Button>
                </div>
            </div>
        </form>
    );
}

export default HomeSearchBar;