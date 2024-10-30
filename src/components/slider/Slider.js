import React from "react";
import styles from "./Slider.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Sliderr from "react-slick";
import slide1 from "../../assets/images/slide1.jpeg";
import slide2 from "../../assets/images/slide2.jpeg";
import slide3 from "../../assets/images/slide3.jpg";

const Slider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "ease-in-out",
    arrows: false,
    fade: false,
  };
  return (
    <div className={styles.slider}>
      <Sliderr {...settings}>
        <div className={`${styles.content} ${styles.slide3}`}>
          <img src={slide3} alt="Slide 3" className={styles.image} />
        </div>

        <div className={`${styles.content} ${styles.slide3}`}>
          <img src={slide3} alt="Slide 3" className={styles.image} />
        </div>
      </Sliderr>
    </div>
  );
};

export default Slider;
