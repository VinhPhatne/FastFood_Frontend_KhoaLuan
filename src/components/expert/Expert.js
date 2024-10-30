import React from "react";
import styles from "./Expert.module.scss";
import image from "../../assets/images/expert.png";
import { Button } from "antd";

const Expert = () => {
  return (
    <div className={styles.expertSection}>
      <div className={styles.backGround}>
        <div className={styles.img}>
          <img className={styles.imageWrapper} src={image} alt="" />
        </div>

        <div className={styles.content}>
          <p className={styles.title}>Trở thành chuyên gia</p>
          <p className={styles.script}>
            Lorem Ipsum has been the industry s standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book
          </p>
          <div className={styles.button}>
            <Button className={styles.btnContent}>
              <span> Chia sẻ kinh nghiệm sống của bạn ngay hôm nay</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expert;
