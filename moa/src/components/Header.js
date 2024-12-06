import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
    const { userAuth, userLogout } = useAuth();

    const handleLogout = async (e) => {
        e.preventDefault();
        await userLogout();
    };

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
                    <Link to="" style={{ cursor: 'auto' }}>
                        {userAuth.name}
                    </Link>
                    <Link to="/MyPage">마이페이지</Link>
                    <Link to="/" onClick={handleLogout}>
                        로그아웃
                    </Link>
                </span>
            )}
        </header>
    );
}

export default Header;
