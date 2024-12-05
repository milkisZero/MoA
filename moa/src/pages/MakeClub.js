import React, { useState, useEffect } from 'react';
import '../css/Pages.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { addClub, updateClubInfo } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

function MakeClub() {
    const locate = useLocation();
    const club = locate.state?.club;

    const [name, setClubname] = useState(club ? club.name : '');
    const [description, setDescript] = useState(club ? club.description : '');
    const [location, setLocation] = useState(club ? club.location : '');
    const [phone, setPhone] = useState(club ? club.phone : '');
    const [sns, setSns] = useState(club ? club.sns : '');
    const [clubImg, setClubImg] = useState(club ? club.clubImg : '');
    const { userAuth } = useAuth();
    const navigate = useNavigate();
    const [preview, setPreview] = useState(club ? club.clubImg : null); // 미리보기 URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }
        const userId = userAuth._id;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('phone', phone);
        formData.append('sns', sns);
        formData.append('members', userId);
        formData.append('admin', userId);
        formData.append('img', clubImg);

        console.log(clubImg);

        const data = !club ? await addClub(formData) : await updateClubInfo({ formData, clubId: club._id });
        if (!data || !data._id) {
            alert('NULL found');
            return;
        }
        navigate(`/Detail_club/${data._id}`);
    };

    const handleImgchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setClubImg(file);
            setPreview(URL.createObjectURL(file)); // 미리보기 URL 생성
        }
    };

    const handleImgDelete = (e) => {
        e.preventDefault(); // 기본 동작 방지
        e.stopPropagation(); // 이벤트 전파 차단

        setClubImg('');
        setPreview(null);
    };

    return (
        <div>
            <Header />
            <section className="register-section">
                <div className="register-container">
                    <h2>{!club ? '신규 동아리 등록' : '동아리 정보 수정'}</h2>
                    <form onSubmit={handleSubmit} className="register-inside">
                        <label htmlFor="fileInput">
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                {preview && (
                                    <button
                                        type="button"
                                        onClick={handleImgDelete}
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            width: '30px',
                                            height: '30px',
                                            background: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            fontSize: '16px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            zIndex: 10,
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                                <img
                                    src={preview || 'https://dummyimage.com/300x300/cccccc/000000?text=Image'} // 미리보기 or placeholder
                                    alt="Club Preview"
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        marginBottom: '10px',
                                        cursor: 'pointer',
                                    }}
                                />
                            </div>
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            onChange={handleImgchange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <input
                            type="text"
                            placeholder="동아리 이름"
                            value={name}
                            onChange={(e) => setClubname(e.target.value)}
                            maxLength="50"
                            required
                        />
                        <textarea
                            type="text"
                            placeholder="동아리 설명"
                            value={description}
                            onChange={(e) => setDescript(e.target.value)}
                            maxLength="500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="동아리 위치"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            maxLength="100"
                        />
                        <input
                            type="tel"
                            placeholder="관리자 폰번호"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <input type="url" placeholder="SNS 링크" value={sns} onChange={(e) => setSns(e.target.value)} />
                        <button type="submit">등록</button>
                    </form>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default MakeClub;
