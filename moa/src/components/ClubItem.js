import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Pages.css';
import Detail_club from '../pages/DetailClubs/DetailClubs';
import { useNavigate } from 'react-router-dom';

function ClubItem({ club, button_text }) {
    const navigate = useNavigate();

    return (
        <div className="club-item">
            <img src={club.clubImg}></img>
            <div>
                <h3>{club.name}</h3>
                <p>{club.description}</p>
            </div>
            <button onClick={() => navigate(`/Detail_club/${club._id}`)}>{button_text}</button>
        </div>
    );
}

export default ClubItem;
