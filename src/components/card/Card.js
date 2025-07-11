import { PlusOutlined } from "@ant-design/icons";
import { Button, InputNumber, Modal, notification, Radio, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import useCart from "../../hook/useCart";
import { getCategories } from "../State/Category/Action";
import { getOptionals } from "../State/Optional/Action";
import { getProducts } from "../State/Product/Action";
import styles from "./Card.module.scss";
import "./productModal.css";
import RelatedProducts from './RelatedProducts';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../State/Recommandation/Action';

const Card = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );
  const { products } = useSelector((state) => state.productReducer);
  const { optionals } = useSelector((state) => state.optionalReducer.optionals);
  const { recommendations, error } = useSelector((state) => state.recommendations);
  const userProfile = useSelector((state) => state.auth.user);

  const jwt = localStorage.getItem("jwt");
  const { cart, addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(getCategories({ jwt })),
          dispatch(getProducts({ jwt })),
          dispatch(getOptionals({ jwt })),
          dispatch(getRecommendations({ jwt })),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, jwt]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [active, setActive] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

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
    addToCart(product, quantity);
    notification.success({
      message: "Sản phẩm đã được thêm vào giỏ hàng!",
    });
  };

  const shouldShowDiscount = (item) => {
    if (!item.event || !item.event.isActive || item.price === item.currentPrice) {
      return false;
    }
    const currentDate = new Date();
    const expDate = new Date(item.event.expDate);
    return expDate > currentDate;
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="border-b-2 sticky top-16 z-10 pt-10 py-4 bg-white mb-10">
            {startIndex > 0 && (
              <button
                className="absolute left-[180px] top-1/2 transform -translate-y-1/2 px-2 py-1 mt-2 text-3xl font-bold text-black hover:text-orange-600"
                onClick={handlePrev}
              >
                {"<"}
              </button>
            )}

            <ul className="flex justify-between items-center max-w-screen-lg mx-auto px-4 overflow-hidden">
              {Array.isArray(categories) &&
                categories
                  .filter((category) => category.isActive && category?.products?.length > 0)
                  .slice(startIndex, startIndex + visibleCount)
                  .map((category) => (
                    <li
                      key={category._id}
                      className={`relative px-4 py-2 cursor-pointer font-bold text-2xl ${
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
                  className="absolute right-[180px] top-1/2 transform -translate-y-1/2 px-2 py-1 mt-2 text-3xl font-bold text-black hover:text-orange-600"
                  onClick={handleNext}
                >
                  {">"}
                </button>
              )}
          </div>

          {userProfile && (
            <div>
              {Array.isArray(recommendations) && recommendations.length > 0 ? (
                <div className={styles.card}>
                  <h2 className={styles.categoryTitle}>Gợi ý cho bạn</h2>
                  <div className={styles.container}>
                    {recommendations
                      .filter((item) => item.isSelling !== false)
                      .map((item) => (
                        <div
                          key={item._id}
                          className={styles.item}
                          onClick={() => navigate(`/detail/${item._id}`)}
                        >
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
                                {shouldShowDiscount(item) ? (
                                  <>
                                    <span>
                                      {item.currentPrice.toLocaleString()} đ
                                    </span>
                                    <span className={styles.discountPrice}>
                                      {item.price.toLocaleString()}{" "}
                                    </span>
                                  </>
                                ) : (
                                  <span>{item.price.toLocaleString()} đ</span>
                                )}
                              </div>
                            </div>
                            <button
                              className={styles.addToCartButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/detail/${item._id}`);
                              }}
                            >
                              Thêm vào giỏ hàng
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <p></p>
              )}
            </div>
          )}

          <div>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories
                .filter((category) => {
                  const productsInCategory = Array.isArray(products)
                    ? products.filter(
                        (item) =>
                          item.category &&
                          item.category._id === category._id &&
                          item.isSelling
                      )
                    : [];
                  return category.isActive && productsInCategory?.length > 0;
                })
                .map((category) => (
                  <div key={category._id} className={styles.card}>
                    <div className={styles.content}>
                      <div className={styles.left}>
                        <p>{category.name}</p>
                      </div>
                    </div>

                    <div id={category._id} className={styles.container}>
                      {Array.isArray(products) &&
                      products.filter(
                        (item) =>
                          item.category &&
                          item.category._id === category._id &&
                          item.isSelling
                      ).length > 0 ? (
                        products
                          .filter(
                            (item) =>
                              item.category &&
                              item.category._id === category._id &&
                              item.isSelling
                          )
                          .map((item) => (
                            <div
                              key={item._id}
                              className={styles.item}
                              onClick={() => navigate(`/detail/${item._id}`)}
                            >
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
                                    {shouldShowDiscount(item) ? (
                                      <>
                                        <span>
                                          {item.currentPrice.toLocaleString()} đ
                                        </span>
                                        <span className={styles.discountPrice}>
                                          {item.price.toLocaleString()}{" "}
                                        </span>
                                      </>
                                    ) : (
                                      <span>{item.price.toLocaleString()} đ</span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  className={styles.addToCartButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/detail/${item._id}`);
                                  }}
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
              <p>No Food</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
