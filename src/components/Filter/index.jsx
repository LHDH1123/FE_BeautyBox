import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Filter.module.scss";

const cx = classNames.bind(styles);

Filter.propTypes = {
  total: PropTypes.number,
};

function Filter({ total }) {
  return (
    <div className={cx("filter")}>
      <div className={cx("filter-header")}>BỘ LỌC</div>
      <div className={cx("filter-tags")}></div>

      <div className={cx("filter-results")}>
        <span>{total} Kết quả</span>
        <span style={{ marginLeft: "15px" }}>Lọc theo</span>
        <select className={cx("filter-select")}>
          <option value="all">Tất cả</option>
          <option value="increase">Giá tăng dần</option>
          <option value="decrease">Giá giảm dần</option>
          <option value="percent">% giảm</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
