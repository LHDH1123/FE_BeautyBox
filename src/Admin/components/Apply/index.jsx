import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Apply.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { changeMulti } from "../../../services/brand.service";

const cx = classNames.bind(styles);

const Apply = ({ selectedBrands, fetchBrands }) => {
  const [isBrand, setIsBrand] = useState(false);
  const [selectedTag, setSelectedTag] = useState("Tất cả");
  const dropdownRef = useRef(null);

  const tags = ["Xóa tất cả", "Hoạt động", "Không hoạt động"];

  const handleSelectBrand = () => {
    setIsBrand((prev) => !prev);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setIsBrand(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBrand(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleApply = async () => {
    if (!selectedTag.length) {
      alert("Vui lòng chọn ít nhất một thương hiệu.");
      return;
    }
    let data = {};
    switch (selectedTag) {
      case "Xóa tất cả":
        data = {
          ids: selectedBrands,
          key: "deleted",
          value: true,
        };
        break;
      case "Hoạt động":
        data = {
          ids: selectedBrands,
          key: "status",
          value: true,
        };
        break;
      case "Không hoạt động":
        data = {
          ids: selectedBrands,
          key: "status",
          value: false,
        };
        break;
      default:
        return;
    }
    try {
      await changeMulti(data);
      await fetchBrands();
      console.log(data);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  return (
    <div className={cx("apply")} ref={dropdownRef}>
      <div className={cx("select")}>
        <div className={cx("tag-filter")} onClick={handleSelectBrand}>
          <div className={cx("title-tag")}>{selectedTag}</div>
          <KeyboardArrowDownIcon />
        </div>
        {isBrand && (
          <div className={cx("select-tag")}>
            {tags.map((tag, index) => (
              <div
                key={index}
                className={cx("tag")}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={cx("submit")} onClick={handleApply}>
        <button>Áp dụng</button>
      </div>
    </div>
  );
};

export default Apply;
