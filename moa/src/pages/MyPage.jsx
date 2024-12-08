import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyPage, getMyEvents } from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileImgModal from "../components/ProfileImgModal.js";
import DatePicker from "../components/DatePicker/DatePicker";
import basicProfileImg from "../assets/hi.png";
import styles from "./DetailClubs/DetailClubs.module.css";
import "../css/Mypage.css";
import loading from "../assets/loading.gif";

function MyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [msgRooms, setMsgRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userAuth } = useAuth();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date()); // 초기값을 현재 날짜로 설정
  const [isLoading, setIsLoading] = useState(true);

  const getDayOfWeek = (date) => {
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return days[date.getDay()];
  };
  const getTime = (date) => {
    const time = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return time;
  };

  const fetchEvent = async () => {
    if (!userAuth || !userAuth._id) return;
    const [year, month] = [
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
    ];
    const event_data = await getMyEvents({ userId: userAuth._id, year, month });
    setEvents(event_data);
  };

  const fetchData = async () => {
    if (!userAuth?._id) return;
    try {
      const data = await getMyPage({ userId: userAuth._id });
      setName(data.user.name);
      setEmail(data.user.email);
      setProfileImg(data.user.profileImg);
      setClubs(data.clubs);
      setMsgRooms(data.msgRooms);
      if (userAuth) setIsLoading(false);
    } catch (e) {
      console.error("Failed to fetch MyPage data:", e);
    }
  };

  const goDetailPage = (clubId) => {
    if (!clubId) {
      alert("NULL found");
      return;
    }
    navigate(`/Detail_club/${clubId}`);
  };

  const goMsgRoom = (msgRoomId) => {
    if (!msgRoomId) {
      alert("NULL found");
      return;
    }
    navigate(`/Message/${msgRoomId}`);
  };

  useEffect(() => {
    fetchEvent();
  }, [selectedDate.getMonth(), userAuth]);

  useEffect(() => {
    console.log(userAuth);
    // if (!userAuth) {
    //     alert('로그인이 필요합니다');
    //     navigate('/Login');
    // }
    fetchData();
  }, [userAuth]);

  useEffect(() => {}, [isModalOpen]);

  return isLoading ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img src={loading} style={{ marginTop: "100px" }} />
    </div>
  ) : (
    <div>
      <Header />
      <section>
        <h2 style={{ textAlign: "center" }}>My프로필</h2>
        <div className="profile-section">
          <div className="profile-container">
            <img
              src={profileImg || basicProfileImg}
              alt="Profile"
              className="profile-img"
            />
            <div className="profile-info">
              <h2>{name}</h2>
              <p>{email}</p>
              <button onClick={() => setIsModalOpen(true)}>
                프로필 사진 변경하기
              </button>
            </div>
            <div className="profile-info" style={{ marginLeft: "10%" }}>
              {userAuth && (
                <h3>
                  가입일 : {new Date(userAuth.createdAt).toLocaleDateString()}
                </h3>
              )}
              <h3>내 동아리 수 : {clubs.length}</h3>
              {userAuth && (
                <h3>대기 중인 동아리 수 : {userAuth.waitingClubs.length}</h3>
              )}
            </div>
          </div>
          {isModalOpen && (
            <ProfileImgModal
              currentImg={profileImg || basicProfileImg}
              onClose={() => setIsModalOpen(false)}
              onSave={(newImg) => {
                setProfileImg(newImg);
                setIsModalOpen(false);
              }}
            />
          )}
        </div>
      </section>

      <section>
        <h2 style={{ textAlign: "center" }}>내가 속한 동아리</h2>
        <div className="mypage-list-horizontal">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="mypage-item"
              onClick={() => goDetailPage(club._id)}
            >
              <img src={club.clubImg || basicProfileImg} alt="Club" />
              <h3>{club.name}</h3>
              <p>{club.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goMsgRoom(club.msgRoomId);
                }}
              >
                단체 채팅방 이동하기
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ textAlign: "center" }}>내가 속한 문의방</h2>
        <div className="msgroom-list-horizontal">
          {msgRooms.map((msgRoom) => (
            <div
              key={msgRoom._id}
              className="msgroom-item"
              onClick={(e) => {
                e.stopPropagation();
                goMsgRoom(msgRoom._id);
              }}
            >
              <h3>{msgRoom.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>동아리 활동 일정</h2>
        <div className={styles.calendarSection}>
          <DatePicker
            selectedDate={selectedDate} // 선택된 날짜
            setSelectedDate={setSelectedDate} // 날짜 업데이트 함수
            totalEvents={events}
          />
        </div>
        <div className={styles.boardGrid} style={{ marginBottom: "5%" }}>
          {events
            .filter(
              (event) =>
                new Date(event.date).getMonth() === selectedDate.getMonth() &&
                new Date(event.date).getDate() === selectedDate.getDate()
            )
            .map((activity) => (
              <div key={activity._id} className={styles.eventBox}>
                <div>
                  <p>{getDayOfWeek(new Date(activity.date))}</p>
                  <p>{getTime(new Date(activity.date))}</p>
                  <p>날짜: {new Date(activity.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3>제목: {activity.title}</h3>
                  <p>설명: {activity.description}</p>
                  <p>장소: {activity.location}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default MyPage;
