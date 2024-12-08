import React from "react";
import styles from "./Header.module.css"; // 모듈화된 CSS import
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AjouLogo from "../assets/mainlogo.png";

function Header() {
  const { userAuth, userLogout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    await userLogout();
  };

  return (
    <header className={styles.header}>
      <img src={AjouLogo} alt="아주대학교" className={styles.logo} />
      <span className={styles.clickable}>
        <Link className={styles.MOA} to="/">
          MOA
        </Link>
      </span>

      {!userAuth ? (
        <span className={styles.clickable}>
          <Link to="/Login">로그인</Link>
          <Link to="/Register">회원가입</Link>
        </span>
      ) : (
        <span className={styles.clickable}>
          <Link to="" style={{ cursor: "auto" }}>
            {userAuth.name}
          </Link>
          <Link to="/MyPage">마이페이지</Link>
          <Link to="/" onClick={handleLogout}>
            로그아웃
          </Link>
        </span>
      )}
    </header>
  );
}

export default Header;
