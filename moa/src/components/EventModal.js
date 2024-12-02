import React, { useState } from 'react';
import Modal from 'react-modal';

const EventModal = ({ clubId, onSubmit }) => {
    const [formData, setFormData] = useState({
        clubId,
        title: '',
        description: '',
        date: '',
        location: '',
    });
    const [isOpen, setIsOpen] = useState(false);
    const handlePopupOpen = () => setIsOpen(true);
    const handlePopupClose = () => setIsOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div>
            <button onClick={handlePopupOpen}>새 일정 작성</button>
            <Modal
                appElement={document.getElementById('root')}
                isOpen={isOpen}
                onRequestClose={handlePopupClose}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    content: {
                        width: '400px',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px',
                    },
                }}
            >
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
                        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} />
                    </label>
                    <label>
                        위치:
                        <input type="text" name="location" value={formData.location} onChange={handleChange} />
                    </label>
                    <button type="submit">저장</button>
                    <button type="button" onClick={handlePopupClose}>
                        취소
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default EventModal;
