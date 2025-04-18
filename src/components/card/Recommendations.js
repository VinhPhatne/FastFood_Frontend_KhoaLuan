import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { getRecommendations } from '../State/Recommandation/Action';
import useCart from '../../hook/useCart';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recommendations, error } = useSelector((state) => state.recommendations);
  const { addToCart } = useCart();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getRecommendations({jwt}));
  }, [dispatch]);

  if (error) return <div className="text-red-500 text-center">Lỗi: {error}</div>;
  if (!recommendations?.length) return null;

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Gợi ý cho bạn</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        className="mySwiper"
      >
        {recommendations?.map((item) => (
          <SwiperSlide key={item._id}>
            <div className="border p-4 rounded-lg shadow-md cursor-pointer" onClick={() => navigate(`/detail/${item._id}`)}>
              <img
                src={item.picture}
                alt={item.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-red-500">{item.currentPrice.toLocaleString()} VND</p>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() =>
                  addToCart(
                    {
                      _id: item._id,
                      name: item.name,
                      price: item.currentPrice,
                      picture: item.picture,
                      options: [],
                    },
                    1
                  )
                }
              >
                Thêm vào giỏ
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Recommendations;