import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import imgLogo from "../../assets/images/product.webp";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const cx = classNames.bind(styles);

Cart.propTypes = {
  data: PropTypes.object,
};

function Cart(props) {
  return (
    <div className={cx("div-cart")}>
      <div className={cx("cart")}>
        <input type="checkbox" />
        <div className={cx("title")}>Chọn tất cả</div>
      </div>
      <div className={cx("saperator")}></div>

      <div className={cx("product")}>
        <input type="checkbox" />
        <div className={cx("img-product")}>
          <img src={imgLogo} alt="" />
        </div>
        <div className={cx("info-product")}>
          <div className={cx("title-product")}>
            {/* <div className={cx("description-product")}>Sản phẩm 1</div> */}
            <a href="/">
              Tinh Chất Goodal Hỗ Trợ Làm Sáng Da, Mờ Đốm Nâu Green Tangerine
              Vita C Dark Spot Care Serum 40ml
            </a>
            <button>
              <RemoveIcon fontSize="smal" />
            </button>
          </div>

          <div className={cx("code-product")}>SKU: 10232122</div>

          <div className={cx("number-product")}>
            <div className={cx("number")}>
              <button>
                <RemoveIcon
                  fontSize="inherit"
                  style={{
                    fontSize: "12px",
                    stroke: "currentColor", // Thêm viền
                    strokeWidth: 1, // Làm viền đậm hơn
                  }}
                />
              </button>
              <div className={cx("quantity")}>1</div>
              <button style={{ fontWeight: "600" }}>
                <AddIcon
                  fontSize="inherit"
                  style={{
                    fontSize: "12px",
                    stroke: "currentColor", // Thêm viền
                    strokeWidth: 1, // Làm viền đậm hơn
                  }}
                />
              </button>
            </div>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
              <div className={cx("new-price")}>499.000đ</div>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("product")}>
        <input type="checkbox" />
        <div className={cx("img-product")}>
          <img src={imgLogo} alt="" />
        </div>
        <div className={cx("info-product")}>
          <div className={cx("title-product")}>
            {/* <div className={cx("description-product")}>Sản phẩm 1</div> */}
            <a href="/">
              Tinh Chất Goodal Hỗ Trợ Làm Sáng Da, Mờ Đốm Nâu Green Tangerine
              Vita C Dark Spot Care Serum 40ml
            </a>
            <button>
              <RemoveIcon fontSize="smal" />
            </button>
          </div>

          <div className={cx("code-product")}>SKU: 10232122</div>

          <div className={cx("number-product")}>
            <div className={cx("number")}>
              <button>
                <RemoveIcon
                  fontSize="inherit"
                  style={{
                    fontSize: "12px",
                    stroke: "currentColor", // Thêm viền
                    strokeWidth: 1, // Làm viền đậm hơn
                  }}
                />
              </button>
              <div className={cx("quantity")}>1</div>
              <button style={{ fontWeight: "600" }}>
                <AddIcon
                  fontSize="inherit"
                  style={{
                    fontSize: "12px",
                    stroke: "currentColor", // Thêm viền
                    strokeWidth: 1, // Làm viền đậm hơn
                  }}
                />
              </button>
            </div>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
              <div className={cx("new-price")}>499.000đ</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Cart;
