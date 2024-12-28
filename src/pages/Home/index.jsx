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
import ch1 from "../../assets/images/ch1.webp";
import ch2 from "../../assets/images/ch2.webp";
import ch3 from "../../assets/images/ch3.webp";
import logoSale from "../../assets/images/logo_sale.webp";
import ListProduct from "../../components/ListProduct";
import ButtonAll from "../../components/ButtonAll";
import Trademark from "../../components/Trademark";

const cx = classNames.bind(styles);

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [banner4, banner5, banner];

  const scrollLeftBanner = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const scrollRightBanner = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={cx("Home")}>
      {/* Banner Section */}
      <div className={cx("banner")}>
        <div className={cx("banner_major")}>
          <div
            className={cx("banner-images")}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.7s ease-in-out",
            }}
          >
            {images.map((src, index) => (
              <img key={index} src={src} alt="banner" />
            ))}
          </div>
          <button
            className={cx("scroll-button-banner", "left-banner")}
            onClick={scrollLeftBanner}
          >
            <ArrowLeftIcon />
          </button>
          <button
            className={cx("scroll-button-banner", "right-banner")}
            onClick={scrollRightBanner}
          >
            <ArrowRightIcon />
          </button>
        </div>

        <div className={cx("banner_exta")}>
          <img src={banner3} alt="banner" />
          <img src={banner2} alt="banner" />
        </div>
      </div>

      {/* Content Section */}
      <div className={cx("home_content")}>
        <ListProduct title="Top sản phẩm bán chạy" />
        <ButtonAll />
      </div>

      {/* Trademark Section */}
      <Trademark />

      <div className={cx("flash-sale")}>
        <div className={cx("header-sale")}>
          <div className={cx("logo-sale")}>
            <img src={logoSale} alt="" />
          </div>

          <div className={cx("time-sale")}>
            <div className={cx("title-sale")}>Thời gian còn lại</div>
            <div className={cx("time-sale")}>
              <div className={cx("time")}>
                <div>
                  <span className={cx("countdown-number")}>00</span>ngày
                </div>
                <div>
                  <span className={cx("countdown-number")}>00</span>giờ
                </div>
                <div>
                  <span className={cx("countdown-number")}>00</span>phút
                </div>
                <div>
                  <span className={cx("countdown-number")}>00</span>giây
                </div>
              </div>
            </div>
          </div>
          <div className={cx("btn-sale")}>
            <button>Xem tất cả</button>
          </div>
        </div>
        <div className={cx("list-sale")}>
          <ListProduct />
        </div>
      </div>

      <div className={cx("list_genuine")}>
        <div className={cx("content_genuine")}>
          <div className={cx("genuine")}>
            <img src={ch1} alt="ch 1" />
          </div>
          <div className={cx("genuine")}>
            <img src={ch2} alt="ch 2" />
          </div>
          <div className={cx("genuine")}>
            <img src={ch3} alt="ch 3" />
          </div>
        </div>
      </div>

      <div className={cx("home_content")}>
        <ListProduct title="Sản phẩm mới" />
        <ButtonAll />
      </div>
    </div>
  );
};

export default Home;
