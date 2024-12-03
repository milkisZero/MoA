import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import ItemCompo from '../components/ItemCompo';
import tmp from '../assets/sample.png';
import ClubItem from '../components/ClubItem';

function MyPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { userAuth, userLogin } = useAuth();
    const navigate = useNavigate();

    const list = [
        {
            image: tmp,
            title: '동아리1',
        },
        { image: tmp, title: '동아리2' },
        { image: tmp, title: '동아리3' },
        { image: tmp, title: '동아리3' },
        { image: tmp, title: '동아리3' },
        { image: tmp, title: '동아리3' },
        { image: tmp, title: '동아리3' },
        { image: tmp, title: '동아리3' },
        { image: tmp, title: '동아리3' },
    ];

    return (
        <div>
            <Header />
            <div className="register-section">
                <div className="mypage-container"></div>
            </div>
            <div className="register-section">
                <div className="mypage-container">
                    {list.map((item, index) => (
                        <ItemCompo key={index} item={item}></ItemCompo>
                    ))}
                </div>
            </div>

            <div className="mypage-clubs">
                {/* {list.map((item, index) => (
                    <ItemCompo key={index} item={item}></ItemCompo>
                ))} */}
                <div className="club-list" id="mypage_msg">
                    {list.map((item, index) => (
                        <ClubItem key={index} club={item} button_text={'채팅방으로'}></ClubItem>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default MyPage;
