import React from 'react'

import './Footer.css';
import '../../../customGeneralStyle.css';

const FooterLinks = () => {
  return (
    <div className="footer-links-wrapper">
        <h5 style={{fontWeight: 600}}><span className="primary-font-color">Pinjam</span><span className="secondary-font-color">Can</span></h5>
        <ul className="footer-link-list primary-font-color">
            <li className="footer-link">Tentang PinjamCan</li>
            <li className="footer-link">Blog</li>
            <li className="footer-link">Syarat dan Ketentuan</li>
            <li className="footer-link">FAQ</li>
            <li className="footer-link">Bantuan</li>
            <li className="footer-link">Hubungi Kami</li>
        </ul>
    </div>
  )
}

export default FooterLinks;