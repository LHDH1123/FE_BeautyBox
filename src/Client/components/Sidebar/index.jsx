import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useFilterContext } from "../../Context/FilterContext";
import { getAllProducts } from "../../../services/product.service";
import { getNameBrand } from "../../../services/brand.service";
import { getNameCategory } from "../../../services/category.service";

const cx = classNames.bind(styles);

function Sidebar() {
  const {
    selectedPriceRanges,
    setSelectedPriceRanges,
    selectedBrands,
    setSelectedBrands,
    selectedCategorys,
    setSelectedCategorys,
  } = useFilterContext();

  const [isPriceListVisible, setIsPriceListVisible] = useState(true);
  const [isBrandListVisible, setIsBrandListVisible] = useState(true);
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(true);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [visibleBrandCount, setVisibleBrandCount] = useState(5);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(5);

  const priceRanges = [
    { label: "Dưới 500.000₫", value: "Dưới 500.000₫" },
    { label: "500.000₫ - 1.000.000₫", value: "500.000₫ - 1.000.000₫" },
    { label: "1.000.000₫ - 1.500.000₫", value: "1.000.000₫ - 1.500.000₫" },
    { label: "1.500.000₫ - 2.000.000₫", value: "1.500.000₫ - 2.000.000₫" },
    { label: "Trên 2.000.000₫", value: "Trên 2.000.000₫" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getAllProducts();
        if (!productRes) return;

        const products = productRes;
        const uniqueBrandIds = [...new Set(products.map((p) => p.brand_id))];
        const uniqueCategoryIds = [
          ...new Set(products.map((p) => p.category_id)),
        ];

        const brandNames = await Promise.all(
          uniqueBrandIds.map(async (id) => {
            const name = await getNameBrand(id);
            return { id, name };
          })
        );

        const categoryNames = await Promise.all(
          uniqueCategoryIds.map(async (id) => {
            const name = await getNameCategory(id);
            return { id, name };
          })
        );

        setBrandList(brandNames.filter((b) => b.name));
        setCategoryList(categoryNames.filter((c) => c.name));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedPriceRanges((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleBrandCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedBrands((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleCategoryCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedCategorys((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const togglePriceList = () => setIsPriceListVisible((prev) => !prev);
  const toggleBrandList = () => setIsBrandListVisible((prev) => !prev);
  const toggleCategoryList = () => setIsCategoryListVisible((prev) => !prev);

  const toggleShowMoreBrands = () => {
    if (visibleBrandCount >= brandList.length) setVisibleBrandCount(5);
    else setVisibleBrandCount((prev) => prev + 5);
  };

  const toggleShowMoreCategories = () => {
    if (visibleCategoryCount >= categoryList.length) setVisibleCategoryCount(5);
    else setVisibleCategoryCount((prev) => prev + 5);
  };

  return (
    <div className={cx("sidebar")}>
      {/* Giá */}
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

      {/* Thương hiệu */}
      <div className={cx("section")}>
        <div className={cx("section-header")}>
          <div className={cx("title")}>Thương hiệu</div>
          <button onClick={toggleBrandList} className={cx("toggle-button")}>
            {isBrandListVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </button>
        </div>
        {isBrandListVisible && (
          <ul className={cx("list")}>
            {brandList.slice(0, visibleBrandCount).map((brand) => (
              <li key={brand.id}>
                <span className={cx("ant-checkbox")}>
                  <input
                    type="checkbox"
                    value={brand.name}
                    onChange={handleBrandCheckboxChange}
                    checked={selectedBrands.includes(brand.name)}
                  />
                </span>
                <label htmlFor={brand.name}>{brand.name}</label>
              </li>
            ))}
            {brandList.length > 5 && (
              <li className={cx("show-more")} onClick={toggleShowMoreBrands}>
                <span className={cx("more-text")}>
                  {visibleBrandCount >= brandList.length
                    ? "Thu gọn"
                    : "Xem thêm"}
                </span>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Danh mục */}
      <div className={cx("section")}>
        <div className={cx("section-header")}>
          <div className={cx("title")}>Loại sản phẩm</div>
          <button onClick={toggleCategoryList} className={cx("toggle-button")}>
            {isCategoryListVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </button>
        </div>
        {isCategoryListVisible && (
          <ul className={cx("list")}>
            {categoryList.slice(0, visibleCategoryCount).map((category) => (
              <li key={category.id}>
                <span className={cx("ant-checkbox")}>
                  <input
                    type="checkbox"
                    value={category.name}
                    onChange={handleCategoryCheckboxChange}
                    checked={selectedCategorys.includes(category.name)}
                  />
                </span>
                <label htmlFor={category.name}>{category.name}</label>
              </li>
            ))}
            {categoryList.length > 5 && (
              <li
                className={cx("show-more")}
                onClick={toggleShowMoreCategories}
              >
                <span className={cx("more-text")}>
                  {visibleCategoryCount >= categoryList.length
                    ? "Thu gọn"
                    : "Xem thêm"}
                </span>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
