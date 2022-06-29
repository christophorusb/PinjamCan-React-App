import React from 'react';
import './SearchBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchBar = () => {
    return(
        <div className="form-wrapper">
            <form className="search-bar-wrapper">
                <div>
                    <button className="search-icon-wrapper">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>

                <input className="search-input-field" type="text" placeholder="cari apapun disini" />
            </form>
        </div>
    );
}

export default SearchBar;