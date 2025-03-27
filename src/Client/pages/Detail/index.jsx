import React from "react";
import classNames from "classnames/bind";
import styles from "./Detail.module.scss";
import DetailProduct from "../../components/DetailProduct";
import { useAuth } from "../../Context/AuthContext";

const cx = classNames.bind(styles);

const Detail = () => {
  const { setCart, setLike } = useAuth();

  return (
    <div className={cx("pageDetail")}>
      <DetailProduct setLike={setLike} setCart={setCart} />
    </div>
  );
};

export default Detail;
