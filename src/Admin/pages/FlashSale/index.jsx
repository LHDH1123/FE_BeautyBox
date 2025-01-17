import React from "react";
import classNames from "classnames/bind";
import styles from "./FlashSale.module.scss";
import Header from "../../../Admin/components/Header";
import TableHeader from "../../components/TableHeader";

const cx = classNames.bind(styles);

const FlashSale = () => {
  return (
    <div className={cx("table")}>
      <Header title="Flash Sale" />

      <div className={cx("table-list")}>
        <TableHeader />
      </div>
    </div>
  );
};

export default FlashSale;
