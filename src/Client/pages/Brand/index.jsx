import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Brand.module.scss";
import Trademark from "../../components/Trademark";
import { getBrands } from "../../../services/brand.service";

const cx = classNames.bind(styles);

const Brand = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [listNameBrand, setListNameBrand] = useState([]);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await getBrands();
        if (response) {
          // Lấy danh sách tên thương hiệu và sắp xếp theo bảng chữ cái
          const brandNames = response.map((brand) => brand.name).sort();
          setListNameBrand(brandNames);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrand();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const halfPageHeight = document.documentElement.scrollHeight / 10;

      if (scrolled > halfPageHeight) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Nhóm các thương hiệu theo chữ cái đầu tiên
  const groupedBrands = listNameBrand.reduce((acc, brand) => {
    const firstLetter = brand[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {});

  return (
    <div className={cx("brand")} id="A-section">
      <Trademark />
      <div className={cx("all-brand")}>
        <div className={cx("title")}>Tất cả thương hiệu</div>

        {/* Hiển thị các chữ cái đầu tiên theo thứ tự ABC */}
        <div className={cx("letter-brand")}>
          {Object.keys(groupedBrands)
            .sort() // Sắp xếp các chữ cái đầu tiên theo thứ tự ABC
            .map((letter) => (
              <a key={letter} href={`#${letter}-section`}>
                {letter}
              </a>
            ))}
        </div>

        {/* Hiển thị danh sách thương hiệu theo từng chữ cái */}
        <div className={cx("letterAll-brand")}>
          {Object.keys(groupedBrands)
            .sort() // Sắp xếp theo thứ tự ABC
            .map((letter) => (
              <div
                key={letter}
                className={cx("ant-row")}
                id={`${letter}-section`}
              >
                <div className={cx("ant-col-md-4")}>
                  <div className={cx("section-title")}>{letter}</div>
                </div>
                <div className={cx("ant-col-md-20")}>
                  <div className={cx("ant-row-brand")}>
                    {groupedBrands[letter].map((brand) => (
                      <div key={brand} className={cx("list-brand")}>
                        <a role="presentation" href={`/products/${brand}`}>
                          <span className="size-16 link">{brand}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showScrollTop && (
        <button className={cx("scroll-to-top")} onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default Brand;
