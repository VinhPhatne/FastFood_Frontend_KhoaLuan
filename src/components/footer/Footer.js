import React from "react";
import styles from "./Footer.module.scss";
import { IoLocationSharp } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.number}>218</div>
          <div className={styles.text}>Học viên đăng ký</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.number}>30</div>
          <div className={styles.text}>Khóa học</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.number}>42</div>
          <div className={styles.text}>Giảng viên</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.number}>163</div>
          <div className={styles.text}>Khoá học đã bán</div>
        </div>
      </div> */}

      <div className={styles.infoSection}>
        <div className={styles.infoBox}>
          <div className={styles.title}>Thông tin</div>
          <ul>
            <li>
              <IoLocationSharp className={styles.infoIcon} />
              Gò Vấp, tp Hồ Chí Minh
            </li>
            <li>
              <IoCall className={styles.infoIcon} />
              012345689
            </li>
            <li>
              <MdOutlineEmail className={styles.infoIcon} />
              www.lifeuni@gmail.com
            </li>
          </ul>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.title}>Về LifeUni</div>
          <ul>
            <li>Điều khoản</li>
            <li>Chính sách về quyền riêng tư</li>
            <li>Cài đặt cookie</li>
            <li>Blog</li>
            <li>Giới thiệu</li>
            <li>Hãy liên hệ với chúng tôi</li>
          </ul>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.title}>Hợp tác liên kết</div>
          <ul>
            <li>Sơ đồ trang web</li>
            <li>Đào tạo doanh nghiệp</li>
            <li>Tải ứng dụng</li>
            <li>Tuyên bố về khả năng tiếp cận</li>
            <li>Đăng ký làm giảng viên</li>
            <li>Đào tạo Inhouse</li>
          </ul>
        </div>
      </div>
      <div className={styles.copyright}>
        <span>@2024 Life, Inc.</span>
      </div>
    </footer>
  );
};

export default Footer;
