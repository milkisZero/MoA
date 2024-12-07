import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import { useNavigate } from 'react-router-dom';
import basicProfileImg from '../assets/hi.png';

function ItemCompo({ item }) {
    const navigate = useNavigate();

    const handlePage = (id) => {
        if (!id) {
            alert('NULL found');
            return;
        }
        navigate(`/Detail_club/${id}`);
    };

    return (
        <div className="mypage-item" onClick={() => handlePage(item._id)} style={{ cursor: 'pointer', margin: '2%' }}>
            <img src={item.clubImg || basicProfileImg}></img>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
        </div>
    );
}

export default ItemCompo;
