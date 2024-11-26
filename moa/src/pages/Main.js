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
            <ListSection />
            <Footer />
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
        { title: '동아리1', info: '내가 속한 동아리의 일정을 알아보세요내가 속한 동아리의 일정을 알아보세요' },
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

function ListSection() {
    const list = [
        { title: '동아리1', info: '내가 속한 동아리의 일정을 알아보세요' },
        {
            title: '동아리2',
            info: '안녕하세요안녕하세요안녕하안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요',
        },
        { title: '동아리3', info: '안녕하세요' },
    ];

    return (
        <section className="list-section">
            <header>
                <h3>이런 동아리는 어떠신가요</h3>
                <h4>더보기</h4>
            </header>
            <div className="club-list">
                {list.map((club) => (
                    <div className="club-item">
                        <img src={tmp}></img>
                        <div>
                            <h3>{club.title}</h3>
                            <p>{club.info}</p>
                        </div>
                        <button>동아리 이동하기</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="Footer">
            <div>
                <h4>개인정보 | 대학정보공시 | 사이트맵</h4>
                <p>16499 경기도 수원시 영통구 월드컵로 206 아주대학교 T. 031-219-2114</p>
                <p>Copyright © 2020 Ajou University. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Main;
