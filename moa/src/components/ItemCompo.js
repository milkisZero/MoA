import React from "react";
import styles from "./ItemCompo.module.css";
import { useNavigate } from "react-router-dom";
import basicProfileImg from "../assets/hi.png";

function ItemCompo({ item }) {
  const navigate = useNavigate();

  const handlePage = (id) => {
    if (!id) {
      alert("NULL found");
      return;
    }
    navigate(`/Detail_club/${id}`);
  };

  return (
    <div className={styles.container} onClick={() => handlePage(item._id)}>
      <img
        className={styles.image}
        src={item.clubImg || basicProfileImg}
        alt="Club"
      />
      <h3 className={styles.title}>{item.name}</h3>
      <p className={styles.description}>{item.description}</p>
    </div>
  );
}

export default ItemCompo;
