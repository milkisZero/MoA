import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { addPost, getPost, updatedPost } from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MakePost() {
    const navigate = useNavigate();
    const location = useLocation();
    const { club, post } = location.state || {};

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const { userAuth } = useAuth();

    useEffect(() => {
        fetchPost();
    }, [post]);

    const fetchPost = async () => {
        if (post?._id) {
            try {
                const foundPost = await getPost({ postId: post._id });
                console.log(foundPost);
                setTitle(foundPost.title);
                setContent(foundPost.content);
                setImages(foundPost.postImgs || []);
                setPreviewImages(foundPost.postImgs || []);
            } catch (error) {
                console.error('Error fetching post:', error);
                alert('게시글 정보를 불러오는 중 오류가 발생했습니다.');
            }
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const totalFiles = previewImages.length + files.length;

        if (totalFiles > 10) {
            alert('최대 10개의 이미지만 업로드할 수 있습니다.');
        }

        const validFiles = files.slice(0, 10 - previewImages.length);

        const previewUrls = validFiles.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
            });
        });

        Promise.all(previewUrls).then((urls) => {
            setPreviewImages((prev) => [...prev, ...urls]); // 기존 미리보기 이미지에 추가
        });

        setImages((prev) => [...prev, ...validFiles]); // 기존 이미지에 추가
    };

    const handleRemoveImage = (index) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index)); // 미리보기 이미지 삭제
        setImages((prev) => prev.filter((_, i) => i !== index)); // 실제 이미지 파일 삭제
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userAuth) {
            alert('로그인이 필요합니다');
            return;
        }

        const formData = new FormData();
        formData.append('userId', userAuth._id);
        formData.append('title', title);
        formData.append('content', content);

        images.forEach((image) => {
            if (typeof image === 'string') {
                // 기존 이미지 URL인 경우
                formData.append('existingImgs', image);
            } else {
                // 새로운 파일인 경우
                formData.append('img', image);
            }
        });

        try {
            const data = post
                ? await updatedPost({ formData, clubId: club._id, postId: post._id })
                : await addPost({ formData, clubId: club._id });

            console.log('Post created:', data.newPost);
            post ? alert('게시글이 성공적으로 수정되었습니다.') : alert('게시글이 성공적으로 등록되었습니다.');

            navigate(`/Detail_Club/${club._id}`);
        } catch (error) {
            console.error('Error creating post:', error);
            alert('게시글 등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <Header />
            <div className="makePost">
                <form onSubmit={handleSubmit}>
                    <h2>게시글 작성</h2>
                    <div>
                        <br></br>
                        <label>제목</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <br></br>
                        <label>내용</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <br></br>
                        <input
                            id="imgUpload" // id로 label과 연결
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }} // 숨기기
                        />
                        <label
                            htmlFor="imgUpload" // htmlFor는 연결된 input의 id
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                textAlign: 'center',
                            }}
                        >
                            이미지 추가
                        </label>
                        <p>선택된 파일 개수 : {previewImages.length}/10</p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                            {previewImages.map((src, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img
                                        src={src}
                                        alt={`preview-${index}`}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="submit">게시글 등록</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default MakePost;
