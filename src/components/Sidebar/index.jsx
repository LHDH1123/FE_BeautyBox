import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const cx = classNames.bind(styles);

function Sidebar() {
  const [isPriceListVisible, setIsPriceListVisible] = useState(true);

  const priceRanges = [
    { label: "Dưới 500.000₫", value: "under_500000" },
    { label: "500.000₫ - 1.000.000₫", value: "500000_1000000" },
    { label: "1.000.000₫ - 1.500.000₫", value: "1000000_1500000" },
    { label: "1.500.000₫ - 2.000.000₫", value: "1500000_2000000" },
    { label: "Trên 2.000.000₫", value: "over_2000000" },
  ];

  const togglePriceList = () => {
    setIsPriceListVisible((prevState) => !prevState);
  };

  return (
    <div className={cx("sidebar")}>
      <div className={cx("section")}>
        <div className={cx("section-header")}>
          <div className={cx("title")}>Giá sản phẩm</div>
          <button onClick={togglePriceList} className={cx("toggle-button")}>
            {isPriceListVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </button>
        </div>
        {isPriceListVisible && (
          <ul className={cx("list")}>
            {priceRanges.map((range) => (
              <li key={range.value}>
                <span className={cx("ant-checkbox")}>
                  <input type="checkbox" value={range.value}></input>
                </span>
                <label htmlFor={range.value}>{range.label}</label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={cx("section")}>
        <div className={cx("section-header")}>
          <div className={cx("title")}>Giá sản phẩm</div>
          <button onClick={togglePriceList} className={cx("toggle-button")}>
            {isPriceListVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </button>
        </div>
        {isPriceListVisible && (
          <ul className={cx("list")}>
            {priceRanges.map((range) => (
              <li key={range.value}>
                <span className={cx("ant-checkbox")}>
                  <input type="checkbox" value={range.value}></input>
                </span>
                <label htmlFor={range.value}>{range.label}</label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
