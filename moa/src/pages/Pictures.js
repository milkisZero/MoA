import React, { useState } from 'react';
import '../css/Pages.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

function Pictures() {
    const [clubData, setClubData] = useState({
        name: '',
        description: '',
        location: '',
        phone: '',
        sns: '',
        admin: '',
        members: [],
    });
    const [image, setImage] = useState(null);

    const handleInputChange = (e) => {
        setClubData({
            ...clubData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(clubData);
        const formData = new FormData();
        Object.keys(clubData).forEach((key) => {
            formData.append(key, clubData[key]);
        });
        if (image) {
            formData.append('img', image);
        }
        console.log(formData);

        try {
            const response = await fetch('http://localhost:8080/api/club', {
                method: 'POST',
                body: formData, // FormData를 body로 사용
            });
            
            if (response.ok) {
                alert('Club created successfully!');
                const responseData = await response.json(); // JSON 형식으로 응답 받기
                console.log(responseData);
            } else {
                throw new Error('Failed to create club');
            }
        } catch (error) {
            console.error('Error creating club:', error);
            alert('Error creating club.');
        }
    };

    return (
        <div>
            <Header />
            <div className="content">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Club Name"
                        value={clubData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={clubData.description}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={clubData.location}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={clubData.phone}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="sns"
                        placeholder="SNS Link"
                        value={clubData.sns}
                        onChange={handleInputChange}
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                    />
                    <button type="submit">Create Club</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Pictures;
