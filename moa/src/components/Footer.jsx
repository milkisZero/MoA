import React from "react";
import AjouFooter from "../assets/Ajou.png"; // 이미지 경로
import styles from "./Footer.module.css"; // 모듈화된 CSS import

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <img src={AjouFooter} alt="아주대학교 로고" className={styles.logo} />
        <div className={styles.textContent}>
          <h4>개인정보 | 대학정보공시 | 사이트맵</h4>
          <p>
            16499 경기도 수원시 영통구 월드컵로 206 아주대학교 T. 031-219-2114
          </p>
          <p>Copyright © 2020 Ajou University. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
