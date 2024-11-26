import React, { useState, useEffect } from 'react';
import '../css/Main.css';
import tmp from '../assets/sample.png';

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
        </div>
    );
}

function Header() {
    return (
        <header>
            <span>아주대학교</span>
            <span>로그인</span>
        </header>
    );
}

function MainClubs() {
    const list = [
        { title: '동아리1', info: '내가 속한 동아리의 일정을 알아보세요' },
        { title: '동아리2', info: '안녕하세요' },
        { title: '동아리3', info: '안녕하세요' },
    ];

    return (
        <div className="main-clubs-section">
            {list.map((club) => (
                <div className="main-clubs">
                    <img src={tmp}></img>
                    <h3>{club.title}</h3>
                    <p>{club.info}</p>
                </div>
            ))}
        </div>
    );
}

export default Main;
