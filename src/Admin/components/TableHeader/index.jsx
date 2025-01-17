import React from "react";
import classNames from "classnames/bind";
import styles from "./TableHeader.module.scss";
import SearchIcon from "@mui/icons-material/Search";
// import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import TuneIcon from "@mui/icons-material/Tune";

const cx = classNames.bind(styles);

const TableHeader = () => {
  return (
    <div className={cx("tableHeader")}>
      <div className={cx("table-top")}>
        <div className={cx("search-set")}>
          <div className={cx("search-input")}>
            <input type="text" placeholder="Tìm kiếm" />
            <SearchIcon />
          </div>
        </div>

        <div className={cx("filter")}>
          {/* <div className={cx("search-path")}>
            <FilterAltOutlinedIcon />
          </div> */}

          <div className={cx("form-sort")}>
            <TuneIcon />
            <select className={cx("select")}>
              <option>Sắp xếp </option>
              <option>Mới nhất</option>
              <option>Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
