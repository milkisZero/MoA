import React, { useState, useEffect } from "react";
import "../css/Pages.css";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userAuth, userLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인 정보:", { email, password });

    await userLogin({ email, password });
    if (!userAuth) {
      alert("로그인에 실패했습니다");
    }
  };

  return (
    <div>
      <Header />
      <div className="login-section">
        <section className="login-logo-section"></section>
        <div className="login-container">
          <form onSubmit={handleLogin}>
            <div className="login-inside">
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
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
