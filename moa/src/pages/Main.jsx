import React, { useState, useEffect } from "react";
import "../css/Pages.css";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ClubItem from "../components/ClubItem";
import ItemCompo from "../components/ItemCompo";
import { getClubPage } from "../api";

import image1 from "../assets/banner.png";
import image2 from "../assets/ajou.jpg";
import loading from '../assets/loading.gif';

function Main() {
  return (
    <div>
      <Header />
      <MainSection />
      <h2
        style={{
          textAlign: "center",
          marginTop: "2%",
          fontSize: "1.5rem",
          fontWeight: "600",
        }}
      >
        이달의 우수 동아리 Top3
      </h2>
      <MainClubs />
      <ListSection />
      <Footer />
    </div>
  );
}

function MainSection() {
  const images = [image1, image2];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  return (
    <div>
      <section
        className="main-section"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
        }}
      />
    </div>
  );
}

function MainClubs() {
  const [clubList, setclubList] = useState([]);
  const page = 1;
  const limit = 3;
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const data = await getClubPage({ page, limit });
    if (data) {
      setclubList(data.club);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return isLoading ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img src={loading} style={{ marginTop: "100px" }} />
    </div>
  ) :(
    <div className="main-clubs-section">
      {clubList.map((item, index) => (
        <ItemCompo key={index} item={item}></ItemCompo>
      ))}
    </div>
  );
}

function ListSection() {
  const [clubList, setclubList] = useState([]);
  const page = 1;
  const limit = 5;
 
  const fetchData = async () => {
    const data = await getClubPage({ page, limit });
    if (data) {
      setclubList(data.club);
     }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return   (
    <section className="list-section">
      <div className="list-container">
        <header>
          <h3>이런 동아리는 어떠신가요</h3>
          <h4 className="clickable">
            <Link to="/TotalClubs/1">더보기</Link>
          </h4>
        </header>
        <div>
          {clubList.map((item, index) => (
            <ClubItem
              key={index}
              club={item}
              button_text={"동아리 이동하기"}
            ></ClubItem>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Main;
