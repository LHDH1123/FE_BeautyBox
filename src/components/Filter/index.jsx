import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Filter.module.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { useFilterContext } from "../../Context/FilterContext"; // Import hook để sử dụng context

const cx = classNames.bind(styles);

Filter.propTypes = {
  total: PropTypes.number,
};

function Filter({ total }) {
  const { selectedPriceRanges, handleClearAll, handleClearTag } =
    useFilterContext(); // Sử dụng context

  return (
    <div className={cx("filter")}>
      <div className={cx("filter-header")}>BỘ LỌC</div>
      <div className={cx("filter-tags")}>
        {selectedPriceRanges.map((range) => (
          <div key={range} className={cx("tag")}>
            {range}{" "}
            <ClearIcon
              fontSize="inherit"
              style={{ marginLeft: "5px", cursor: "pointer" }}
              onClick={() => handleClearTag(range)} // Xử lý khi nhấn nút Clear của tag (chỉ xóa tag đó)
            />
          </div>
        ))}
        {selectedPriceRanges.length > 0 && (
          <div className={cx("btn-del")} onClick={handleClearAll}>
            Xóa hết
          </div>
        )}
      </div>

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
