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
import Cookies from "js-cookie";
import { notification } from "antd";

const Card = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );
  const { productsByCategory } = useSelector((state) => state.productReducer);
  const { products } = useSelector((state) => state.productReducer);
  const jwt = localStorage.getItem("jwt");
  useEffect(() => {
    dispatch(getCategories({ jwt }));
    dispatch(getProducts({ jwt }));
  }, [dispatch, jwt]);

  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [showNextArrow, setShowNextArrow] = useState(true);

  const [categoryProducts, setCategoryProducts] = useState({});

  useEffect(() => {
    dispatch(getCategories({ jwt }));
  }, [dispatch, jwt]);

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/category/7089338599931904");
  };

  //const [active, setActive] = useState(1);

  const [active, setActive] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  const handleNext = () => {
    if (startIndex + visibleCount < categories.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleAddToCart = (product) => {
    if (!jwt) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng.");
      return;
    }

    const cart = JSON.parse(Cookies.get(jwt) || "[]");

    const existingProduct = cart.find((item) => item.id === product._id);

    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: product._id,
          name: product.name,
          price: product.price,
          picture: product.picture,
          quantity: 1,
        },
      ];
    }

    Cookies.set(jwt, JSON.stringify(updatedCart), { expires: 2 });

    notification.success({
      message: "Sản phẩm đã được thêm vào giỏ hàng!",
    });
  };

  return (
    <div>
      <div className="border-b-2 sticky top-16 z-10 pt-10 py-4 bg-white mb-10 ">
        {startIndex > 0 && (
          <button
            className="absolute left-[180px] top-1/2 transform -translate-y-1/2 px-2 py-1 text-2xl font-bold text-black hover:text-orange-600"
            onClick={handlePrev}
          >
            {"<"}
          </button>
        )}

        <ul className="flex justify-between items-center max-w-screen-lg mx-auto px-4 overflow-hidden">
          {Array.isArray(categories) &&
            categories
              .slice(startIndex, startIndex + visibleCount)
              .map((category) => (
                <li
                  key={category._id}
                  className={`relative px-4 py-2 cursor-pointer font-bold text-2xl  ${
                    active === category._id ? "text-black" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setActive(category._id);
                    const element = document.getElementById(category._id);
                    if (element) {
                      const headerHeight = 230;
                      const elementPosition =
                        element.getBoundingClientRect().top +
                        window.pageYOffset;
                      window.scrollTo({
                        top: elementPosition - headerHeight,
                        behavior: "auto",
                      });
                    }
                  }}
                >
                  {category.name}
                  {active === category._id && (
                    <span className="absolute left-0 bottom-0 w-full h-[3px] bg-orange-600" />
                  )}
                </li>
              ))}
        </ul>
        {Array.isArray(categories) &&
          startIndex + visibleCount < categories.length && (
            <button
              className="absolute right-[180px] top-1/2 transform -translate-y-1/2 px-2 py-1 text-2xl font-bold text-black hover:text-orange-600"
              onClick={handleNext}
            >
              {">"}
            </button>
          )}
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

              <div id={category._id} className={styles.container}>
                {Array.isArray(products) &&
                products.filter((item) => item.category._id === category._id)
                  .length > 0 ? (
                  products
                    .filter((item) => item.category._id === category._id)
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
                          <button
                            className={styles.addToCartButton}
                            onClick={() => handleAddToCart(item)}
                          >
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
