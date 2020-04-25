import React from 'react';

// import css
import '../Style/Footer.css';

export default class Footer extends React.Component {
    render() {
        return (
            <div className="footer-container">
                Copyright &copy; 2019-2020, <a href="/">EvidenceMiner</a>, <a href="http://dm1.cs.uiuc.edu/">Data Mining Group(DMG)@UIUC</a>
            </div>
        )
    }
}