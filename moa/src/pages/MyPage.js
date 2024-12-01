import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

function MyPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { userAuth, userLogin } = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <Header />
            <div className="login-section">
                <section></section>
                <div className="login-container"></div>
            </div>
            <Footer />
        </div>
    );
}

export default MyPage;
