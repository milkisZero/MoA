import React, { useState } from 'react';
import Modal from 'react-modal';
import ClubItem from './ClubItem';
import { approveClub } from '../api';

const ProposeModal = ({ clubId, userList }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState(userList);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleApprove = async (approve, userId, removeIdx) => {
        const data = await approveClub({ clubId, userId, approve });
        if (data) {
            setUsers(users.filter((_, index) => index !== removeIdx));
        }
    };

    return (
        <div>
            <button onClick={handleOpen}>가입요청 목록</button>
            <Modal
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
                <div className="club-list">
                    <h2>가입요청 대기 명단</h2>
                    {users.map((user, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid black',
                            }}
                        >
                            <div>{user}</div>
                            <button onClick={() => handleApprove(true, user, index)} style={{ marginLeft: '5%' }}>
                                승인
                            </button>
                            <button onClick={() => handleApprove(false, user, index)} style={{ margin: '5%' }}>
                                거절
                            </button>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default ProposeModal;
