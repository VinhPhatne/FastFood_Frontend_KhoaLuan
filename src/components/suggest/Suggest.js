import React, { useState } from "react";
import styles from "./Suggest.module.scss";
import image from "../../assets/images/suggest.jpg";
import { NextArrow, PrevArrow } from "../Arrow";
import Slider from "react-slick";

const Suggest = () => {
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [showNextArrow, setShowNextArrow] = useState(true);

  const [items] = useState([
    {
      id: 1,
      title: "XU HƯỚNG THỊ TRƯỜNG & NGƯỜI TIÊU DÙNG NỬA CUỐI...",
      description:
        "Xu hướng thị trường và tâm lý người tiêu dùng Việt Nam năm nay thay đổi như thế nào trong bối cảnh nền kinh tế vẫn đang đối mặt khó khăn và xu hướng cắt giảm chi tiêu toàn cầu? Những insights nào ảnh hưởng đến quyết định chi tiêu trong mùa lễ hội kéo dài liên tục từ tháng 10.2023 đến tháng 02.2024? Các thương hiệu cần ra quyết định cắt giảm ngân sách hay vẫn đầu tư vào các chiến dịch Marketing nhưng đảm bảo được các mục tiêu ngắn hạn và dài hạn?",
    },
    {
      id: 2,
      title: "XU HƯỚNG THỊ TRƯỜNG & NGƯỜI TIÊU DÙNG NỬA CUỐI...",
      description:
        "Xu hướng thị trường và tâm lý người tiêu dùng Việt Nam năm nay thay đổi như thế nào trong bối cảnh nền kinh tế vẫn đang đối mặt khó khăn và xu hướng cắt giảm chi tiêu toàn cầu? Những insights nào ảnh hưởng đến quyết định chi tiêu trong mùa lễ hội kéo dài liên tục từ tháng 10.2023 đến tháng 02.2024? Các thương hiệu cần ra quyết định cắt giảm ngân sách hay vẫn đầu tư vào các chiến dịch Marketing nhưng đảm bảo được các mục tiêu ngắn hạn và dài hạn?",
    },
    {
      id: 3,
      title: "XU HƯỚNG THỊ TRƯỜNG & NGƯỜI TIÊU DÙNG NỬA CUỐI...",
      description:
        "Xu hướng thị trường và tâm lý người tiêu dùng Việt Nam năm nay thay đổi như thế nào trong bối cảnh nền kinh tế vẫn đang đối mặt khó khăn và xu hướng cắt giảm chi tiêu toàn cầu?",
    },
  ]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: showPrevArrow ? <PrevArrow /> : null,
    nextArrow: showNextArrow ? <NextArrow /> : null,
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
          centerMode: true,
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
    afterChange: (current) => {
      setShowPrevArrow(current > 0);
      setShowNextArrow(current < items.length - 1);
    },
  };

  return (
    <div>
      <div className={styles.container}>
        <h2>Tại sao bạn nên học tại Life Uni?</h2>

        <Slider {...settings}>
          {items.map((item) => (
            <div className={styles.gridItem} key={item.id}>
              <div className={styles.gridContainer}>
                <img src={image} alt={item.title} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button className={styles.btn}>Khám phá</button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Suggest;
