import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { userRegister } from '../api';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verifyMail, setVerifyMail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('회원가입 정보:', { name, email, password, confirmPassword });

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다');
            return;
        }

        const data = await userRegister({ name, email, password });
        if (data) {
            window.confirm('회원가입에 성공했습니다');
            navigate('/Login');
        } else {
            alert('회원가입에 실패했습니다');
        }
    };

    const handleVerify = async () => {
        console.log('인증시작');
        const URL = 'http://localhost:8080/api';

        let token;
        if (!email) {
            alert('이메일 없음');
        }

        try {
            const response = await fetch(URL + '/verifyMail/verificationRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                }),
            });
            const data = await response.json();
            token = data.token;
        } catch (error) {
            console.log(error.message);
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
                            maxLength="50"
                            required
                        />
                        <div style={{ width: '70%', display: 'flex', flexDirection: 'row' }}>
                            <input
                                type="email"
                                placeholder="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%' }}
                            />
                            <button type="button" onClick={() => handleVerify()} style={{ width: '20%' }}>
                                인증
                            </button>
                        </div>
                        <div style={{ width: '70%', display: 'flex', flexDirection: 'row' }}>
                            <input
                                type="text"
                                placeholder="인증번호 확인"
                                value={verifyMail}
                                onChange={(e) => setVerifyMail(e.target.value)}
                                required
                                style={{ width: '100%' }}
                            />
                            <button type="button" onClick={() => handleVerify()} style={{ width: '20%' }}>
                                확인
                            </button>
                        </div>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="5"
                            required
                        />
                        <input
                            type="password"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength="5"
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
