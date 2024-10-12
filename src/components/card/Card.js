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
import { getProducts, getProductsByCategory } from "../State/Product/Action";

const Card = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );
  const { productsByCategory } = useSelector((state) => state.productReducer);
  const { products } = useSelector((state) => state.productReducer);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getCategories({ jwt }));
    dispatch(getProducts({ jwt }));
  }, [dispatch]);

  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [showNextArrow, setShowNextArrow] = useState(true);

  const [categoryProducts, setCategoryProducts] = useState({});

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getCategories({ jwt }));
  }, [dispatch]);

  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 4,
    centerMode: false,
    infinite: false,
    slidesToScroll: 1,
    prevArrow: showPrevArrow ? <PrevArrow /> : null,
    nextArrow: showNextArrow ? <NextArrow /> : null,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          centerMode: false,
          infinite: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2.5,
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
      //setShowPrevArrow(current > 0);
      //setShowNextArrow(current < items.length - 4);
    },
  };
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/category/7089338599931904");
  };

  console.log("products", products);
  return (
    <div>
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((category) => (
          <div key={category._id} className={styles.card}>
            <div className={styles.content}>
              <div className={styles.left}>
                <p>{category.name}</p>
              </div>
              <div
                className={styles.right}
                onClick={() => handleRedirect(category._id)}
              >
                <p>Xem thêm </p>
                <MdOutlineKeyboardDoubleArrowRight className={styles.icon} />
              </div>
            </div>

            <div className={styles.container}>
              <Slider {...settings}>
                {products.filter((item) => item.category === category._id)
                  .length > 0 ? (
                  products
                    .filter((item) => item.category === category._id)
                    .map((item) => (
                      <div className={styles.item}>
                        <img
                          className={styles.img}
                          src={item.picture}
                          alt={item.name}
                        />
                        <div className={styles.course}>
                          <p className={styles.title}>{item.name}</p>
                          <div className={styles.info}>
                            <p>{item.description}</p>
                            <p>
                              Thời gian {item.duration} - {item.lessons} Bài
                              giảng
                            </p>
                          </div>
                          <div className={styles.footer}>
                            <div className={styles.cost}>
                              <span>{item.price} đ</span>
                              <span>{item.originalPrice} </span>
                            </div>
                            <div>Thêm vào giỏ hàng</div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No products available for this category</p>
                )}
              </Slider>
            </div>
          </div>
        ))
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
};

export default Card;
