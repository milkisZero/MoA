import React, { useState, useEffect } from "react";
import "../css/Pages.css";
import tmp from "../assets/sample.png";

function Footer() {
  return (
    <footer className="Footer">
      <section className="logo-section"></section>
      <div>
        <h4>개인정보 | 대학정보공시 | 사이트맵</h4>
        <p>
          16499 경기도 수원시 영통구 월드컵로 206 아주대학교 T. 031-219-2114
        </p>
        <p>Copyright © 2020 Ajou University. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
