import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import HeaderLink from "../../components/HeaderLink";
import ListCategory from "../../components/ListCategory";
import Sidebar from "../../components/Sidebar";
import Filter from "../../components/Filter";
import { FilterProvider } from "../../Context/FilterContext"; // Import FilterProvider
import { useLocation } from "react-router-dom";

const cx = classNames.bind(styles);

const Product = () => {
  const location = useLocation();
  const { id, title, brandId } = location.state || {};

  const [totalProducts, setTotalProducts] = useState(0);

  return (
    <FilterProvider>
      <div className={cx("product")}>
        {title && <HeaderLink title={title} />}
        <Filter total={totalProducts} />
        <div className={cx("container")}>
          <div className={cx("sidebar")}>
            <Sidebar />
          </div>
          <ListCategory
            id={id}
            brandId={brandId}
            onTotalChange={setTotalProducts}
          />
        </div>
      </div>
    </FilterProvider>
  );
};

export default Product;
