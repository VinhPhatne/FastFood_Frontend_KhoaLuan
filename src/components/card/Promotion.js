import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import styles from "./Card.module.scss";
import { FaRegStar } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrevArrow, NextArrow } from "../Arrow";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../State/Category/Action";
import { getProducts, getProductsByCategory } from "../State/Product/Action";
import Cookies from "js-cookie";
import { notification, Radio } from "antd";
import { Modal, InputNumber, Button } from "antd";
import "./productModal.css";
import useCart from "../../hook/useCart";
import { getOptionals } from "../State/Optional/Action";
import { getChoicesByOptionalId } from "../State/Choice/Action";
import { PlusOutlined } from "@ant-design/icons";

const Promotion = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );
  const { products } = useSelector((state) => state.productReducer);
  const { optionals } = useSelector((state) => state.optionalReducer.optionals);

  const jwt = useMemo(() => localStorage.getItem("jwt"), []);
  const { cart, addToCart } = useCart();
  useEffect(() => {
    dispatch(getCategories({ jwt }));
    dispatch(getProducts({ jwt }));
    dispatch(getOptionals({ jwt }));
  }, [dispatch, jwt]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [selectedChoices, setSelectedChoices] = useState({});

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    dispatch(getCategories({ jwt }));
  }, [dispatch, jwt]);

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/category/7089338599931904");
  };

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
  const handleAddToCartModal = (product) => {
    if (!jwt) {
      notification.error("Bạn cần đăng nhập để thêm vào giỏ hàng!!!");
      return;
    }
    // //handleAddToCart(product);
    // addToCart(product, quantity);
    // setQuantity(1);

    // const selectedOptions = Object.entries(selectedChoices).map(
    //   ([optionId, choiceId]) => ({
    //     optionId,
    //     choiceId,
    //   })
    // );

    const selectedOptions = Object.entries(selectedChoices).map(
      ([optionId, choiceId]) => {
        const option = product.options.find((opt) => opt._id === optionId);
        const choice = option?.choices.find((cho) => cho._id === choiceId);

        return {
          optionId,
          choiceId,
          addPrice: choice ? choice.additionalPrice : 0, 
        };
      }
    );

    addToCart(
      {
        ...product,
        options: selectedOptions, 
      },
      quantity
    );
    setQuantity(1);
    setSelectedChoices({});
    notification.success({
      message: "Sản phẩm đã được thêm vào giỏ hàng!",
    });
  };

  const handleAddToCart = (product) => {
    if (!jwt) {
      notification.error("Bạn cần đăng nhập để thêm vào giỏ hàng!!!");
      return;
    }
    addToCart(product, quantity);
    notification.success({
      message: "Sản phẩm đã được thêm vào giỏ hàng!",
    });
  };

  const handleChoiceSelect = (optionId, choiceId) => {
    setSelectedChoices((prevChoices) => ({
      ...prevChoices,
      [optionId]: choiceId,
    }));
  };

  return (
    <div>
      <div className="border-b-2 sticky top-16 z-10 pt-10 py-4 bg-white mb-10 ">
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
              .filter(
                (category) =>
                  category.isActive &&
                  category.products.some((product) => product.event !== null) 
              )
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
          startIndex + visibleCount < categories.length - 2 && (
            <button
              className="absolute right-[180px] top-1/2 transform -translate-y-1/2 px-2 py-1 mt-2 text-3xl font-bold text-black hover:text-orange-600"
              onClick={handleNext}
            >
              {">"}
            </button>
          )}
      </div>

      <div className="pt-8">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories
            .filter((category) => {
              const productsInCategory = Array.isArray(products)
                ? products.filter(
                    (item) =>
                      item.category &&
                      item.category._id === category._id &&
                      item.isSelling &&
                      item.event
                  )
                : [];
              return category.isActive && productsInCategory.length > 0;
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
                      item.isSelling &&
                      item.event
                  ).length > 0 ? (
                    products
                      .filter(
                        (item) =>
                          item.category &&
                          item.category._id === category._id &&
                          item.isSelling &&
                          item.event
                      )
                      .map((item) => (
                        <div
                          key={item._id}
                          className={styles.item}
                          onClick={() => showModal(item)}
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
                                {item.price !== item.currentPrice ? (
                                  <>
                                    <span>{item.currentPrice} đ</span>
                                    <span className={styles.discountPrice}>
                                      {item.price}{" "}
                                    </span>
                                  </>
                                ) : (
                                  <span>{item.currentPrice} đ</span>
                                )}
                              </div>
                            </div>
                            <button
                              className={styles.addToCartButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
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
          <p>No categories available</p>
        )}
      </div>

      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        {selectedProduct && (
          <div className="modal-content">
            {/* Left Side - Product Image */}
            <div className="modal-left">
              <img
                src={selectedProduct.picture}
                alt={selectedProduct.name}
                className="product-image"
              />
            </div>

            {/* Right Side - Product Details */}
            <div className="modal-right">
              <h2 className="product-title">{selectedProduct.name}</h2>
              <p className="product-description">
                {selectedProduct.description}
              </p>
              <div className="product-price">
                <strong>{selectedProduct.price} đ</strong>
              </div>

              <hr></hr>

              {/* Options Selection */}
              {selectedProduct.options &&
                selectedProduct.options.map((option) => (
                  <div key={option._id} className="option-group">
                    <h4>
                      {option.name}
                      <PlusOutlined
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </h4>
                    <Radio.Group
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        handleChoiceSelect(option._id, e.target.value)
                      }
                      value={selectedChoices[option._id]}
                    >
                      {option.choices.map((choice) => (
                        <div className="option-choice" key={choice._id}>
                          {/* <Radio key={choice._id} value={choice._id}>
                              {choice.name} (+{choice.extraPrice} đ)
                            </Radio> */}
                          <span className="choice-name">
                            {choice.name} (+{choice.additionalPrice} đ)
                          </span>
                          <Radio value={choice._id} className="choice-radio" />
                        </div>
                      ))}
                    </Radio.Group>
                    <hr></hr>
                  </div>
                ))}

              {/* Quantity Selector */}
              <div className="quantity-selector">
                <span>Số lượng:</span>
                <InputNumber
                  min={1}
                  defaultValue={1}
                  value={quantity}
                  onChange={(value) => setQuantity(value)}
                />
              </div>

              {/* Add to Cart Button */}
              <Button
                type="primary"
                className="add-to-cart-button"
                onClick={() => {
                  if (selectedProduct) {
                    handleAddToCartModal({
                      ...selectedProduct,
                      quantity,
                    });
                    setIsModalVisible(false);
                  }
                }}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Promotion;
