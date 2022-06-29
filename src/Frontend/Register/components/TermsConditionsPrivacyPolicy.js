import React from 'react'
import {Link} from 'react-router-dom'
import '../pages/Register.css';
import '../../../customGeneralStyle.css'

const TermsConditionsPrivacyPolicy = () => {
  return (
    <div>
         <p style={{marginBlock:0, marginTop:"2em", textAlign:"center", fontSize: "0.8em"}}>
            Dengan mendaftar, saya menyetujui {' '}
            <Link to="/terms-and-conditions" className="link-to-terms-and-conditions secondary-font-color">
                Syarat dan Ketentuan
            </Link>
            {' '}
            serta {' '}
            <Link to="/privacy-policy" className="link-to-privacy-policy secondary-font-color">
                Kebijakan Privasi
            </Link>
        </p>
    </div>
  )
}

export default TermsConditionsPrivacyPolicy