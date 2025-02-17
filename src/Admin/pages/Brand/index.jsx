import React from "react";
import classNames from "classnames/bind";
import styles from "./Brand.module.scss";
import Table from "../../components/Table";
import { BrandProvider } from "../../Context/BrandContext";

const cx = classNames.bind(styles);

const Brand = () => {
  return (
    <div className={cx("brand")}>
      <BrandProvider>
        <Table />
      </BrandProvider>
    </div>
  );
};

export default Brand;
