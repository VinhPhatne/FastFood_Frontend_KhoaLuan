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

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/category/7089338599931904");
  };

  const [active, setActive] = useState(1);

  console.log("products", products);
  return (
    <div>
      <div className="border-b">
        <ul className="flex justify-between items-center max-w-screen-lg mx-auto px-4">
          {Array.isArray(categories) &&
            categories.map((category) => (
              <li
                key={category._id}
                className={`relative px-4 py-2 cursor-pointer font-bold ${
                  active === category._id ? "text-black" : "text-gray-400"
                }`}
                onClick={() => setActive(category._id)}
              >
                {category.name}
                {active === category._id && (
                  <span className="absolute left-0 bottom-0 w-full h-[3px] bg-red-600" />
                )}
              </li>
            ))}
        </ul>
      </div>

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
                          </div>
                          <div className={styles.footer}>
                            <div className={styles.cost}>
                              <span>{item.price} đ</span>
                              <span>{item.originalPrice} </span>
                            </div>
                          </div>
                          <button className={styles.addToCartButton}>
                            Thêm vào giỏ hàng
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No products available for this category</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

export default Card;
