import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Trademark.module.scss";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { getBrands } from "../../../services/brand.service";

const cx = classNames.bind(styles);

Trademark.propTypes = {
  data: PropTypes.object,
};

function Trademark(props) {
  const scrollableRef = useRef(null);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [listBrand, setListBrand] = useState([]);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await getBrands();
        if (response && response.length > 0) {
          setListBrand(response);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrand();
  }, []);

  const handleScroll = () => {
    const container = scrollableRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setIsLeftVisible(container.scrollLeft > 0);
      setIsRightVisible(container.scrollLeft < maxScrollLeft);
    }
  };

  useEffect(() => {
    const container = scrollableRef.current;
    if (container) {
      // Gọi `handleScroll` ngay lập tức để cập nhật trạng thái
      handleScroll();
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [listBrand]); // Gọi lại khi danh sách thương hiệu thay đổi

  const scrollLeft = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: -scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cx("brand")}>
      <div className={cx("list_trademark")}>
        {isLeftVisible && (
          <button className={cx("scroll-button", "left")} onClick={scrollLeft}>
            <ArrowLeftIcon />
          </button>
        )}
        <div className={cx("content_trademark")} ref={scrollableRef}>
          {listBrand.map((brand) => (
            <div key={brand._id} className={cx("trademark")}>
              <img src={brand.thumbnail} alt={brand.name} />
            </div>
          ))}
        </div>
        {isRightVisible && (
          <button
            className={cx("scroll-button", "right")}
            onClick={scrollRight}
          >
            <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
}

export default Trademark;
