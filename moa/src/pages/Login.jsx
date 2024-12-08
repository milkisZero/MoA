import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await userLogin({ email, password });
    if (data) navigate("/");
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.loginSection}>
        <section className={styles.loginLogoSection}></section>
        <div className={styles.loginContainer}>
          <form onSubmit={handleLogin} className={styles.loginInside}>
            <h2>모아 로그인</h2>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 입력"
              required
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
            />
            <button type="submit">로그인</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
