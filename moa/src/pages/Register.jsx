import React, { useState, useEffect } from "react";
import styles from "./Register.module.css"; // module.css 불러오기
import Header from "../components/Header";
import Footer from "../components/Footer";
import { userRegister } from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const [verifyCode, setVerifyCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isVerified === false) {
      alert("메일을 인증해주세요");
      return;
    }

    console.log("회원가입 정보:", { name, email, password, confirmPassword });

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    const data = await userRegister({ name, email, password });
    if (data) {
      window.confirm("회원가입에 성공했습니다");
      navigate("/Login");
    } else {
      alert("회원가입에 실패했습니다");
    }
  };

  const handleVerify = async () => {
    console.log("인증시작");
    if (!email) {
      alert("이메일 없음");
    }
    if (email.split("@")[1] !== "ajou.ac.kr") {
      alert("아주대 메일을 사용해주세요");
      return;
    }

    setIsVerified(false);
    setTimer(300); // 5분 = 300초
    setIsTimerActive(true);

    const URL = "http://localhost:8080/api";
    try {
      const response = await fetch(URL + "/verifyMail/verificationRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleVerifyCode = async () => {
    console.log(token);
    if (Number(verifyCode) === token) {
      alert("인증되었습니다.");
      setIsVerified(true);
      setIsTimerActive(false);
    } else {
      alert("틀린 코드입니다");
    }
  };

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      setTimer(null);
      setToken("");
      alert("인증 시간이 만료되었습니다. 다시 요청해주세요.");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div>
      <Header />
      <section className={styles.registerSection}>
        <section className={styles.RegisterLogoSection}></section>
        <div className={styles.registerContainer}>
          <h2>모아 회원가입</h2>
          <form onSubmit={handleSubmit} className={styles.registerInside}>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              maxLength="50"
              required
            />
            <div className={styles.verifyContainer}>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%" }}
              />
              <button
                type="button"
                onClick={!isTimerActive ? () => handleVerify() : () => {}}
                className={styles.verifyButton}
              >
                {!isTimerActive ? "인증" : formatTime()}
              </button>
            </div>
            <div className={styles.verifyContainer}>
              <input
                type="text"
                placeholder="인증번호 확인"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={!isVerified ? () => handleVerifyCode() : () => {}}
                className={
                  isVerified
                    ? `${styles.verifyButton} active`
                    : styles.verifyButton
                }
              >
                {!isVerified ? " 확인" : "완료"}
              </button>
            </div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="5"
              required
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength="5"
              required
            />
            <button type="submit">회원가입</button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Register;
