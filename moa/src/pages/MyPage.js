import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyPage, getMyEvents } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ItemCompo from '../components/ItemCompo';
import ClubItem from '../components/ClubItem';
import tmp from '../assets/sample.png';
import '../css/Mypage.css';

function MyPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [msgRooms, setMsgRooms] = useState([]);
    const [year, setYear] = useState(2024);
    const [month, setMonth] = useState(12);
    const { userAuth } = useAuth();
    const navigate = useNavigate();

    async function fetchData()  {
        if (!userAuth?._id) return;
        try {
            const data = await getMyPage({ userId: userAuth._id });
            setName(data.user.name);
            setEmail(data.user.email);
            setProfileImg(data.user.profileImg);
            setClubs(data.clubs);
            setMsgRooms(data.msgRooms);

            const events = await getMyEvents({ userId: userAuth._id, year, month });
            console.log(events);
            setEvents(events);
        } catch (e) {
            console.error('Failed to fetch MyPage data:', e);
        }
    };

    const goDetailPage = (clubId) => {
        if (!clubId) {
            alert('NULL found');
            return;
        }
        navigate(`/Detail_club/${clubId}`);
    };

    const goMsgRoom = (msgRoomId) => {
        if (!msgRoomId) {
            alert('NULL found');
            return;
        }
        navigate(`/Message/${msgRoomId}`)
    }

    useEffect(() => {
        fetchData();
    }, [userAuth]);

    const list = [
        { image: tmp, title: '동아리1' },
        { image: tmp, title: '동아리2' },
        { image: tmp, title: '동아리3' },
    ];

    return (
        <div>
            <Header />
            <section>
                <h2 style={{ textAlign: 'center'}}>My프로필</h2>
                <div className="profile-section">
                    <div className="profile-container">
                        <img src={profileImg || tmp} alt="Profile" className="profile-img" />
                        <div className="profile-info">
                            <h2>{name}</h2>
                            <p>{email}</p>
                            <button
                                className="edit-button"
                                onClick={() => navigate('/edit-profile')}
                            >
                                회원 정보 수정하기
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            
            <section>
                <h2 style={{ textAlign: 'center'}}>내가 속한 동아리</h2>
                <div className="mypage-list-horizontal">
                    {clubs.map((club) => (
                        <div key={club._id} className="mypage-item" onClick={() => goDetailPage(club._id)}>   
                            <img src={club.clubImg || 'https://dummyimage.com/300x300/cccccc/000000?text=none'} alt="Club"/>
                            <h3>{club.name}</h3>
                            <p style={{ WebkitLineClamp: '1', overflow: 'hidden', textOverflow: 'ellipsis' }}>{club.description}</p>
                            <button onClick={(e) => { e.stopPropagation(); goMsgRoom(club.msgRoomId);}}>단체 채팅방 이동하기</button>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 style={{ textAlign: 'center'}}>내가 속한 문의방</h2>
                <div className="msgroom-list-horizontal">
                    {msgRooms.map((msgRoom) => (
                        <div key={msgRoom._id} className="msgroom-item" onClick={(e) => { e.stopPropagation(); goMsgRoom(msgRoom._id);}}>   
                            <h3>{msgRoom.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 style={{ textAlign: 'center'}}>My 일정</h2>
                <div className="event-list-horizontal">
                    {events.map((event) => (
                        <div key={event._id} className="event-item">
                            <h3 style={{ WebkitLineClamp: '1', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</h3>
                            <p style={{ WebkitLineClamp: '1', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.description}</p>
                            <p style={{ WebkitLineClamp: '1', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.date}</p>
                            <p style={{ WebkitLineClamp: '1', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.location}</p>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default MyPage;
