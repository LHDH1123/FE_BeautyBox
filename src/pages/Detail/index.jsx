import React from "react";
import classNames from "classnames/bind";
import styles from "./Detail.module.scss";
import DetailProduct from "../../components/DetailProduct";

const cx = classNames.bind(styles);

const Detail = () => {
  return (
    <div className={cx("pageDetail")}>
      <DetailProduct />
    </div>
  );
};

export default Detail;
