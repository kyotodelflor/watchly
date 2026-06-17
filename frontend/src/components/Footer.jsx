import React from "react";
import "../styles/footer.css";
import logo from "../imgs/logo.svg";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__glow footer__glow--left"></div>
            <div className="footer__glow footer__glow--center"></div>
            <div className="footer__glow footer__glow--right"></div>

            <div className="footer__container">
                <div className="footer__content">
                    <div className="footer__columns">
                        <div className="footer__column">
                            <h3>Connect With Us</h3>
                            <a href="#">Twitter</a>
                            <a href="#">Instagram</a>
                            <a href="#">Facebook</a>
                            <a href="#">YouTube</a>
                        </div>

                        <div className="footer__column">
                            <h3>Quick Links</h3>
                            <a href="#">Home</a>
                            <a href="#">About Us</a>
                            <a href="#">Contact</a>
                            <a href="#">Movies</a>
                        </div>

                        <div className="footer__column">
                            <h3>Explore More</h3>
                            <a href="#">Trending</a>
                            <a href="#">Top Movies</a>
                            <a href="#">Series</a>
                        </div>
                    </div>

                    <div className="footer__bottom-line"></div>
                </div>

                <div className="footer__brand">
                    <img src={logo} alt="Logo" className="footer__logo" />
                    <p>© Madiyar Ramazan 2025</p>
                    <p>All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;