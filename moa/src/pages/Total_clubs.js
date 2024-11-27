import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ClubItem from '../components/ClubItem';

function Total_club() {
    return (
        <div>
            <Header />
            <ListSection />
            <Footer />
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
                <h3>전체 동아리 목록</h3>
            </header>
            <div className="club-list">
                {list.map((item) => (
                    <ClubItem club={item}></ClubItem>
                ))}
            </div>
        </section>
    );
}

export default Total_club;
