import React, { useState } from 'react';

const EventPopup = ({ clubId, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        clubId,
        title: '',
        description: '',
        date: '',
        location: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // 부모 컴포넌트에 데이터 전달
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>일정 작성</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        제목:
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength="50"
                        />
                    </label>
                    <label>
                        설명:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            maxLength="500"
                        />
                    </label>
                    <label>
                        날짜:
                        <input type="date" name="date" value={formData.date} onChange={handleChange} />
                    </label>
                    <label>
                        위치:
                        <input type="text" name="location" value={formData.location} onChange={handleChange} />
                    </label>
                    <button type="submit">저장</button>
                    <button type="button" onClick={onClose}>
                        취소
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EventPopup;
