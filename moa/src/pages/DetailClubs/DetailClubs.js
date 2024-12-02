import React from 'react';
import styles from './DetailClubs.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useParams } from 'react-router-dom';
import { addEvent, getClubDetail, getMonthEvent, getTotalPost } from '../../api';
import { useState, useEffect } from 'react';
import EventPopup from '../../components/EventPopup ';
import { useAuth } from '../../context/AuthContext';

// 재사용 가능한 컴포넌트: 정보 섹션
const InfoSection = ({ title, content, isLink }) => (
    <div className={styles.infoSection}>
        <h2 className={styles.infoHeading}>{title}</h2>
        {isLink ? (
            <a href={content} target="_blank" rel="noopener noreferrer" className={styles.infoText}>
                {content}
            </a>
        ) : (
            <p className={styles.infoText}>{content}</p>
        )}
    </div>
);

const Detail_club = () => {
    const { clubId } = useParams();
    const [clubDetails, setClubDetails] = useState({});
    const [events, setEvents] = useState([]);
    const [posts, setPosts] = useState([]);
    const page = 1;
    const limit = 5;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; //
    const [isEventPopup, setIsEventPopup] = useState(false);
    const { userAuth } = useAuth();
    const [isFetching, setIsFetching] = useState(false);

    const getDayOfWeek = (date) => {
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        return days[date.getDay()];
    };
    const getTime = (date) => {
        const time = date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        return time;
    };

    const handlePopupOpen = () => setIsEventPopup(true);
    const handlePopupClose = () => setIsEventPopup(false);
    const handleFormSubmit = async (event) => {
        if (!userAuth) {
            alert('회원이 아닙니다');
            return;
        }

        const data = await addEvent({
            clubId,
            userId: userAuth._id,
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
        });
        if (data) setIsFetching(true);
        //  handlePopupClose();
    };

    const fetchData = async () => {
        const club_data = await getClubDetail({ clubId });
        setClubDetails(club_data);
        console.log(club_data);

        const event_data = await getMonthEvent({ clubId, year, month });
        setEvents(event_data);
        const post_data = await getTotalPost({ clubId, page, limit });
        setPosts(post_data);
    };

    useEffect(() => {
        fetchData();
        setIsFetching(false);
    }, [isFetching]);

    // const clubDetails = {
    //     name: '동아리명',
    //     description: '동아리 한 줄 소개',
    //     location: '성호관 207호',
    //     contact: 'Tel: 010-0000-0000',
    //     sns: 'https://www.instagram.com',
    //     activities: [
    //         {
    //             id: 1,
    //             title: '2학기 정기 리액트 스터디',
    //             place: '성호관 207호',
    //             time: '17:00 ~ 19:00',
    //         },
    //     ],
    //     boardPosts: [
    //         {
    //             id: 1,
    //             title: '게시판 제목 1',
    //             content: '게시판 내용입니다. 2줄을 넘으면 ...',
    //             image: '/path/to/post-image-1.jpg',
    //         },
    //         {
    //             id: 2,
    //             title: '게시판 제목 2',
    //             content: '게시판 내용입니다. 2줄을 넘으면 ...',
    //             image: '/path/to/post-image-2.jpg',
    //         },
    //     ],
    // };

    return (
        <div className={styles.container}>
            <Header />

            {/* 동아리 헤더 */}
            <div className={styles.header}>
                <div className={styles.leftSection}>
                    <img src={clubDetails.clubImg} alt={`${clubDetails.name} 사진`} className={styles.clubImage} />
                </div>
                <div className={styles.rightSection}>
                    <h1 className={styles.clubName}>{clubDetails.name}</h1>
                    <p className={styles.clubDescription}>{clubDetails.description}</p>

                    <InfoSection title="동아리 위치" content={clubDetails.location} />
                    <InfoSection title="회장 연락처" content={clubDetails.phone} />
                    <InfoSection title="SNS" content={clubDetails.sns} isLink />

                    <button className={styles.joinButton}>동아리 가입 신청하기</button>
                </div>
            </div>

            {/* 주요 활동 사진 */}
            {/* <section>
                <h2 className={styles.sectionTitle}>동아리 주요 활동 사진</h2>
                <div className={styles.photoSection}>
                    {[1, 2, 3, 4].map((id) => (
                        <img
                            key={id}
                            src={`/path/to/image-${id}.jpg`}
                            alt={`활동 사진 ${id}`}
                            className={styles.photoItem}
                        />
                    ))}
                </div>
            </section> */}

            {/* 활동 일정 */}
            <section>
                <h2 className={styles.sectionTitle}>동아리 활동 일정</h2>
                <div>
                    <button onClick={handlePopupOpen}>새 일정 작성</button>
                    {isEventPopup && (
                        <EventPopup clubId={clubId} onSubmit={handleFormSubmit} onClose={handlePopupClose} />
                    )}
                </div>
                <div className={styles.calendarSection}>
                    {events.map((activity) => (
                        <div key={activity._id} className={styles.eventBox}>
                            <div>
                                <p>{getDayOfWeek(new Date(activity.date))}</p>
                                <p>{getTime(new Date(activity.date))}</p>
                            </div>
                            <div>
                                <h3>제목: {activity.title}</h3>
                                <p>장소: {activity.location}</p>
                                <p>날짜: {new Date(activity.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 자유 게시판 */}
            <section>
                <h2 className={styles.sectionTitle}>동아리 자유게시판</h2>
                <div className={styles.boardGrid}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.boardItem}>
                            <img src={post.postImgs} alt={post.title} className={styles.boardImage} />
                            <h4 className={styles.boardTitle}>{post.title}</h4>
                            <p className={styles.boardContent}>{post.content}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Detail_club;
