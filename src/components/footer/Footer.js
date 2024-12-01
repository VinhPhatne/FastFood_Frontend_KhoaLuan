import React from "react";
import styles from "./Footer.module.scss";
import { IoLocationSharp } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.infoSection}>
        <div className={styles.infoBox}>
          <div className={styles.title}>Thông tin</div>
          <ul>
            <li>
              <IoLocationSharp className={styles.infoIcon} />
              Số 01, Võ Văn Ngân
            </li>
            <li>
              <IoCall className={styles.infoIcon} />
              012345689
            </li>
            <li>
              <MdOutlineEmail className={styles.infoIcon} />
              www.chicken@gmail.com
            </li>
          </ul>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.title}>Về Crispy Delights</div>
          <ul>
            <li>Điều khoản</li>
            <li>Chính sách về quyền riêng tư</li>
            <li>Blog</li>
            <li>Giới thiệu</li>
            <li>Hãy liên hệ với chúng tôi</li>
          </ul>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.title}>Hợp tác liên kết</div>
          <ul>
            <li>Nhượng quyền</li>
            <li>Đào tạo doanh nghiệp</li>
            <li>Tuyên bố về khả năng tiếp cận</li>
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
