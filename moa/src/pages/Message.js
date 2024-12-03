import React, { useState, useEffect } from 'react';
import '../css/Pages.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기
import { io } from 'socket.io-client';
import { getMessage, getMsgUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

function Message() {
    const [sendMsg, setSendMsg] = useState('');
    const [totalMsg, setTotalMsg] = useState([]);
    const [totalUser, setTotalUser] = useState([]);
    const [socket, setSocket] = useState(null);
    const [page, setPage] = useState(0);
    const [isFetching, setIsFetching] = useState(false); // 데이터가 로딩 중인지 체크
    const { userAuth } = useAuth();
    const URL = 'http://localhost:8080';
    const { roomId } = useParams();

    const userId = userAuth ? userAuth._id : null;
    const userName = userAuth ? userAuth.name : null;

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && isFetching === false) {
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

        return () => {
            observer.disconnect(); // 기존 관찰자 해제
        };
    }, []);

    const fetchData = async () => {
        if (isFetching === true) return; // 이미 데이터를 가져오고 있으면 다시 시도하지 않음
        setIsFetching(true);

        const msgId = totalMsg.length > 0 ? totalMsg[totalMsg.length - 1]._id : '';
        const data = await getMessage({ roomId, msgId });

        // 0번이 젤 나중, 마지막으로부터 10개 호출
        setTotalMsg((prev) => [...prev, ...data]);

        setIsFetching(false);
    };

    const fetchUser = async () => {
        const data = await getMsgUser({ roomId });
        return data;
    };

    useEffect(() => {
        console.log(page);
        if (page > 0) fetchData();
    }, [page]);

    useEffect(() => {
        const newSocket = io(URL);
        setSocket(newSocket);

        newSocket.emit('joinRoom', { msgRoomId: roomId });

        newSocket.on('receiveMsg', (newMsg) => {
            if (newMsg.msgRoomId === roomId) {
                setTotalMsg((prev) => [newMsg, ...prev]);
            }

            const fetchedUsers = fetchUser();
            setTotalUser((prev) => [...new Set([...prev, ...fetchedUsers])]);
        });

        return () => {
            newSocket.off('receiveMsg');
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
                senderName: userName,
            });
            setSendMsg('');
        }
    };

    return (
        <div>
            <Header />
            <section className="msg-section">
                <h2>{roomId}</h2>

                <div className="msg-info">
                    <div className="user-list">
                        {totalUser.map((prev, index) => (
                            <UserBox key={index} senderName={prev} />
                        ))}
                    </div>
                    <div className="msg-screen">
                        {totalMsg.map((msg, index) => (
                            <div key={index}>
                                <MessageBox
                                    key={index}
                                    senderName={msg.senderName}
                                    content={msg.content}
                                    timestamp={msg.timestamp}
                                />
                            </div>
                        ))}
                        <div id="observer">dddd</div>
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

function UserBox({ senderName }) {
    return (
        <div className="user-box">
            <FontAwesomeIcon icon={faUserCircle} size="2x" />
            <div className="user-info">{senderName}</div>
        </div>
    );
}

function MessageBox({ senderName, content, timestamp }) {
    const time = new Date(timestamp).toLocaleTimeString();
    return (
        <div className="msg-message">
            <UserBox senderName={senderName} />
            <p>{content}</p>
            <p>{time}</p>
        </div>
    );
}

export default Message;
