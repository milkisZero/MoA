import React from 'react';
import styles from './DetailClubs.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import {
    addEvent,
    approveClub,
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
import MemListModal from '../../components/MemListModal.js';
import DatePicker from '../../components/DatePicker/DatePicker';
import ProposeModal from '../../components/ProposeModal.js';
import basicProfileImg from '../../assets/hi.png';
import loading from '../../assets/loading.gif';

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
    const [admin, setAdmin] = useState('');
    const { userAuth } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // 수정할 부분
    const page = 1;
    const limit = 5;

    const navigate = useNavigate();
    const [isClubMem, setIsClubMem] = useState(userAuth ? userAuth.clubs.includes(clubId) : false);
    const [isClubAuth, setIsClubAuth] = useState(false);
    const [isWaitingMem, setIsWaitingMem] = useState(userAuth ? userAuth.waitingClubs.includes(clubId) : false);

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

    const fetchEvent = async () => {
        const [year, month] = [selectedDate.getFullYear(), selectedDate.getMonth() + 1];
        const event_data = await getMonthEvent({ clubId, year, month });
        setEvents(event_data);
    };

    useEffect(() => {
        fetchEvent();
    }, [selectedDate.getMonth() + 1]);

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
            fetchEvent();
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
            fetchEvent();
        } else {
            alert('삭제에 실패했습니다');
        }
    };

    const fetchData = async () => {
        const club_data = await getClubDetail({ clubId });
        setClubInfo(club_data.foundClub);
        setAdmin(club_data.adminInfo);

        const post_data = await getTotalPost({ clubId, page, limit });
        setPosts(post_data);

        setIsLoading(false);
    };

    useEffect(() => {
        if (isFetching) {
            fetchData();
            setIsFetching(false);
        }
    }, [isFetching]);

    useEffect(() => {
        setIsClubMem(userAuth ? userAuth.clubs.includes(clubId) : false);
        setIsWaitingMem(userAuth ? userAuth.waitingClubs.includes(clubId) : false);
        if (clubInfo && clubInfo._id) {
            setIsClubAuth(userAuth && clubInfo ? clubInfo.admin.includes(userAuth._id) : false);
        }
    }, [clubInfo, userAuth]);

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
            userId: userAuth._id,
            clubId,
            // members: [...clubInfo.admin, userAuth._id],
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
                const data = await deletePost({ clubId, postId, userId: userAuth._id });
                alert('게시글이 삭제되었습니다.');

                // 삭제된 게시글을 제외한 나머지를 업데이트
                if (data) setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
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

    const handleApprove = async () => {
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }

        const confirmed = window.confirm('가입신청을 취소하시겠습니까?');
        if (confirmed) {
            try {
                const data = await approveClub({ clubId, userId: userAuth._id, approve: false });
                if (data) setIsWaitingMem(false);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={loading} style={{ marginTop: '100px' }} />
        </div>
    ) : (
        <div>
            <Header />
            <div className={styles.container}>
                {/* 동아리 헤더 */}
                <div className={styles.header}>
                    <div className={styles.leftSection}>
                        <img
                            src={clubInfo.clubImg || basicProfileImg}
                            alt={`${clubInfo.name} 사진`}
                            className={styles.clubImage}
                        />
                        <div className="profile-container" style={isClubAuth ? { width: '80%' } : {}}>
                            <img src={admin?.profileImg || basicProfileImg} alt="Profile" className="profile-img" />
                            <div className="profile-info">
                                <h1>회장</h1>
                                <h2>{admin?.name}</h2>
                                <p>{admin?.email}</p>
                            </div>
                            <div className="profile-info">
                                {isClubAuth && <MemListModal clubId={clubId} userList={clubInfo.members}></MemListModal>}
                                {isClubAuth && <ProposeModal clubId={clubId} userList={clubInfo.proposers}></ProposeModal>}
                                {isClubAuth && (
                                    <button
                                        className={styles.joinButton}
                                        style={{ width: '100%', margin: '0%', fontSize: '100%' }}
                                        onClick={() => handleUpdateClub()}
                                    >
                                        정보 수정
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.rightSection}>
                        <h1 className={styles.clubName}>{clubInfo.name}</h1>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}></div>
                        <p className={styles.clubDescription}>{clubInfo.description}</p>
                        <InfoSection title="동아리 위치" content={clubInfo.location} />
                        <InfoSection title="회장 연락처" content={clubInfo.phone} />
                        <InfoSection title="SNS" content={clubInfo.sns} isLink />
                        <div style={{ display: 'flex', direction: 'row' }}>
                            <button
                                className={styles.joinButton}
                                style={{
                                    width: '40%',
                                    margin: '3%',
                                    backgroundColor: isClubMem ? 'red' : isWaitingMem ? 'grey' : '#005bac',
                                }}
                                onClick={
                                    isClubMem
                                        ? () => handleGetOut()
                                        : isWaitingMem
                                        ? () => handleApprove()
                                        : () => handlePropose()
                                }
                            >
                                {isClubMem ? '탈퇴하기' : isWaitingMem ? '신청 취소' : '가입 신청'}
                            </button>

                            <button
                                className={styles.joinButton}
                                style={{ width: '40%', margin: '3%' }}
                                onClick={isClubMem ? () => goMessage(clubInfo.msgRoomId) : () => handleInquire()}
                            >
                                {isClubMem ? '채팅방으로' : '문의하기'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 활동 일정 */}
                <section>
                    <h2 className={styles.sectionTitle}>동아리 활동 일정</h2>
                    {isClubAuth && <EventModal isType={'create'} clubId={clubId} onSubmit={handleFormSubmit}></EventModal>}
                    <div className={styles.calendarSection}>
                        <DatePicker
                            selectedDate={selectedDate} // 선택된 날짜
                            setSelectedDate={setSelectedDate} // 날짜 업데이트 함수
                            totalEvents={events}
                        />
                    </div>
                    <div className={styles.boardGrid} style={{ marginBottom: '5%' }}>
                        {events
                            .filter(
                                (event) =>
                                    new Date(event.date).getMonth() === selectedDate.getMonth() &&
                                    new Date(event.date).getDate() === selectedDate.getDate()
                            )
                            .map((activity) => (
                                <div key={activity._id} className={styles.eventBox}>
                                    <div style={{ width: '40%' }}>
                                        <p>{getDayOfWeek(new Date(activity.date))}</p>
                                        <p>{getTime(new Date(activity.date))}</p>
                                        <p>{new Date(activity.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <h3>일정: {activity.title}</h3>
                                        <p>내용: {activity.description}</p>
                                        <p>장소: {activity.location}</p>
                                        {isClubAuth && (
                                            <div style={{ display: 'flex', gap: '10%', marginTop: '5%' }}>
                                                <EventModal
                                                    isType={'update'}
                                                    clubId={clubId}
                                                    eventId={activity._id}
                                                    onSubmit={handleFormUpdate}
                                                    preData={activity}
                                                ></EventModal>
                                                <button onClick={() => handleDelete(activity._id)}>삭제</button>
                                            </div>
                                        )}
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
                                <img
                                    src={post.postImgs[0] || basicProfileImg}
                                    alt={post.title}
                                    className={styles.boardImage}
                                />
                                <h4
                                    className={styles.boardTitle}
                                    style={{ WebkitLineClamp: '1', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                    {post.title}
                                </h4>
                                <p
                                    className={styles.boardContent}
                                    style={{ WebkitLineClamp: '3', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                    {post.content}
                                </p>

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
            </div>
            <Footer />
        </div>
    );
};

export default Detail_club;
