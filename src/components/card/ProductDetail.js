import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, InputNumber, notification, Radio, Rate, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import useCart from '../../hook/useCart';
import { getProducts } from '../State/Product/Action';
import RelatedProducts from './RelatedProducts';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.productReducer);
  const { addToCart } = useCart();
  const jwt = localStorage.getItem("jwt");

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(true); // New state for RelatedProducts loading

  useEffect(() => {
    dispatch(getProducts({ jwt }));
  }, [dispatch, jwt]);

  useEffect(() => {
    if (products.length) {
      const foundProduct = products.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        const initialChoices = {};
        foundProduct.options.forEach((option) => {
          if (option.choices.length > 0) {
            initialChoices[option._id] = option.choices[0]._id;
          }
        });
        setSelectedChoices(initialChoices);
      } else {
        navigate('/');
      }
    }
  }, [products, id, navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://fastfood-online-backend.onrender.com/v1/review/product/${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();

    const fetchRelatedProducts = async () => {
      setRelatedProductsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate 1-second delay
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setRelatedProductsLoading(false);
      }
    };
    fetchRelatedProducts();
  }, [id]);

  const handleChoiceSelect = (optionId, choiceId) => {
    setSelectedChoices((prevChoices) => ({
      ...prevChoices,
      [optionId]: choiceId,
    }));
  };

  const handleAddToCart = () => {
    if (!product) return;

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
    notification.success({
      message: "Sản phẩm đã được thêm vào giỏ hàng!",
    });
  };

  if (!product || loading) return <div>Loading...</div>;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="product-detail-container">
      <div className="product-detail-main">
        <div className="product-image-section">
          <img
            src={product.picture}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-rating">
            <Rate disabled allowHalf value={averageRating} />
            <span>({reviews.length} đánh giá)</span>
          </div>
          <p className="product-description">{product.description}</p>
          <div className="product-price">
            {product.price !== product.currentPrice ? (
              <>
                <span className="current-price">{product.currentPrice.toLocaleString()} đ</span>
                <span className="original-price">{product.price.toLocaleString()} đ</span>
              </>
            ) : (
              <span className="current-price">{product.currentPrice.toLocaleString()} đ</span>
            )}
          </div>

          {product.options && product.options.length > 0 && (
            <div className="options-section">
              {product.options.map((option) => (
                <div key={option._id} className="option-group">
                  <h4>{option.name} <PlusOutlined /></h4>
                  <Radio.Group
                    onChange={(e) => handleChoiceSelect(option._id, e.target.value)}
                    value={selectedChoices[option._id]}
                    className="option-radio-group"
                  >
                    {option.choices.map((choice) => (
                      <div key={choice._id} className="option-choice">
                        <span className="choice-name">
                          {choice.name} (+{choice.additionalPrice.toLocaleString()} đ)
                        </span>
                        <Radio value={choice._id} />
                      </div>
                    ))}
                  </Radio.Group>
                </div>
              ))}
            </div>
          )}

          <div className="quantity-section">
            <span>Số lượng:</span>
            <InputNumber
              min={1}
              value={quantity}
              onChange={(value) => setQuantity(value)}
            />
          </div>

          <Button
            type="primary"
            className="add-to-cart-button"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>

      <Spin spinning={relatedProductsLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
        <RelatedProducts productId={id} />
      </Spin>

      <div className="reviews-section">
        <h2>Đánh giá sản phẩm</h2>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">{review.fullName}</span>
                  <Rate disabled value={review.rating} />
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;