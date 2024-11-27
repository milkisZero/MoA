import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import tmp from '../assets/sample.png';

function ItemCompo({ item }) {
    return (
        <div className="main-clubs">
            <img src={tmp}></img>
            <h3>{item.title}</h3>
            <p>{item.info}</p>
        </div>
    );
}

export default ItemCompo;
