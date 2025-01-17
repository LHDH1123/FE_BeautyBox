import React from "react";
import classNames from "classnames/bind";
import styles from "./Brand.module.scss";
import Table from "../../components/Table";

const cx = classNames.bind(styles);

const Brand = () => {
  return (
    <div className={cx("brand")}>
      <Table />
    </div>
  );
};

export default Brand;
