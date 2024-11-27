import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
    const { userAuth } = useAuth();

    return (
        <header>
            <span className="clickable">
                <span>아주대학교</span>
                <Link to="/">MOA</Link>
            </span>

            {!userAuth ? (
                <span className="clickable">
                    <Link to="/Login">로그인</Link>
                    <Link to="/Register ">회원가입</Link>
                </span>
            ) : (
                <span className="clickable">
                    <Link to="">{userAuth.name}</Link>
                    <Link to="/Login">마이페이지</Link>
                    <Link to="/Register ">로그아웃</Link>
                </span>
            )}
        </header>
    );
}

export default Header;
