import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useFilterContext } from "../../Context/FilterContext"; // Import hook để sử dụng context

const cx = classNames.bind(styles);

function Sidebar() {
  const { selectedPriceRanges, setSelectedPriceRanges } = useFilterContext(); // Sử dụng context
  const [isPriceListVisible, setIsPriceListVisible] = useState(true);

  const priceRanges = [
    { label: "Dưới 500.000₫", value: "Dưới 500.000₫" },
    { label: "500.000₫ - 1.000.000₫", value: "500.000₫ - 1.000.000₫" },
    { label: "1.000.000₫ - 1.500.000₫", value: "1.000.000₫ - 1.500.000₫" },
    { label: "1.500.000₫ - 2.000.000₫", value: "1.500.000₫ - 2.000.000₫" },
    { label: "Trên 2.000.000₫", value: "Trên 2.000.000₫" },
  ];

  useEffect(() => {
    // Khi selectedPriceRanges thay đổi, đồng bộ lại giá trị
  }, [selectedPriceRanges]);

  const togglePriceList = () => {
    setIsPriceListVisible((prevState) => !prevState);
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedPriceRanges((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value); // Bỏ chọn
      } else {
        return [...prevState, value]; // Thêm lựa chọn
      }
    });
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
                  <input
                    type="checkbox"
                    value={range.value}
                    onChange={handleCheckboxChange}
                    checked={selectedPriceRanges.includes(range.value)}
                  />
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
