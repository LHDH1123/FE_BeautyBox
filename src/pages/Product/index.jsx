import React from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import HeaderLink from "../../components/HeaderLink";
import ListCategory from "../../components/ListCategory";
import Sidebar from "../../components/Sidebar";
import Filter from "../../components/Filter";
import { FilterProvider } from "../../Context/FilterContext"; // Import FilterProvider

const cx = classNames.bind(styles);

const Product = () => {
  return (
    <FilterProvider>
      <div className={cx("product")}>
        <HeaderLink title="Sản phẩm" />
        <Filter total={794} />
        <div className={cx("container")}>
          <div className={cx("sidebar")}>
            <Sidebar />
          </div>
          <ListCategory />
        </div>
      </div>
    </FilterProvider>
  );
};

export default Product;
