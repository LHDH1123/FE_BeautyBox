import React from "react";
import classNames from "classnames/bind";
import styles from "./ButtonAll.module.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const ButtonAll = ({ title }) => {
  const navigate = useNavigate();

  const toSlug = (str) => {
    return str
      .normalize("NFD") // tách dấu
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu
      .replace(/[^a-zA-Z0-9\s]/g, "") // xóa ký tự đặc biệt
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-"); // thay khoảng trắng bằng "-"
  };

  const handleProduct = async () => {
    navigate(`/products/${toSlug(title)}`);
  };
  return (
    <div>
      <div className={cx("btn_viewAll")} onClick={handleProduct}>
        <button>Xem tất cả</button>
      </div>
    </div>
  );
};

export default ButtonAll;
