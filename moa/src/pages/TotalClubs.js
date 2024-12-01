import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ClubItem from '../components/ClubItem';
import { getClubInfo } from '../api';
import { Link } from 'react-router-dom';

function TotalClubs() {
    return (
        <div>
            <Header />
            <ListSection />
            <Footer />
        </div>
    );
}

function ListSection() {
    const [clubList, setclubList] = useState([]);
    const [page, setPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState([1, 2, 3, 4, 5]);
    const limit = 5;

    const fetchData = async () => {
        const data = await getClubInfo({ page, limit });
        if (data.length > 0) setclubList(data);
    };

    useEffect(() => {
        console.log(page);
        fetchData();
    }, [page]);

    const movePageNum = (num) => {
        setPage(Number(num));
    };

    const changePageNum = (num) => {
        if (pageNumbers[0] + num > 0) {
            setPageNumbers(pageNumbers.map((item) => item + num));
            setPage(pageNumbers[0] + num);
        }
    };

    return (
        <section className="list-section">
            <header>
                <h3>전체 동아리 목록</h3>
                <h4 className="clickable">
                    <Link to="/MakeClub">동아리 개설하기</Link>
                </h4>
            </header>
            <div className="club-list">
                {clubList.map((item, index) => (
                    <ClubItem key={index} club={item}></ClubItem>
                ))}
            </div>
            <div className="page-Move">
                <div onClick={() => changePageNum(-5)}>{'<'}</div>
                {pageNumbers.map((item, index) => (
                    <div key={index} onClick={() => movePageNum(item)}>
                        {item}
                    </div>
                ))}
                <div onClick={() => changePageNum(5)}>{'>'}</div>
            </div>
        </section>
    );
}

export default TotalClubs;
