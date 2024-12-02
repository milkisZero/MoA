import React from "react";
import { Link } from "react-router-dom";
import "../css/Pages.css";

function ClubItem({ club }) {
  return (
    <div className="club-item">
      <img src={club.image} alt={`${club.title} 이미지`} />
      <div>
        <h3>{club.title}</h3>
        <p>{club.info}</p>
      </div>
      <button className="clickable">
        <Link to="/DetailClub">동아리 이동하기</Link>
      </button>
    </div>
  );
}

export default ClubItem;
