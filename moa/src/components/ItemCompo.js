import React, { useState, useEffect } from 'react';
import '../css/Pages.css';

function ItemCompo({ item }) {
    return (
        <div className="main-clubs">
            <img src={item.clubImg || 'https://dummyimage.com/300x300/cccccc/000000?text=none'}></img>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
        </div>
    );
}

export default ItemCompo;
