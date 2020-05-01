import React from 'react';

// import css
import './styles.css';

const Footer = ({ style, linkStyle }) => {
    return (
        <div className="footer-container" style={style}>
            Copyright &copy; 2019-2020, <a href="/" style={linkStyle}>EvidenceMiner</a>, <a href="http://dm1.cs.uiuc.edu/" style={linkStyle}>Data Mining Group(DMG)@UIUC</a>
        </div>
    )
}

export default Footer;