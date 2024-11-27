import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ClubItem from '../components/ClubItem';
import ItemCompo from '../components/ItemCompo';

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
            {list.map((item) => (
                <ItemCompo item={item}></ItemCompo>
            ))}
        </div>
    );
}

function ListSection() {
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
                <h4>더보기</h4>
            </header>
            <div className="club-list">
                {list.map((item) => (
                    <ClubItem club={item}></ClubItem>
                ))}
            </div>
        </section>
    );
}

export default Main;
