import React from "react";
import classNames from "classnames/bind";
import styles from "./CategoryHeader.module.scss";
import img1 from "../../../assets/images/categoryHeader.webp";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

CategoryHeader.propTypes = {
  props: PropTypes.string,
};

function CategoryHeader({ props }) {
  return (
    <div className={cx("category")}>
      <div className={cx("info")}>
        <div className={cx("list-category")}>
          <div className={cx("title-category")}>Trang điểm môi</div>
          <ul className={cx("category-chil")}>
            <li>Cushion</li>
            <li>Kem nền</li>
            <li>Phấn phủ</li>
            <li>Che khuyết điểm</li>
            <li>Kem lót</li>
            <li>Phấn má hồng</li>
            <li>Tạo khối</li>
          </ul>
        </div>
        <div className={cx("list-category")}>
          <div className={cx("title-category")}>Trang điểm môi</div>
          <ul className={cx("category-chil")}>
            <li>Cushion</li>
            <li>Kem nền</li>
            <li>Phấn phủ</li>
            <li>Che khuyết điểm</li>
            <li>Kem lót</li>
            <li>Phấn má hồng</li>
            <li>Tạo khối</li>
          </ul>
        </div>
        <div className={cx("list-category")}>
          <div className={cx("title-category")}>Trang điểm môi</div>
          <ul className={cx("category-chil")}>
            <li>Cushion</li>
            <li>Kem nền</li>
            <li>Phấn phủ</li>
            <li>Che khuyết điểm</li>
            <li>Kem lót</li>
            <li>Phấn má hồng</li>
            <li>Tạo khối</li>
          </ul>
        </div>
        <div className={cx("list-category")}>
          <div className={cx("title-category")}>Trang điểm môi</div>
          <ul className={cx("category-chil")}>
            <li>Cushion</li>
            <li>Kem nền</li>
            <li>Phấn phủ</li>
            <li>Che khuyết điểm</li>
            <li>Kem lót</li>
            <li>Phấn má hồng</li>
            <li>Tạo khối</li>
          </ul>
        </div>
        <div className={cx("list-category")}>
          <div className={cx("title-category")}>Trang điểm môi</div>
          <ul className={cx("category-chil")}>
            <li>Cushion</li>
            <li>Kem nền</li>
            <li>Phấn phủ</li>
            <li>Che khuyết điểm</li>
            <li>Kem lót</li>
            <li>Phấn má hồng</li>
            <li>Tạo khối</li>
          </ul>
        </div>
        <div className={cx("list-category")}>
          <div className={cx("title-category")}>Trang điểm môi</div>
          <ul className={cx("category-chil")}>
            <li>Cushion</li>
            <li>Kem nền</li>
            <li>Phấn phủ</li>
            <li>Che khuyết điểm</li>
            <li>Kem lót</li>
            <li>Phấn má hồng</li>
            <li>Tạo khối</li>
          </ul>
        </div>
      </div>

      <div className={cx("img-category")}>
        <img src={img1} alt="" />
      </div>
    </div>
  );
}

export default CategoryHeader;
