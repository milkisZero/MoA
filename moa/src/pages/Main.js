import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ClubItem from '../components/ClubItem';
import ItemCompo from '../components/ItemCompo';
import { getClubInfo } from '../api';

function Main() {
    return (
        <div>
            <Header />
            <section className="main-section">
                <h1>동아리를 위한 공간</h1>
                <p>한 눈에 알아보는 동아리의 정보와</p>
                <p>내가 속한 동아리의 일정을 알아보세요</p>
            </section>
            <MainClubs />
            <ListSection />
            <Footer />
        </div>
    );
}

function MainClubs() {
    const list = [
        {
            image: tmp,
            title: '동아리1',
            info: '내가 속한 동아리의 일정을 알아보세요내가 속한 동아리의 일정을 알아보세요',
        },
        { image: tmp, title: '동아리2', info: '안녕하세요' },
        { image: tmp, title: '동아리3', info: '안녕하세요' },
    ];

    return (
        <div className="main-clubs-section">
            {list.map((item, index) => (
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
        const data = await getClubInfo({ page, limit });
        setclubList(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const list = [
        { image: tmp, title: '동아리1', info: '내가 속한 동아리의 일정을 알아보세요' },
        {
            image: tmp,
            title: '동아리2',
            info: '안녕하세요안녕하세요안녕하안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요',
        },
        { image: tmp, title: '동아리3', info: '안녕하세요' },
    ];

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
