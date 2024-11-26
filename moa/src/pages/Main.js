import React, { useState, useEffect } from 'react';
import '../css/Main.css';

function Main() {
    return (
        <div>
            <Header />
            <section className="main-section">
                <h1>동아리를 위한 공간</h1>
                <p>한 눈에 알아보는 동아리의 정보와</p>
                <p>내가 속한 동아리의 일정을 알아보세요</p>
            </section>

            <div>
                <span>안녕</span>
            </div>
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

export default Main;
