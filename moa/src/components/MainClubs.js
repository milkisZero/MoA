import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';

function MainClubs() {
    const list = [
        { title: '동아리1', info: '내가 속한 동아리의 일정을 알아보세요내가 속한 동아리의 일정을 알아보세요' },
        { title: '동아리2', info: '안녕하세요' },
        { title: '동아리3', info: '안녕하세요' },
    ];

    return (
        <div className="main-clubs-section">
            {list.map((club) => (
                <div className="main-clubs">
                    <img src={tmp}></img>
                    <h3>{club.title}</h3>
                    <p>{club.info}</p>
                </div>
            ))}
        </div>
    );
}

export default MainClubs;
