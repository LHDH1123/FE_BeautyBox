import React from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import HeaderLink from "../../components/HeaderLink";
import ListCategory from "../../components/ListCategory";
import Sidebar from "../../components/Sidebar";
import Filter from "../../components/Filter";

const cx = classNames.bind(styles);

const Product = () => {
  const listFilter = ["Giá sản phẩm"];
  return (
    <div className={cx("product")}>
      <HeaderLink title="Sản phẩm" />
      <Filter total={794} />
      <div className={cx("container")}>
        <div className={cx("sidebar")}>
          <Sidebar listFilter={listFilter} />
        </div>
        <ListCategory />
      </div>
    </div>
  );
};

export default Product;
