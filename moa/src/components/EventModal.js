import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from '../pages/DetailClubs/DetailClubs.module.css';

const EventModal = ({ isType, clubId, eventId, onSubmit, preData }) => {
    const toLocalTime = (utcDate) => {
        const date = new Date(utcDate);
        date.setHours(date.getHours() + 9);
        return date.toISOString().slice(0, 16);
    };
    const [formData, setFormData] = useState({
        clubId,
        title: isType === 'create' ? '' : preData.title,
        description: isType === 'create' ? '' : preData.description,
        date: isType === 'create' ? '' : toLocalTime(preData.date),
        location: isType === 'create' ? '' : preData.location,
        eventId: isType === 'create' ? '' : eventId,
    });
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        handleClose();
    };

    return (
        <div style={isType === 'create' ? {} : {}}>
            <button
                onClick={handleOpen}
                className={isType === 'create' ? styles.joinButton : ''}
                style={isType === 'create' ? { width: '10%', marginBottom: '2%', fontSize: '100%' } : {}}
            >
                {isType === 'create' ? '새 일정' : '수정'}
            </button>
            <Modal
                className="EventModal"
                appElement={document.getElementById('root')}
                isOpen={isOpen}
                onRequestClose={handleClose}
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
                <form onSubmit={handleSubmit}>
                    <h2>{isType === 'create' ? '일정 작성' : '일정 수정'}</h2>
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
                    <button type="button" onClick={handleClose}>
                        취소
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default EventModal;
