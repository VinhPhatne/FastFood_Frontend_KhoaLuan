import React, { useState } from "react";
import styles from "./Experter.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrevArrow, NextArrow } from "../Arrow";
import image from "../../assets/images/avatar.avif";
import Slider from "react-slick";

const Experter = () => {
  const [experts] = useState([
    {
      id: 1,
      name: "Nguyễn Văn Sơn",
      role: "Chuyên gia IT Frontend developer",
      image: image,
    },
    {
      id: 2,
      name: "Nguyễn Văn Sơn",
      role: "Chuyên gia IT Frontend developer",
      image: image,
    },
    {
      id: 3,
      name: "Nguyễn Văn Sơn",
      role: "Chuyên gia IT Frontend developer",
      image: image,
    },
    {
      id: 4,
      name: "Nguyễn Văn Sơn",
      role: "Chuyên gia IT Frontend developer",
      image: image,
    },
    {
      id: 5,
      name: "Nguyễn Văn Sơn",
      role: "Chuyên gia IT Frontend developer",
      image: image,
    },
  ]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1.5,
          centerMode: false,
          infinite: false,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div className={styles.container}>
        <h2>Chuyên gia tiêu biểu</h2>
        <Slider {...settings}>
          {experts.map((expert) => (
            <div className={styles.gridItem} key={expert.id}>
              <img
                className={styles.img}
                src={expert.image}
                alt={expert.name}
              />
              <h3>Chuyên gia</h3>
              <p>{expert.name}</p>
              <p>{expert.role}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Experter;
