import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Apply.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { changeMulti } from "../../../services/brand.service";
import { changeMultiCategory } from "../../../services/category.service";
import { changeMultiProduct } from "../../../services/product.service";
import { changeMultiAccount } from "../../../services/account.service";

const cx = classNames.bind(styles);

const Apply = ({
  selectedBrands,
  fetchBrands,
  fetchCategorys,
  selectedCategorys,
  selectedProducts,
  fetchProducts,
  selectedAccounts,
  fetchAccount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("Tất cả");
  const dropdownRef = useRef(null);

  const tags = ["Xóa tất cả", "Hoạt động", "Không hoạt động"];

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Xử lý chọn tag từ dropdown
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setIsDropdownOpen(false);
  };

  // Xử lý áp dụng thay đổi
  const handleApply = async () => {
    if (!selectedTag.length) {
      alert("Vui lòng chọn ít nhất một thương hiệu hoặc danh mục.");
      return;
    }

    let data = {};
    let dataCategory = {};
    let dataProduct = {};
    let dataAccount = {};

    switch (selectedTag) {
      case "Xóa tất cả":
        data = { ids: selectedBrands, key: "deleted", value: true };
        dataCategory = { ids: selectedCategorys, key: "delete", value: true };
        dataProduct = { ids: selectedProducts, key: "delete", value: true };
        dataAccount = { ids: selectedAccounts, key: "delete", value: true };
        break;
      case "Hoạt động":
        data = { ids: selectedBrands, key: "status", value: true };
        dataCategory = { ids: selectedCategorys, key: "status", value: true };
        dataProduct = { ids: selectedProducts, key: "status", value: true };
        dataAccount = { ids: selectedAccounts, key: "status", value: true };
        break;
      case "Không hoạt động":
        data = { ids: selectedBrands, key: "status", value: false };
        dataCategory = { ids: selectedCategorys, key: "status", value: false };
        dataProduct = { ids: selectedProducts, key: "status", value: false };
        dataAccount = { ids: selectedAccounts, key: "status", value: false };
        break;
      default:
        return;
    }

    try {
      if (selectedBrands !== undefined) {
        if (selectedTag === "Xóa tất cả") {
          if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này không?"))
            return;
        }
        await changeMulti(data);
        await fetchBrands();
      }

      if (selectedCategorys !== undefined) {
        if (selectedTag === "Xóa tất cả") {
          if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này không?"))
            return;
        }
        await changeMultiCategory(dataCategory);
        await fetchCategorys();
      }

      if (selectedProducts !== undefined) {
        if (selectedTag === "Xóa tất cả") {
          if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này không?"))
            return;
        }
        await changeMultiProduct(dataProduct);
        await fetchProducts();
      }

      if (selectedAccounts !== undefined) {
        if (selectedTag === "Xóa tất cả") {
          if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này không?"))
            return;
        }
        console.log(dataAccount);
        await changeMultiAccount(dataAccount);
        await fetchAccount();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  return (
    <div className={cx("apply")} ref={dropdownRef}>
      <div className={cx("select")}>
        <div
          className={cx("tag-filter")}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <div className={cx("title-tag")}>{selectedTag}</div>
          <KeyboardArrowDownIcon />
        </div>

        {isDropdownOpen && (
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
