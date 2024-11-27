import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { userRegister } from '../api';

function Register() {
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('회원가입 정보:', { name, email, password, confirmPassword });

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다');
            return;
        }

        try {
            await userRegister({ name, email, password });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <Header />
            <section className="register-section">
                <div className="register-container">
                    <h2>회원가입</h2>
                    <form onSubmit={handleSubmit} className="register-inside">
                        <input
                            type="text"
                            placeholder="이름"
                            value={name}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit">회원가입</button>
                    </form>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Register;
