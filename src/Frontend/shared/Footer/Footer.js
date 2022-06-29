import React from 'react'

import Container from 'react-bootstrap/Container';
import FooterLinks from './FooterLinks';
import FooterSocials from './FooterSocials';

import './Footer.css';
import '../../../customGeneralStyle.css';

const Footer = () => {
  return (
    <Container 
      fluid 
      className="footer-container" 
      //style={{marginTop: '200px'}}
    >
        <Container>
            <div 
              className="footer" 
              style={{marginTop: '200px'}}
            >
                <FooterLinks />
                <FooterSocials />
            </div>
        </Container>
    </Container>
  )
}

export default Footer