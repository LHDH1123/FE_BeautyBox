import React from "react";
import classNames from "classnames/bind";
import styles from "./ButtonAll.module.scss";

const cx = classNames.bind(styles);
const ButtonAll = () => {
  return (
    <div>
      <div className={cx("btn_viewAll")}>
        <button>Xem tất cả</button>
      </div>
    </div>
  );
};

export default ButtonAll;
