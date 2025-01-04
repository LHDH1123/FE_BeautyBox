import React from "react";
import classNames from "classnames/bind";
import styles from "./Collection.module.scss";
import img1 from "../../../assets/images/menu-image-brand.webp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

Collection.propTypes = {
  props: PropTypes.string,
};

function Collection({ props }) {
  return (
    <div className={cx("collection")}>
      <div className={cx("collection-info")}>
        <div className={cx("title-collection")}>
          <div className={cx("title")}>
            {props === "Thương hiệu" ? "Tất cả thương hiệu" : props}
          </div>
          <div className={cx("icon")}>
            <ChevronRightIcon />
          </div>
        </div>
        <div className={cx("infos")}>
          <div className={cx("title-info")}>ahcd</div>
          <div className={cx("title-info")}>the face shop</div>
          <div className={cx("title-info")}>ahc</div>
          <div className={cx("title-info")}>the face shop</div>
          <div className={cx("title-info")}>ahc</div>
          <div className={cx("title-info")}>the face shop</div>
          <div className={cx("title-info")}>ahc</div>
          <div className={cx("title-info")}>the face shop</div>
          <div className={cx("title-info")}>ahc</div>
          <div className={cx("title-info")}>the face shop</div>
          <div className={cx("title-info")}>the face shop</div>
          <div className={cx("title-info")}>ahc</div>
        </div>
      </div>
      <div className={cx("img-collection")}>
        <div className={cx("img")}>
          <img src={img1} alt="" />
        </div>
        <div className={cx("img")}>
          <img src={img1} alt="" />
        </div>
        <div className={cx("img")}>
          <img src={img1} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Collection;
