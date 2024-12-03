import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { addPost, getPost, updatedPost } from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DetailPost() {
    const location = useLocation();
    const { post } = location.state || {};

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);

    const fetchPost = async () => {
        if (post?._id) {
            try {
                const foundPost = await getPost({ postId: post._id });
                
                setTitle(foundPost.title);
                setContent(foundPost.content);
                setImages(foundPost.postImgs || []); // 이미지 URL 미리보기 설정
            } catch (error) {
                console.error('Error fetching post:', error);
                alert('게시글 정보를 불러오는 중 오류가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        fetchPost();
    }, [post]);

    return (
        <div>
            <Header />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>
                    {title}
                </h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`post-image-${index}`}
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                height: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    ))}
                </div>
                <p
                    style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.6',
                        marginTop: '20px',
                        textAlign: 'justify',
                    }}
                >
                    {content}
                </p>
            </div>
            <Footer />
        </div>
    );
}


export default DetailPost;