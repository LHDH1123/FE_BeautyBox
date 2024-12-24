import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListProduct.module.scss";
import PropTypes from "prop-types";
import product from "../../assets/images/f9bd5ae3-dc72-438e-8343-6aaba2c3f3da.webp";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";

const cx = classNames.bind(styles);

ListProduct.propTypes = {
  title: PropTypes.string,
};

ListProduct.defaultProps = {
  title: "",
};

function ListProduct({ title }) {
  const scrollableRef = useRef(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const [favoritedItems, setFavoritedItems] = useState(Array(6).fill(false)); // Store individual favorite state for each product

  // Handle click event to toggle icon for a specific product
  const handleClickTym = (index) => {
    setFavoritedItems(
      (prev) => prev.map((item, idx) => (idx === index ? !item : item)) // Toggle the clicked product's favorite state
    );
  };

  // Scroll left by a fixed distance
  const scrollLeft = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: -scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  // Scroll right by a fixed distance
  const scrollRight = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  // Handle scroll event to update button visibility
  const handleScroll = () => {
    const container = scrollableRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setIsLeftVisible(container.scrollLeft > 0);
      setIsRightVisible(container.scrollLeft < maxScrollLeft);
    }
  };

  useEffect(() => {
    const container = scrollableRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial scroll state
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const container = scrollableRef.current;
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={cx("list")}>
      <h2>{title}</h2>
      <div className={cx("scroll-list")}>
        {isLeftVisible && (
          <button className={cx("scroll-button", "left")} onClick={scrollLeft}>
            <ArrowLeftIcon />
          </button>
        )}
        <div className={cx("list_product")} ref={scrollableRef}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className={cx("product")}>
                <div
                  className={cx("tym")}
                  onClick={() => handleClickTym(index)}
                >
                  {favoritedItems[index] ? (
                    <FavoriteIcon style={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </div>
                <img src={product} alt="Product" />
                <div className={cx("product_info")}>
                  <a href="/">GOODAL</a>
                  <div className={cx("description")}>
                    Tinh Chất Goodal Hỗ Trợ Làm Sáng Da, Mờ Đốm Nâu Green
                    Tangerine Vita C Dark Spot Care Serum 40ml
                  </div>
                  <div className={cx("price_product")}>
                    <div className={cx("new_price")}>711.000đ</div>
                    <div className={cx("price")}>749.000đ</div>
                    <span className={cx("discount-tag")}>
                      <div className={cx("tag")}>-50%</div>
                    </span>
                  </div>
                  <div className={cx("review")}>
                    <div className={cx("rate")}>
                      <StarIcon fontSize="inherit" />
                      <StarIcon fontSize="inherit" />
                      <StarIcon fontSize="inherit" />
                      <StarIcon fontSize="inherit" />
                      <StarIcon fontSize="inherit" />
                    </div>
                    <div className={cx("amount")}>(0)</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {isRightVisible && (
          <button
            className={cx("scroll-button", "right")}
            onClick={scrollRight}
          >
            <ArrowRightIcon />
          </button>
        )}
      </div>
      <div className={cx("btn_viewAll")}>
        <button>Xem tất cả</button>
      </div>
    </div>
  );
}

export default ListProduct;
