import React from 'react';
import styles from './DetailClubs.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import {
    addEvent,
    deleteClub,
    deleteEvent,
    deletePost,
    getClubDetail,
    getMonthEvent,
    getOutClub,
    getTotalPost,
    makeMsgRoom,
    proposeClub,
    updateEvent,
} from '../../api';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import EventModal from '../../components/EventModal.js';
import DatePicker from '../../components/DatePicker/DatePicker';
import ProposeModal from '../../components/ProposeModal.js';

// 재사용 가능한 컴포넌트: 정보 섹션
const InfoSection = ({ title, content, isLink }) => (
    <div className={styles.infoSection}>
        <h2 className={styles.infoHeading}>{title}</h2>
        {isLink ? (
            <a href={content} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                {content}
            </a>
        ) : (
            <p className={styles.infoText}>{content}</p>
        )}
    </div>
);

const Detail_club = () => {
    const { clubId } = useParams();
    const [clubInfo, setClubInfo] = useState({});
    const [events, setEvents] = useState([]);
    const [posts, setPosts] = useState([]);
    const { userAuth } = useAuth();
    const [isFetching, setIsFetching] = useState(true);

    // 수정할 부분
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; //
    const page = 1;
    const limit = 5;

    const navigate = useNavigate();
    // const [roomId, setRoomId] = useState();
    const [isClubMem, setIsClubMem] = useState(userAuth ? userAuth.clubs.includes(clubId) : false);
    const [isClubAuth, setIsClubAuth] = useState(false);
    const [isWaitingMem, setIsWaitingMem] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date()); // 초기값을 현재 날짜로 설정

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

    const handleFormUpdate = async (event) => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        } else if (!isClubMem) {
            alert('회원이 아닙니다');
            return;
        }

        const data = await updateEvent({
            clubId,
            userId: userAuth._id,
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            eventId: event.eventId,
        });
        if (data) {
            setIsFetching(true);
        } else {
            alert('수정에 실패했습니다');
        }
    };
    const handleFormSubmit = async (event) => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        } else if (!isClubMem) {
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
        if (data) {
            setIsFetching(true);
        } else {
            alert('작성에 실패했습니다');
        }
    };
    const handleDelete = async (eventId) => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        } else if (!isClubMem) {
            alert('회원이 아닙니다');
            return;
        }
        if (window.confirm('삭제하시겠습니까?') === false) return;
        const data = await deleteEvent({ clubId, eventId, userId: userAuth._id });
        if (data) {
            setIsFetching(true);
        } else {
            alert('삭제에 실패했습니다');
        }
    };

    const fetchData = async () => {
        const club_data = await getClubDetail({ clubId });
        setClubInfo(club_data);
        console.log(club_data);
        const event_data = await getMonthEvent({ clubId, year, month });
        setEvents(event_data);
        const post_data = await getTotalPost({ clubId, page, limit });
        setPosts(post_data);
    };

    useEffect(() => {
        if (isFetching) {
            fetchData();
            setIsFetching(false);
        }
        setIsClubMem(userAuth ? userAuth.clubs.includes(clubId) : false);
        setIsClubAuth(userAuth && clubInfo._id ? clubInfo.admin.includes(userAuth._id) : false);
        setIsWaitingMem(userAuth ? userAuth.waitingClubs.includes(clubId) : false);
    }, [userAuth, isFetching]);

    const goMessage = (roomId) => {
        if (!roomId) {
            alert('NULL found');
            return;
        }
        navigate(`/Message/${roomId}`);
    };

    const handleGetOut = async () => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        } else if (!isClubMem) {
            alert('회원이 아닙니다');
            return;
        }
        if (window.confirm('탈퇴하시겠습니까?') === false) return;
        const data = await getOutClub({ clubId, members: [userAuth._id] });
        if (data) {
            setIsClubMem(false);
        } else {
            alert('탈퇴에 실패했습니다');
        }
    };

    const handleInquire = async () => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }

        const data = await makeMsgRoom({
            name: clubInfo.name + ' 문의방',
            members: [...clubInfo.admin, userAuth._id],
        });
        if (data) {
            goMessage(data._id);
        } else {
            alert('문의방 형성에 실패했습니다');
        }
    };

    const handleDeleteClub = async () => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }
        if (window.confirm('동아리를 삭제하시겠습니까?') === false) return;
        if (window.confirm('동아리를 정말 삭제하시겠습니까?') === false) return;

        const data = await deleteClub({
            clubId,
        });
        if (data) {
            alert('동아리가 삭제되었습니다');
            navigate('/');
        } else {
            alert('동아리 삭제에 실패했습니다');
        }
    };

    const handleUpdateClub = async () => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }

        navigate('/MakeClub', { state: { club: clubInfo } });
    };

    const handleAddPost = async () => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }

        navigate('/MakePost', { state: { club: clubInfo } });
    };

    const handleEditPost = async (post) => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }

        navigate('/MakePost', { state: { club: clubInfo, post } });
    };

    const handleDeletePost = async (postId) => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }

        const confirmed = window.confirm('이 게시글을 삭제하시겠습니까?');
        if (confirmed) {
            try {
                await deletePost({ clubId, postId, userId: userAuth._id });
                alert('게시글이 삭제되었습니다.');

                // 삭제된 게시글을 제외한 나머지를 업데이트
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('게시글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleViewPost = (post) => {
        navigate(`/DetailPost/${post._id}`, { state: { post } });
    };

    const handlePropose = async () => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }

        const confirmed = window.confirm('동아리에 가입요청을 보내시겠습니까?');
        if (confirmed) {
            try {
                const data = await proposeClub({ clubId, userId: userAuth._id });
                console.log(data);
                if (data) setIsWaitingMem(true);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    return (
        <div className={styles.container}>
            <Header />
            {/* 동아리 헤더 */}
            <div className={styles.header}>
                <div className={styles.leftSection}>
                    <img
                        src={clubInfo.clubImg || 'https://dummyimage.com/300x300/cccccc/000000?text=none'}
                        alt={`${clubInfo.name} 사진`}
                        className={styles.clubImage}
                    />
                    {isClubAuth && (
                        <button
                            className={styles.joinButton}
                            style={{ width: '20%', margin: '3%', fontSize: '100%' }}
                            onClick={() => handleUpdateClub()}
                        >
                            정보 수정
                        </button>
                    )}
                    {isClubAuth && <ProposeModal clubId={clubId} userList={clubInfo.proposers}></ProposeModal>}
                </div>

                <div className={styles.rightSection}>
                    <h1 className={styles.clubName}>{clubInfo.name}</h1>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}></div>
                    <p className={styles.clubDescription}>{clubInfo.description}</p>
                    <InfoSection title="동아리 위치" content={clubInfo.location} />
                    <InfoSection title="회장 연락처" content={clubInfo.phone} />
                    <InfoSection title="SNS" content={clubInfo.sns} isLink />
                    <div style={{ display: 'flex', direction: 'row' }}>
                        {isClubMem ? (
                            <button
                                className={styles.joinButton}
                                style={{ width: '40%', margin: '3%', backgroundColor: 'red' }}
                                onClick={() => handleGetOut()}
                            >
                                탈퇴하기
                            </button>
                        ) : isWaitingMem ? (
                            <button
                                className={styles.joinButton}
                                style={{ width: '40%', margin: '3%', backgroundColor: 'grey' }}
                            >
                                가입 대기
                            </button>
                        ) : (
                            <button
                                className={styles.joinButton}
                                style={{ width: '40%', margin: '3%' }}
                                onClick={() => handlePropose()}
                            >
                                가입 신청
                            </button>
                        )}
                        {isClubMem ? (
                            <button
                                className={styles.joinButton}
                                style={{ width: '40%', margin: '3%' }}
                                onClick={() => goMessage(clubInfo.msgRoomId)}
                            >
                                채팅방으로
                            </button>
                        ) : (
                            <button
                                className={styles.joinButton}
                                style={{ width: '40%', margin: '3%' }}
                                onClick={() => handleInquire()}
                            >
                                문의하기
                            </button>
                        )}
                    </div>
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

            <DatePicker
                selectedDate={selectedDate} // 선택된 날짜
                setSelectedDate={setSelectedDate} // 날짜 업데이트 함수
            />
            <div className="mt-4">
                <p>선택된 날짜: {selectedDate.toLocaleDateString()}</p>
            </div>
            {/* 활동 일정 */}
            <section>
                <h2 className={styles.sectionTitle}>동아리 활동 일정</h2>
                {isClubAuth && <EventModal isType={'create'} clubId={clubId} onSubmit={handleFormSubmit}></EventModal>}
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
                                <div>
                                    <EventModal
                                        isType={'update'}
                                        clubId={clubId}
                                        eventId={activity._id}
                                        onSubmit={handleFormUpdate}
                                        preData={activity}
                                    ></EventModal>
                                    <button onClick={() => handleDelete(activity._id)}>삭제</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* 자유 게시판 */}
            <section>
                <h2 className={styles.sectionTitle}>동아리 자유게시판</h2>
                {isClubAuth && (
                    <button
                        className={styles.joinButton}
                        style={{ margin: '3% 0', fontSize: '100%' }}
                        onClick={() => handleAddPost()}
                    >
                        동아리 게시글 작성
                    </button>
                )}
                <div className={styles.boardGrid}>
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className={styles.boardItem}
                            onClick={() => handleViewPost(post)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={post.postImgs[0]} alt={post.title} className={styles.boardImage} />
                            <h4 className={styles.boardTitle}>{post.title}</h4>
                            <p className={styles.boardContent}>{post.content}</p>

                            {isClubAuth && (
                                <div style={{ marginTop: '10px' }}>
                                    <button
                                        className={styles.editButton}
                                        style={{
                                            marginRight: '5px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            padding: '5px 10px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditPost(post);
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        style={{
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            padding: '5px 10px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePost(post._id);
                                        }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {isClubAuth && (
                    <button
                        className={styles.joinButton}
                        style={{ width: '10%', margin: '3%', fontSize: '100%', backgroundColor: 'red' }}
                        onClick={() => handleDeleteClub()}
                    >
                        동아리삭제
                    </button>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Detail_club;
