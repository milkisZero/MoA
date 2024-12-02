import React, { useState, useEffect } from 'react';
import '../css/Pages.css';

function ClubItem({ club, button_text }) {
    return (
        <div className="club-item">
            <img src={club.clubImg}></img>
            <div>
                <h3>{club.name}</h3>
                <p>{club.description}</p>
            </div>
            <button>{button_text}</button>
        </div>
    );
}

export default ClubItem;
