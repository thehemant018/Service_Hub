import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <>
            <div className="footer">
                <img className="footer-logo" src="/images/logo.png" alt="img" />
                <span className="footer-title">Service Hub</span>
                <ul>
                    <li className="footer-list"><Link to="/">Home</Link></li>
                    <li className="footer-list"><Link to="/profsignup">Register as Professional</Link></li>
                    <li className="footer-list"><Link to="/adminlogin">Admin</Link></li>
                    <li className="footer-list"><Link to="/about">About Us</Link></li>
                    <li className="footer-list"><Link to="">Policy</Link></li>
                    <li className="footer-list"><Link to="">Login/Signup</Link></li>
                </ul>

                <h2 className="sub">Subscribe</h2>

                <div className="footer-form">
                    <input className="footer-input" type="text" placeholder="Enter your email" />
                    <button className="footer-btn">Subscribe</button>
                </div>

                <div className="horizontal">
                    <hr />
                </div>

                <div className="footer-detail">
                    <div className="detail-list">
                        <p><b>Designed by</b></p>
                        <p>HAWKS</p>
                    </div>
                    <div className="detail-list">
                        <p><b>Contact Us</b></p>
                        <p>9999888822</p>
                    </div>
                    <div className="detail-list">
                        <p><b>Address</b></p>
                        <p>A.D Patel Institute of Technology,</p>
                        <p>New V.V Nagar, Anand</p>
                    </div>

                    <div className="detail-social">
                        <Link to=""><i className="fa-brands fa-facebook" style={{ color: "#FFFFFF", backgroundColor: "black" }}></i></Link>
                        <Link to=""><i className="fa-brands fa-instagram" style={{ color: "#FFFFFF", backgroundColor: "black" }}></i></Link>
                        <Link to=""><i className="fa-brands fa-linkedin" style={{ color: "#FFFFFF", backgroundColor: "black" }}></i></Link>
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default Footer

