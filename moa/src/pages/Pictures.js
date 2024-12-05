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
        admin: [],
        members: ['6746ee516f9b770b3f7771bf', '6746ff849cb890fe9e123acc'],
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
        const formData = new FormData();
        Object.keys(clubData).forEach((key) => {
            if (Array.isArray(clubData[key])) {
                clubData[key].forEach((item) => {
                    formData.append(key, item); // 배열의 각 항목을 개별적으로 추가
                });
            } else {
                formData.append(key, clubData[key]); // 배열이 아닌 일반 값은 그대로 추가
            }
        });
        if (image) {
            formData.append('img', image);
        }

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
                        // required
                    />
                    <button type="submit">Create Club</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Pictures;
