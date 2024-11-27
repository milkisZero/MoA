import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';

function ListSection() {
    const list = [
        { title: '동아리1', info: '내가 속한 동아리의 일정을 알아보세요' },
        {
            title: '동아리2',
            info: '안녕하세요안녕하세요안녕하안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요',
        },
        { title: '동아리3', info: '안녕하세요' },
    ];

    return (
        <section className="list-section">
            <header>
                <h3>이런 동아리는 어떠신가요</h3>
                <h4>더보기</h4>
            </header>
            <div className="club-list">
                {list.map((club) => (
                    <div className="club-item">
                        <img src={tmp}></img>
                        <div>
                            <h3>{club.title}</h3>
                            <p>{club.info}</p>
                        </div>
                        <button>동아리 이동하기</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ListSection;
