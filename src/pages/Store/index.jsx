import React from "react";
import classNames from "classnames/bind";
import styles from "./Store.module.scss";
import HeaderLink from "../../components/HeaderLink";

const cx = classNames.bind(styles);

const Store = () => {
  return (
    <div className={cx("store")}>
      <HeaderLink title="Cửa hàng" />
      <h1>Store</h1>
    </div>
  );
};

export default Store;
