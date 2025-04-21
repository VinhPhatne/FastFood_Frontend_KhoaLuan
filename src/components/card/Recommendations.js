import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { getRecommendations } from '../State/Recommandation/Action';
import useCart from '../../hook/useCart';
import './Recommendations.scss';

const Recommendations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recommendations, error } = useSelector((state) => state.recommendations);
  const { addToCart } = useCart();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getRecommendations({ jwt }));
  }, [dispatch]);

  if (error) return <div className="text-red-500 text-center">Lỗi: {error}</div>;
  if (!recommendations?.length) return null;

  return (
    <div className="recommendations-container">
      <h2 className="recommendations-title">Gợi ý cho bạn</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={4}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        className="recommendations-swiper"
      >
        {recommendations?.map((item) => (
          <SwiperSlide key={item._id}>
            <div
              className="recommendation-item"
              onClick={() => navigate(`/detail/${item._id}`)}
            >
              <img
                src={item.picture}
                alt={item.name}
                className="recommendation-image"
              />
              <div className="recommendation-content">
                <h3 className="recommendation-name">{item.name}</h3>
                <p className="recommendation-description">{item.description}</p>
                <div className="recommendation-price">
                  {item.price !== item.currentPrice ? (
                    <>
                      <span className="current-price">{item.currentPrice.toLocaleString()} đ</span>
                      <span className="original-price">{item.price.toLocaleString()} đ</span>
                    </>
                  ) : (
                    <span className="current-price">{item.currentPrice.toLocaleString()} đ</span>
                  )}
                </div>
                <button
                  className="add-to-cart-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(
                      {
                        _id: item._id,
                        name: item.name,
                        price: item.currentPrice,
                        picture: item.picture,
                        options: [],
                      },
                      1
                    );
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </Swiper>
    </div>
  );
};

export default Recommendations;