import React, { useState } from "react";
import Modal from "react-modal";
import ClubItem from "./ClubItem";
import { approveClub, getProposer } from "../api";
import styles from "../pages/DetailClubs/DetailClubs.module.css";
import basicImg from "../assets/hi.png";

const ProposeModal = ({ clubId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const handleOpen = async () => {
    const data = await getProposer({ clubId });
    console.log(data);
    if (data) setUsers(data);
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  const handleApprove = async (approve, userId, removeIdx) => {
    if (
      window.confirm(approve ? "승인하시겠습니까?" : "거절하시겠습니까?") ===
      false
    ) {
      return;
    }

    const data = await approveClub({ clubId, userId, approve });
    if (data) {
      setUsers(users.filter((_, index) => index !== removeIdx));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <button
        onClick={handleOpen}
        className={styles.joinButton}
        style={{ width: "100%", fontSize: "100%", padding: "10px 20px" }}
      >
        가입요청 목록
      </button>
      <Modal
        appElement={document.getElementById("root")}
        isOpen={isOpen}
        onRequestClose={handleClose}
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
        <div className="club-list">
          <h2>가입요청 대기 명단</h2>
          {users.map((user, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid black",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
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
              <div style={{ width: "100%" }}>
                <p style={{ margin: 0 }}>{user.name}</p>
                <p style={{ margin: 0, color: "#555" }}>{user.email}</p>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => handleApprove(true, user._id, index)}
                  style={{
                    marginRight: "5px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  승인
                </button>
                <button
                  onClick={() => handleApprove(false, user._id, index)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  거절
                </button>
              </div>
            </li>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ProposeModal;
