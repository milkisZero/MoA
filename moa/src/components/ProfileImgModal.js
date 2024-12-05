import React, { useState } from 'react';
import { editProfileImg } from '../api';
import { useAuth } from '../context/AuthContext';
import '../css/Mypage.css';

function ProfileImgModal({ currentImg, onClose, onSave }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImg, setPreviewImg] = useState(currentImg);
    const { userAuth } = useAuth();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImg(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('img', selectedFile);
            
            const newProfileImg = await editProfileImg({ userId: userAuth._id, formData });
            onSave(newProfileImg);
            alert('프로필 사진이 성공적으로 변경되었습니다!');
        } catch (error) {
            console.error('프로필 사진 변경 실패:', error);
            alert('프로필 사진 변경에 실패했습니다.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h3>프로필 사진 변경</h3>
                <img src={previewImg} alt="Preview" className="preview-img" />
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <div className="modal-actions">
                    <button onClick={handleSave} className="save-button">
                        저장
                    </button>
                    <button onClick={onClose} className="cancel-button">
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileImgModal;