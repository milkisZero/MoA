import React, { useState, useEffect } from 'react';
import '../css/Pages.css';

function ItemCompo({ item }) {
    return (
        <div className="main-clubs">
            <img src={item.image}></img>
            <h3>{item.title}</h3>
            <p>{item.info}</p>
        </div>
    );
}

export default ItemCompo;
