import React from "react";
import classNames from "classnames/bind";
import styles from "./EditProduct.module.scss";
import Create from "../../components/Create";

const cx = classNames.bind(styles);

const EditProduct = () => {
  return (
    <div className={cx("Create")}>
      <Create title="Chỉnh sửa sản phẩm" />
    </div>
  );
};

export default EditProduct;
