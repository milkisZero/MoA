import React, { useState } from "react";
import Modal from "react-modal";
import { getMembers, setNewAdmin } from "../api";
import basicImg from "../assets/hi.png";
import styles from "../pages/DetailClubs/DetailClubs.module.css";

const MemListModal = ({ clubId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userList, setUserList] = useState([]);

  const handleOpen = async () => {
    const members = await getMembers({ clubId });
    setUserList(members);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!selectedUserId) {
      alert("회장으로 임명할 사용자를 선택해주세요.");
      return;
    }

    try {
      const club = await setNewAdmin({ clubId, admin: selectedUserId });
      if (club) {
        alert("회장이 성공적으로 변경되었습니다.");
        setIsOpen(false);
        window.location.reload();
      } else {
        alert("회장 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error setting new admin:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <button
        className={styles.joinButton}
        style={{
          width: "100%",
          margin: "0%",
          padding: "10px 20px",
          fontSize: "100%",
        }}
        // style={{
        //     backgroundColor: '#007bff',
        //     color: 'white',
        //     border: 'none',
        //
        //     borderRadius: '5px',
        //     cursor: 'pointer',
        // }}
        onClick={handleOpen}
      >
        회장 임명하기
      </button>

      <Modal
        appElement={document.getElementById("root")}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
          },
        }}
      >
        <div>
          <h2>동아리 멤버 목록</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {userList.map((user) => (
              <li
                key={user._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedUserId === user._id ? "#f0f8ff" : "transparent",
                  borderRadius: "5px",
                }}
                onClick={() => setSelectedUserId(user._id)}
              >
                <img
                  src={user.profileImg || basicImg}
                  alt={user.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <p style={{ margin: 0 }}>{user.name}</p>
                  <p style={{ margin: 0, color: "#555" }}>{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleSave}
            >
              임명하기
            </button>
            <button
              style={{
                backgroundColor: "#ddd",
                color: "black",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => setIsOpen(false)}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MemListModal;
