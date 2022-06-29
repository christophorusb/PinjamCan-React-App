import React from 'react'

import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

import './Footer.css';
import '../../../customGeneralStyle.css';

const FooterSocials = () => {
  return (
    <div>
        <h5 className="primary-font-color" style={{fontWeight: 600, textAlign: 'right', marginRight: '10px'}}>Ikuti Kami</h5>
        <div className="footer-socials-wrapper">
            <div className="footer-social-wrapper">
                <FaFacebook className="footer-social primary-font-color"/>
            </div>
            <div className="footer-social-wrapper">
                <FaTwitter className="footer-social primary-font-color"/>
            </div>
            <div className="footer-social-wrapper">
                <FaInstagram className="footer-social primary-font-color"/>
            </div>
        </div>
    </div>
  )
}

export default FooterSocials;