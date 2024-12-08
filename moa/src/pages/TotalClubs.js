import React, { useState, useEffect } from 'react';
import styles from './TotalClubs.module.css'; // 수정된 스타일 파일 import

import Header from '../components/Header';
import Footer from '../components/Footer';
import ClubItem from '../components/ClubItem';
import { getClubPage } from '../api';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';

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
    const [clubList, setClubList] = useState([]);
    const { page: urlPage } = useParams();
    const [page, setPage] = useState(Number(urlPage));
    const [pageNumbers, setPageNumbers] = useState([1, 2, 3, 4, 5]);
    const limit = 5;
    const [totalPage, setTotalPage] = useState(5);
    const navigate = useNavigate();

    const fetchData = async () => {
        const data = await getClubPage({ page, limit });
        if (data) {
            setClubList(data.club);
            setTotalPage(Math.ceil(data.totalNum / limit));
        }
    };

    useEffect(() => {
        fetchData();
        if (Number(urlPage) !== page) {
            navigate(`/TotalClubs/${page}`); // URL 업데이트
        }
    }, [page]);

    const movePageNum = (num) => {
        if (num <= totalPage) {
            sessionStorage.setItem('page', page); // 페이지 상태 저장
            setPage(Number(num));
        }
    };

    const changePageNum = (num) => {
        if (pageNumbers[0] + num > 0 && pageNumbers[0] + num <= totalPage) {
            setPageNumbers(pageNumbers.map((item) => item + num));
            setPage(pageNumbers[0] + num);
        }
    };

    return (
        <section className={styles['list-section']}>
            <header>
                <h3>전체 동아리 목록</h3>
                <h4 className={styles['clickable']}>
                    <Link to="/MakeClub">동아리 개설하기</Link>
                </h4>
            </header>
            <div className={styles['club-list']}>
                {clubList.map((item, index) => (
                    <ClubItem key={index} club={item} button_text={'동아리 이동하기'} />
                ))}
            </div>
            <div className={styles['page-Move']}>
                <div onClick={() => changePageNum(-5)}>{'<'}</div>
                {pageNumbers.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => movePageNum(item)}
                        style={page === item ? { color: 'white', backgroundColor: 'grey' } : {}}
                    >
                        {item}
                    </div>
                ))}
                <div onClick={() => changePageNum(5)}>{'>'}</div>
            </div>
        </section>
    );
}

export default TotalClubs;
