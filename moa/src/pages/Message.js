import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ClubItem from '../components/ClubItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기
import { io } from 'socket.io-client';

function Message() {
    const [sendMsg, setSendMsg] = useState('');
    const [totalMsg, setTotalMsg] = useState([]);
    const [page, setPage] = useState(0);
    const [totalUser, setTotalUser] = useState([]);
    const roomId = '67495c33ac807b6a451308d6';
    const userId = '6746ee516f9b770b3f7771bf';
    const [socket, setSocket] = useState(null);

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0,
        });
        const observerTarget = document.getElementById('observer');
        if (observerTarget) {
            observer.observe(observerTarget);
        }
    }, []);

    useEffect(() => {
        if (page > 0) {
            // setTotalMsg((prevMsg) => [...prevMsg, 'x']);
        }
    }, [page]);

    useEffect(() => {
        const newSocket = io('http://localhost:8080'); // 서버 주소
        setSocket(newSocket);

        newSocket.emit('joinRoom', { msgRoomId: roomId });

        newSocket.on('receiveMsg', ({ msgRoomId, senderId, content, timestamp }) => {
            if (msgRoomId === roomId) {
                setTotalMsg((prev) => [{ senderId, content, timestamp }, ...prev]);
            }
            setTotalUser((prev) => (prev.includes(senderId) ? prev : [...prev, senderId]));
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sendMsg.trim()) {
            socket.emit('sendMsg', {
                msgRoomId: roomId,
                senderId: userId,
                content: sendMsg,
            });
            setSendMsg('');
        }
    };

    return (
        <div>
            <Header />
            <section className="msg-section">
                <h2>동아리 채팅방입니다</h2>

                <div className="msg-info">
                    <div className="user-list">
                        {totalUser.map((prev, index) => (
                            <UserBox key={index} senderId={prev} />
                        ))}
                    </div>
                    <div className="msg-screen">
                        {totalMsg.map((msg, index) => (
                            <div key={index}>
                                <MessageBox
                                    key={index}
                                    senderId={msg.senderId}
                                    content={msg.content}
                                    timestamp={msg.timestamp}
                                />
                            </div>
                        ))}
                        <div id="observer"></div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="msg-input">
                    <input type="text" value={sendMsg} onChange={(e) => setSendMsg(e.target.value)} />
                    <button type="submit" className="send-button">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </form>
            </section>
            <Footer />
        </div>
    );
}

function UserBox({ senderId }) {
    return (
        <div className="user-box">
            <FontAwesomeIcon icon={faUserCircle} size="2x" />
            <div className="user-info">{senderId}</div>
        </div>
    );
}

function MessageBox({ senderId, content, timestamp }) {
    const time = new Date(timestamp).toLocaleTimeString();
    return (
        <div className="msg-message">
            <UserBox senderId={senderId} />
            <p>{content}</p>
            <p>{time}</p>
        </div>
    );
}

export default Message;
