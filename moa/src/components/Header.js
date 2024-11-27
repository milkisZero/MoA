import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <span>아주대학교</span>
            <span className="clickable">
                <Link to="/Login">로그인</Link>
                <Link to="/Register ">회원가입</Link>
            </span>
        </header>
    );
}

export default Header;
