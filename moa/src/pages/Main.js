import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';

import Header from '../components/Header';
import MainClubs from '../components/MainClubs';
import ListSection from '../components/ListSection';
import Footer from '../components/Footer';

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

export default Main;
