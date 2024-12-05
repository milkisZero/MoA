import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import { useNavigate } from 'react-router-dom';

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
        <div className="main-clubs" onClick={() => handlePage(item._id)} style={{ cursor: 'pointer' }}>
            <img src={item.clubImg || 'https://dummyimage.com/300x300/cccccc/000000?text=none'}></img>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
        </div>
    );
}

export default ItemCompo;
