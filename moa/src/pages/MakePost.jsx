import React, { useState, useEffect } from "react";
import styles from "./MakePost.module.css"; // Import CSS Module
import Header from "../components/Header";
import Footer from "../components/Footer";
import { addPost, getPost, updatedPost } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MakePost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { club, post } = location.state || {};

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
        setTitle(foundPost.title);
        setContent(foundPost.content);
        setImages(foundPost.postImgs || []);
        setPreviewImages(foundPost.postImgs || []);
      } catch (error) {
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = previewImages.length + files.length;

    if (totalFiles > 10) {
      alert("최대 10개의 이미지만 업로드할 수 있습니다.");
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
      setPreviewImages((prev) => [...prev, ...urls]);
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userAuth) {
      alert("로그인이 필요합니다");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userAuth._id);
    formData.append("title", title);
    formData.append("content", content);

    images.forEach((image) => {
      if (typeof image === "string") {
        formData.append("existingImgs", image);
      } else {
        formData.append("img", image);
      }
    });

    try {
      const data = post
        ? await updatedPost({ formData, clubId: club._id, postId: post._id })
        : await addPost({ formData, clubId: club._id });

      alert(
        post
          ? "게시글이 성공적으로 수정되었습니다."
          : "게시글이 성공적으로 등록되었습니다."
      );
      navigate(`/Detail_Club/${club._id}`);
    } catch (error) {
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <h2>게시글 작성</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>제목</label>
            <input
              className={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>내용</label>
            <textarea
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className={styles.imageUploadContainer}>
            <input
              id="imgUpload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label className={styles.uploadLabel} htmlFor="imgUpload">
              이미지 추가
            </label>
            <p className={styles.imageCount}>
              선택된 파일 개수 : {previewImages.length}/10
            </p>
            <div className={styles.previewContainer}>
              {previewImages.map((src, index) => (
                <div key={index} className={styles.previewImage}>
                  <img src={src} alt={`preview-${index}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button type="submit" className={styles.submitButton}>
              게시글 등록
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default MakePost;
