import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import HeaderLink from "../../components/HeaderLink";
import ListCategory from "../../components/ListCategory";
import Sidebar from "../../components/Sidebar";
import Filter from "../../components/Filter";
import { FilterProvider, useFilterContext } from "../../Context/FilterContext";
import { useLocation, useParams } from "react-router-dom";

const cx = classNames.bind(styles);

// Tách phần nội dung vào function nhỏ bên trong để dùng được context
const ProductContent = ({ slug, title, totalProducts, setTotalProducts }) => {
  const { selectedPriceRanges, selectedBrands, selectedCategorys } =
    useFilterContext(); // An toàn vì trong FilterProvider

  return (
    <div className={cx("product")}>
      {title && <HeaderLink title={title} />}
      <Filter total={totalProducts} />
      <div className={cx("container")}>
        <div className={cx("sidebar")}>
          <Sidebar />
        </div>
        <ListCategory
          slug={slug}
          onTotalChange={setTotalProducts}
          selectedPriceRanges={selectedPriceRanges}
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategorys}
        />
      </div>
    </div>
  );
};

const Product = () => {
  const location = useLocation();
  const { title } = location.state || {};
  const { slug } = useParams();
  const [totalProducts, setTotalProducts] = useState(0);

  return (
    <FilterProvider>
      <ProductContent
        title={title}
        slug={slug}
        totalProducts={totalProducts}
        setTotalProducts={setTotalProducts}
      />
    </FilterProvider>
  );
};

export default Product;
