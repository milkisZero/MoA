import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ClubItem from '../components/ClubItem';
import ItemCompo from '../components/ItemCompo';
import { getClubPage } from '../api';

function Main() {
    return (
        <div>
            <Header />
            <section className="main-section" />
            <h3 style={{ textAlign: 'center', marginBottom: '0' }}>인기순 TOP3</h3>
            <MainClubs />
            <ListSection />
            <Footer />
        </div>
    );
}

function MainClubs() {
    const [clubList, setclubList] = useState([]);
    const page = 1;
    const limit = 3;

    const fetchData = async () => {
        const data = await getClubPage({ page, limit });
        setclubList(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="main-clubs-section">
            {clubList.map((item, index) => (
                <ItemCompo key={index} item={item}></ItemCompo>
            ))}
        </div>
    );
}

function ListSection() {
    const [clubList, setclubList] = useState([]);
    const page = 1;
    const limit = 5;

    const fetchData = async () => {
        const data = await getClubPage({ page, limit });
        setclubList(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <section className="list-section">
            <header>
                <h3>이런 동아리는 어떠신가요</h3>
                <h4 className="clickable">
                    <Link to="/TotalClubs">더보기</Link>
                </h4>
            </header>
            <div className="club-list">
                {clubList.map((item, index) => (
                    <ClubItem key={index} club={item} button_text={'동아리 이동하기'}></ClubItem>
                ))}
            </div>
        </section>
    );
}

export default Main;
