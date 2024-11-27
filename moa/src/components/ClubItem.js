import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';

function ClubItem({ club }) {
    return (
        <div className="club-item">
            <img src={tmp}></img>
            <div>
                <h3>{club.title}</h3>
                <p>{club.info}</p>
            </div>
            <button>동아리 이동하기</button>
        </div>
    );
}

export default ClubItem;
