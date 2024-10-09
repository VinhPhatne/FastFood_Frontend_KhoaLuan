import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import styles from "./Card.module.scss";
import image from "../../assets/images/courseimage.png";
import { FaRegStar } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrevArrow, NextArrow } from "../Arrow";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../State/Category/Action";
import { getProducts } from "../State/Product/Action";

const Card = () => {
  const [items, setItems] = useState([
    {
      title: "Khóa học React Native TypeScript New 2024",
      author: "Vinh Phat",
      duration: "05:32",
      lessons: 5,
      price: "551,000 đ",
      originalPrice: "580,000 đ",
      students: 2,
    },
    {
      title: "Khóa học React Native TypeScript New 2024",
      author: "Vinh Phat",
      duration: "05:32",
      lessons: 5,
      price: "551,000 đ",
      originalPrice: "580,000 đ",
      students: 2,
    },
    {
      title: "Khóa học React Native TypeScript New 2024",
      author: "Vinh Phat",
      duration: "05:32",
      lessons: 5,
      price: "551,000 đ",
      originalPrice: "580,000 đ",
      students: 2,
    },
    {
      title: "Khóa học React Native TypeScript New 2024",
      author: "Vinh Phat",
      duration: "05:32",
      lessons: 5,
      price: "551,000 đ",
      originalPrice: "580,000 đ",
      students: 2,
    },
    {
      title: "Khóa học React Native TypeScript New 2024",
      author: "Vinh Phat",
      duration: "05:32",
      lessons: 5,
      price: "551,000 đ",
      originalPrice: "580,000 đ",
      students: 2,
    },
  ]);

  const dispatch = useDispatch();
  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );

  const { products } = useSelector((state) => state.productReducer);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getCategories({ jwt }));
    dispatch(getProducts({ jwt }));
  }, [dispatch]);

  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [showNextArrow, setShowNextArrow] = useState(true);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: showPrevArrow ? <PrevArrow /> : null,
    nextArrow: showNextArrow ? <NextArrow /> : null,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3.5,
          centerMode: false,
          infinite: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3.5,
          centerMode: false,
          infinite: false,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          centerMode: false,
          infinite: false,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2.5,
          centerMode: false,
          infinite: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1.5,
          centerMode: false,
          infinite: false,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    afterChange: (current) => {
      setShowPrevArrow(current > 0);
      setShowNextArrow(current < items.length - 4);
    },
  };
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/category/7089338599931904");
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.left}>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleRedirect(category._id)}
              >
                <h3>{category.name}</h3>
                {/* Bạn có thể thêm các thông tin khác về category ở đây */}
              </div>
            ))
          ) : (
            <p>No categories available</p> // Thông báo nếu không có dữ liệu
          )}
        </div>
        <div className={styles.right} onClick={handleRedirect}>
          <p>Xem thêm </p>
          <MdOutlineKeyboardDoubleArrowRight className={styles.icon} />
        </div>
      </div>

      <div className={styles.container}>
        <Slider {...settings}>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((item, index) => (
              <div className={styles.item} key={index}>
                <img
                  className={styles.img}
                  src={item.picture}
                  alt={item.name}
                />
                <div className={styles.course}>
                  <p className={styles.title}>{item.name}</p>
                  <div className={styles.info}>
                    <p>By {item.author}</p>{" "}
                    {/* Cần chắc chắn rằng author có trong item */}
                    {[...Array(5)].map((_, starIndex) => (
                      <FaRegStar key={starIndex} />
                    ))}
                    <p>
                      Thời gian {item.duration} - {item.lessons} Bài giảng
                    </p>
                  </div>
                  <div className={styles.footer}>
                    <div className={styles.cost}>
                      <span>{item.price}</span>
                      <span>{item.originalPrice}</span>
                    </div>
                    <p>{item.students} đã học</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </Slider>
      </div>
    </div>
  );
};

export default Card;
