import React, { useState } from "react";
import styles from "./DetailCourse.module.scss";
import Header from "../header/Header";
import logo from "../../assets/images/courseimage.png";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineVideoFile } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { CgFileDocument } from "react-icons/cg";

const DetailCourse = () => {

  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Next.js 14 & React - The Complete Guide",
      description: "Complete guide to learn Next.js and React.",
      price: "908,999 đ",
      oldPrice: "1,200,000 đ",
      lectures: 12,
      duration: "5:00",
      rating: 5,
    },
    {
      id: 2,
      name: "Mastering React Native",
      description: "Build robust and scalable mobile applications with React Native.",
      price: "650,000 đ",
      oldPrice: "950,000 đ",
      lectures: 15,
      duration: "8:30",
      rating: 4,
    },
    {
      id: 3,
      name: "Advanced CSS and Sass",
      description: "Become an expert in CSS and Sass with real-world projects.",
      price: "500,000 đ",
      oldPrice: "700,000 đ",
      lectures: 10,
      duration: "4:00",
      rating: 4.5,
    },
    {
      id: 4,
      name: "Advanced CSS and Sass",
      description: "Become an expert in CSS and Sass with real-world projects.",
      price: "500,000 đ",
      oldPrice: "700,000 đ",
      lectures: 10,
      duration: "4:00",
      rating: 4.5,
    },

  ]);

  return (
    <>
      <Header />
      <div className={styles.detailContainer}>
        <div className={styles.banner}>
          <div className={styles.bannerTitle}>
            Meeting React Native Community
          </div>
          <div className={styles.bannerContent}>
            <p>
              Meeting React Native Community tại nhà hàng Hữu Nghị 15/2 Gò Cát,
              Q9. HCM
            </p>
            <div className={styles.rating}>
              <span>Huu Cong</span>
              <div className={styles.ratingStar}>
                <div className={styles.star}>★★★★★</div>
                <h1>0 Học viên</h1>
              </div>
              <button>Chia sẻ</button>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.courseInfo}>
              <h2>Bạn sẽ học được gì?</h2>
              <p>
                Meeting React Native Community tại nhà hàng Hữu Nghị 15/2 Gò
                Cát, Q9. HCM
              </p>
              <h2>Đánh giá của học viên</h2>
              {/* <div className={styles.ratingStars}>
                <span>0.0</span>
                <div className={styles.stars}>
                  <span>★★★★★</span>
                </div>
                <p>0 Đánh giá</p>
              </div> */}

              <div className={styles.ratingStarsContainer}>
                <div className={styles.ratingStars}>
                  <span className={styles.ratingNumber}>0.0</span>
                  <div className={styles.stars}>
                    <span>★★★★★</span>
                  </div>
                  <p>0 Đánh giá</p>
                </div>
                <div className={styles.starsBreakdown}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className={styles.breakdownItem}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progress}
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                      <span className={styles.percent}>0%</span>
                      <span className={styles.starIcons}>
                        {"★".repeat(star)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.relatedCourses}>
              <h2>Khóa học liên quan</h2>
              <div className={styles.course}>
                {courses.map((course) => (
                  <div key={course.id} className={styles.courseItem}>
                    <img src={logo} alt="Next.js 14 & React" />
                    <div className={styles.courseTitle}>
                      <p>Next.js 14 & React - The Complete Guide</p>
                      <div className={styles.courseDetail}>
                        <div className={styles.courseDetailContainer}>
                          <FaRegClock className={styles.icon}/>
                          <span>0:0</span>
                        </div>
                        <div className={styles.courseDetailContainer}>
                          <MdOutlineVideoFile className={styles.icon}/>
                          <span>12 bài giảng</span>
                        </div>
                      </div>

                      <div className={styles.courseRating}>
                        <span className={styles.starIcons}>★★★★★</span>
                        <div className={styles.price}>
                          <p className={styles.oldPrice}>908,999 đ</p>
                          <p className={styles.newPrice}>908,999 đ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div/>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.coursePurchase}>
              <img className={styles.img} src={logo} alt="React Native" />
              <div className={styles.priceInfo}>
                <span>80,000 đ</span>
                <span>100,000 đ</span>
              </div>
              <div className={styles.btnBuy}>Mua ngay</div>
              <div className={styles.btnCart}>Thêm vào giỏ hàng</div>
              <div className={styles.titleCourseCart}>
                <p>Thông tin khóa học</p>
                <div className={styles.courseDetailContainer}>
                  <LuUsers className={styles.icon}/>
                  <span>0 học viên</span>
                </div>

                <div className={styles.courseDetailContainer}>
                  <FaRegClock className={styles.icon}/>
                  <span>00:00</span>
                </div>

                <div className={styles.courseDetailContainer}>
                  <CgFileDocument className={styles.icon}/>
                  <span>0 bài học</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailCourse;
