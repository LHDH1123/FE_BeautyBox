import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./CartFav.module.scss";
import imgLogo from "../../assets/images/product.webp";

const cx = classNames.bind(styles);

CartFav.propTypes = {
  data: PropTypes.object,
};

function CartFav(props) {
  return (
    <div className={cx("div-cart")}>
      <div className={cx("product")}>
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
          </div>

          <div className={cx("number-product")}>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
            </div>
            <div className={cx("btn-remove")}>
              <button>Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("product")}>
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
          </div>

          <div className={cx("number-product")}>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
            </div>
            <div className={cx("btn-remove")}>
              <button>Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("product")}>
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
          </div>

          <div className={cx("number-product")}>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
            </div>
            <div className={cx("btn-remove")}>
              <button>Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("product")}>
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
          </div>

          <div className={cx("number-product")}>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
            </div>
            <div className={cx("btn-remove")}>
              <button>Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("product")}>
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
          </div>

          <div className={cx("number-product")}>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
            </div>
            <div className={cx("btn-remove")}>
              <button>Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("product")}>
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
          </div>

          <div className={cx("number-product")}>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
            </div>
            <div className={cx("btn-remove")}>
              <button>Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("product")}>
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
          </div>

          <div className={cx("number-product")}>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
            </div>
            <div className={cx("btn-remove")}>
              <button>Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("product")}>
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
          </div>

          <div className={cx("number-product")}>
            <div className={cx("price-product")}>
              <div className={cx("price")}>679.000đ</div>
            </div>
            <div className={cx("btn-remove")}>
              <button>Xóa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartFav;
