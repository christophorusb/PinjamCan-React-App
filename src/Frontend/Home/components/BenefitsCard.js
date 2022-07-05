import React from 'react';

import Card from 'react-bootstrap/Card';
import { IoAccessibilitySharp } from "react-icons/io5";
import { FaMoneyBillAlt } from 'react-icons/fa';
import { FaRegSmileBeam } from 'react-icons/fa';

import './BenefitsCard.css';
import '../../../customGeneralStyle.css';

const BenefitsCard = () => {
  return (
        <div className='cards-wrapper'>
            <div>
                <p className="text-center primary-font-color mb-5" style={{fontSize: '2.5rem'}}><strong>Dengan meminjam, kamu bisa :</strong></p>
            </div>
            <div className="d-flex flex-wrap justify-content-around">
                <Card style={{ width: '22rem'}} className="card-wrapper shadow">
                    <Card.Body className="d-flex align-items-center justify-content-center flex-column">
                        <Card.Title className="text-center primary-font-color">
                            <IoAccessibilitySharp className="card-icon"/>
                        </Card.Title>
                        <Card.Title className="text-center primary-font-color">Akses berbagai jenis barang dengan mudah</Card.Title>
                        <div>
                            {/* <Card.Text>
                                Lorem
                            </Card.Text> */}
                        </div>
                    </Card.Body>
                </Card>

                <Card style={{ width: '22rem'}} className="card-wrapper shadow">
                    <Card.Body className="d-flex align-items-center justify-content-center flex-column">
                        <Card.Title className="text-center primary-font-color">
                            <FaMoneyBillAlt className="card-icon" />
                        </Card.Title>
                        <Card.Title className="text-center primary-font-color">Hemat uang</Card.Title>
                        <div>
                            {/* <Card.Text>
                                Lorem
                            </Card.Text> */}
                        </div>
                    </Card.Body>
                </Card>

                <Card style={{ width: '22rem'}} className="card-wrapper shadow">
                    <Card.Body className="d-flex align-items-center justify-content-center flex-column">
                        <Card.Title className="text-center primary-font-color">
                            <FaRegSmileBeam className="card-icon" />
                        </Card.Title>   
                        <Card.Title className="text-center">Hidup lebih ringan</Card.Title>
                        <div>
                            {/* <Card.Text>
                                Lorem
                            </Card.Text> */}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
  )
}

export default BenefitsCard