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
    const [socket, setSocket] = useState(null);
    const [totalUser, setTotalUser] = useState([]);
    const roomId = '67495c33ac807b6a451308d6';
    const senderId = '6746ee516f9b770b3f7771bf';

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
        const newSocket = io('http://localhost:8080');
        setSocket(newSocket);
        newSocket.on('receiveMsg', (senderId, content) => {
            setTotalMsg((prev) => [...prev, { msg: content, userInfo: senderId }]);
            setTotalUser((prev) => (!prev.includes(senderId) ? [...prev, senderId] : prev));
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sendMsg.trim()) {
            socket.emit('sendMsg', {
                roomId,
                senderId: senderId,
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
                        {totalUser.map((index, prev) => (
                            <UserBox index={index} userInfo={prev} />
                        ))}
                    </div>
                    <div className="msg-screen">
                        {totalMsg.map((msg, userId, index) => (
                            <div key={index}>
                                <div className="msg-message">
                                    <UserBox index={index} userInfo={userId} />
                                    <p>{msg}</p>
                                </div>
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

function UserBox({ index, userInfo }) {
    return (
        <div className="user-box" key={index}>
            <FontAwesomeIcon icon={faUserCircle} size="2x" />
            <div className="user-info">유저:{userInfo}</div>
        </div>
    );
}

export default Message;
