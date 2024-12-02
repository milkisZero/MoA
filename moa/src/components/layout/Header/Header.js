"use client";

import LogoIcon from "../../LogoIcon";
import { useState } from "react";
import styles from "./Header.module.css"; // CSS 모듈 파일을 사용할 경우

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header className={styles.header}>
      <LogoIcon />
      <button className={styles.loginButton} onClick={toggleLogin}>
        {isLoggedIn ? "로그아웃" : "로그인"}
      </button>
    </header>
  );
}
