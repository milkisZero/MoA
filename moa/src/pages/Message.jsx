import React, { useState, useEffect, useRef } from "react";
import styles from "./Message.module.css"; // 모듈화된 CSS import
import Header from "../components/Header";
import Footer from "../components/Footer";
import chitoImage from "../assets/amazedchito.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import { getMessage, getMsgUser } from "../api";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

function Message() {
  const [sendMsg, setSendMsg] = useState("");
  const [totalMsg, setTotalMsg] = useState([]);
  const [totalUser, setTotalUser] = useState([]);
  const [socket, setSocket] = useState(null);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const { userAuth } = useAuth();
  const URL = "http://localhost:8081";
  const { roomId } = useParams();
  const [roomTitle, setRoomTitle] = useState("");
  const msgScreenRef = useRef(null);

  const userId = userAuth ? userAuth._id : null;
  const userName = userAuth ? userAuth.name : null;

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
    const observerTarget = document.getElementById("observer");
    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const fetchData = async () => {
    if (isFetching) return;
    setIsFetching(true);

    const msgId = totalMsg.length > 0 ? totalMsg[totalMsg.length - 1]._id : "";
    const data = await getMessage({ roomId, msgId });

    if (data) setTotalMsg((prev) => [...prev, ...data]);

    setIsFetching(false);
  };

  useEffect(() => {
    console.log(page)
    if (page > 0) fetchData();
  }, [page]);

  const fetchUser = async () => {
    const data = await getMsgUser({ roomId });
    setTotalUser(data.members);
    setRoomTitle(data.roomTitle);
  };

  useEffect(() => {
    fetchUser();

    const newSocket = io(URL);
    setSocket(newSocket);
    newSocket.emit("joinRoom", { msgRoomId: roomId });
    newSocket.on("receiveMsg", (newMsg) => {
      if (newMsg.msgRoomId === roomId) {
        setTotalMsg((prev) => [newMsg, ...prev]);
      }
      fetchUser();
    });

    return () => {
      newSocket.off("receiveMsg");
      newSocket.disconnect();
    };
  }, [roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAuth) {
      alert("로그인이 필요합니다");
      return;
    }

    if (sendMsg.trim()) {
      socket.emit("sendMsg", {
        msgRoomId: roomId,
        senderId: userId,
        content: sendMsg,
        senderName: userName,
      });
      setSendMsg("");
    }
  };

  const findProfile = (id) => {
    const found = totalUser.find((user) => user._id === id);
    return found ? found.profileImg : null;
  };

  useEffect(() => {
   }, [totalMsg]);

  return (
    <div>
      <Header />
      <section className={styles.msgSection}>
        <h2>{roomTitle}</h2>

        <div className={styles.msgInfo}>
          <div className={styles.userList}>
            {totalUser.map((user, index) => (
              <UserBox
                key={index}
                name={user.name}
                profileImg={user.profileImg}
              />
            ))}
          </div>
          <div className={styles.msgScreen} ref={msgScreenRef}>
            {totalMsg
                .map((msg, index) => (
                <div key={index}>
                  <MessageBox
                    senderName={msg.senderName}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    profileImg={findProfile(msg.senderId)}
                  />
                </div>
              ))}
            <div id="observer">_</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.msgInput}>
          <input
            type="text"
            value={sendMsg}
            onChange={(e) => setSendMsg(e.target.value)}
            placeholder="메시지를 입력하세요"
          />
          <button type="submit" className={styles.sendButton}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
}

function UserBox({ name, profileImg }) {
  return (
    <div className={styles.userBox}>
      {profileImg ? (
        <img src={profileImg} alt={name} className={styles.userIcon} />
      ) : (
        <img src={chitoImage} alt={name} className={styles.userIcon} />
      )}
      <div className={styles.userInfo}>{name}</div>
    </div>
  );
}

function MessageBox({ senderName, content, timestamp, profileImg }) {
  const time = new Date(timestamp).toLocaleTimeString();
  return (
    <div className={styles.msgMessage}>
      <UserBox name={senderName} profileImg={profileImg} />
      <p>{content}</p>
      <p>{time}</p>
    </div>
  );
}

export default Message;
