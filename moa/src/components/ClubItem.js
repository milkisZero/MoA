import React from "react";
import { Link } from "react-router-dom";
import "../css/Pages.css";

function ClubItem({ club }) {
  return (
    <div className="club-item">
      <img src={club.clubImg}></img>
      <div>
        <h3>{club.name}</h3>
        <p>{club.description}</p>
      </div>
      <button>동아리 이동하기</button>
    </div>
  );
}

export default ClubItem;
