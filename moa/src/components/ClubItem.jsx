import React from "react";
import { useNavigate } from "react-router-dom";
import basicProfileImg from "../assets/hi.png";
import styles from "./ClubItem.module.css"; // CSS 모듈 파일을 import

function ClubItem({ club, button_text }) {
  const navigate = useNavigate();

  const goDetailPage = () => {
    if (!club._id) {
      alert("NULL found");
      return;
    }
    navigate(`/Detail_club/${club._id}`);
  };

  return (
    <div className={styles.clubItem}>
      <img
        src={club.clubImg || basicProfileImg}
        alt={club.name}
        className={styles.clubItemImg}
      />
      <div className={styles.clubItemContent}>
        <div className={styles.clubItemMain}>
          <h3 className={styles.clubItemTitle}>{club.name}</h3>
          <p className={styles.clubItemDescription}>{club.description}</p>
        </div>
        <button onClick={goDetailPage} className={styles.clubItemButton}>
          {button_text}
        </button>
      </div>
    </div>
  );
}

export default ClubItem;
