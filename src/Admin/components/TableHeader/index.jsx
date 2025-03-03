import React from "react";
import classNames from "classnames/bind";
import styles from "./TableHeader.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Apply from "../Apply";

const cx = classNames.bind(styles);

const TableHeader = ({
  selectedBrands,
  fetchBrands,
  handleSearchChange,
  selectedCategorys,
  fetchCategorys,
  handleSearchCategory,
  selectedProducts,
  fetchProducts,
  handleSearchChangeProduct,
}) => {
  const handleSearch = (event) => {
    if (handleSearchChange) handleSearchChange(event);
    if (handleSearchCategory) handleSearchCategory(event);
    if (handleSearchChangeProduct) handleSearchChangeProduct(event);
  };
  return (
    <div className={cx("tableHeader")}>
      <div className={cx("table-top")}>
        <div className={cx("search-set")}>
          <div className={cx("search-input")}>
            <input type="text" placeholder="Tìm kiếm" onChange={handleSearch} />
            <SearchIcon />
          </div>
        </div>

        <Apply
          selectedBrands={selectedBrands}
          fetchBrands={fetchBrands}
          selectedCategorys={selectedCategorys}
          fetchCategorys={fetchCategorys}
          selectedProducts={selectedProducts}
          fetchProducts={fetchProducts}
        />

        <div className={cx("filter")}>
          <div className={cx("form-sort")}>
            <TuneIcon />
            <select className={cx("select")}>
              <option>Sắp xếp</option>
              <option>Mới nhất</option>
              <option>Cũ nhất</option>
              <option>A - Z</option>
              <option>Z - A</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
