import React, { useState, useEffect } from 'react';
import '../css/Pages.css';

function ItemCompo({ item }) {
    return (
        <div className="main-clubs">
            <img src={item.clubImg}></img>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
        </div>
    );
}

export default ItemCompo;
