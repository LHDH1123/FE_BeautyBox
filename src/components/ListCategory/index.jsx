import React, { useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListCategory.module.scss";
import product from "../../assets/images/f9bd5ae3-dc72-438e-8343-6aaba2c3f3da.webp";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";

const cx = classNames.bind(styles);

function ListCategory() {
  const scrollableRef = useRef(null);
  const [favoritedItems, setFavoritedItems] = useState(Array(10).fill(false));

  const handleClickTym = (index) => {
    // In ra key (index) của sản phẩm khi click
    console.log(`Product key: ${index}`);

    setFavoritedItems((prev) => {
      const updatedFavoritedItems = [...prev]; // Copy previous state
      updatedFavoritedItems[index] = !updatedFavoritedItems[index]; // Toggle the favorite state
      return updatedFavoritedItems; // Return updated state
    });
  };

  return (
    <div className={cx("list")}>
      <div className={cx("scroll-list")}>
        <div className={cx("list_product")} ref={scrollableRef}>
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div key={index} className={cx("product")}>
                <div className={cx("productList-img")}>
                  <img src={product} alt="Product" />
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
                </div>
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
      </div>
    </div>
  );
}

export default ListCategory;
