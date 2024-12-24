import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import banner from "../../assets/images/f9f59c87-8bc2-4279-9c37-33fa9c1b153c.webp";
import banner2 from "../../assets/images/a3394f8b-c971-4705-bc5b-776797494482.webp";
import banner3 from "../../assets/images/d55f0235-1798-4407-8de3-f20229773605.webp";
import banner4 from "../../assets/images/7d31f212-4a00-4e94-b1e1-ba6b34e50ae7.webp";
import banner5 from "../../assets/images/472a3c1a-e1c7-494a-9b0f-20810d5bdc23.webp";

const cx = classNames.bind(styles);

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [banner4, banner5, banner];

  // Hàm cuộn sang trái (scroll left)
  const scrollLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Hàm cuộn sang phải (scroll right)
  const scrollRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={cx("Home")}>
      <div className={cx("banner")}>
        <div className={cx("banner_major")}>
          <div
            className={cx("banner-images")}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`, // Cuộn các ảnh theo currentIndex
              transition: "transform 0.7s ease-in-out", // Hiệu ứng cuộn mượt mà
            }}
          >
            {images.map((src, index) => (
              <img key={index} src={src} alt="banner" />
            ))}
          </div>
          <button className={cx("scroll-button", "left")} onClick={scrollLeft}>
            <ArrowLeftIcon />
          </button>
          <button
            className={cx("scroll-button", "right")}
            onClick={scrollRight}
          >
            <ArrowRightIcon />
          </button>
        </div>

        <div className={cx("banner_exta")}>
          <img src={banner3} alt="banner" />
          <img src={banner2} alt="banner" />
        </div>
      </div>
    </div>
  );
};

export default Home;
