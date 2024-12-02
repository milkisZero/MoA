import React from 'react';
import styles from './DetailClubs.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
    const clubDetails = {
        name: '동아리명',
        description: '동아리 한 줄 소개',
        location: '성호관 207호',
        contact: 'Tel: 010-0000-0000',
        sns: 'https://www.instagram.com',
        activities: [
            {
                id: 1,
                title: '2학기 정기 리액트 스터디',
                place: '성호관 207호',
                time: '17:00 ~ 19:00',
            },
        ],
        boardPosts: [
            {
                id: 1,
                title: '게시판 제목 1',
                content: '게시판 내용입니다. 2줄을 넘으면 ...',
                image: '/path/to/post-image-1.jpg',
            },
            {
                id: 2,
                title: '게시판 제목 2',
                content: '게시판 내용입니다. 2줄을 넘으면 ...',
                image: '/path/to/post-image-2.jpg',
            },
        ],
    };

    return (
        <div className={styles.container}>
            <Header />

            {/* 동아리 헤더 */}
            <div className={styles.header}>
                <div className={styles.leftSection}>
                    <img src="/path/to/club-image.jpg" alt={`${clubDetails.name} 사진`} className={styles.clubImage} />
                </div>
                <div className={styles.rightSection}>
                    <h1 className={styles.clubName}>{clubDetails.name}</h1>
                    <p className={styles.clubDescription}>{clubDetails.description}</p>

                    <InfoSection title="동아리 위치" content={clubDetails.location} />
                    <InfoSection title="회장 연락처" content={clubDetails.contact} />
                    <InfoSection title="SNS" content={clubDetails.sns} isLink />

                    <button className={styles.joinButton}>동아리 가입 신청하기</button>
                </div>
            </div>

            {/* 주요 활동 사진 */}
            <section>
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
            </section>

            {/* 활동 일정 */}
            <section>
                <h2 className={styles.sectionTitle}>동아리 활동 일정</h2>
                <div className={styles.calendarSection}>
                    {clubDetails.activities.map((activity) => (
                        <div key={activity.id} className={styles.eventBox}>
                            <div>
                                <p>목요일</p>
                                <p>14</p>
                            </div>
                            <div>
                                <h3>{activity.title}</h3>
                                <p>장소: {activity.place}</p>
                                <p>시간: {activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 자유 게시판 */}
            <section>
                <h2 className={styles.sectionTitle}>동아리 자유게시판</h2>
                <div className={styles.boardGrid}>
                    {clubDetails.boardPosts.map((post) => (
                        <div key={post.id} className={styles.boardItem}>
                            <img src={post.image} alt={post.title} className={styles.boardImage} />
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
