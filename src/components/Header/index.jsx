import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "../../assets/images/logo.webp";
import ScanIcon from "../../assets/scan-image.gif";
import SearchIcon from "@mui/icons-material/Search";
import StoreIcon from "@mui/icons-material/Storefront";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import UserIcon from "@mui/icons-material/AccountCircleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const cx = classNames.bind(styles);

const Header = () => {
  const scrollableRef = useRef(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);

  const scrollLeft = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({ left: -1000, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({ left: 1000, behavior: "smooth" });
    }
  };

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
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <header className={cx("header")}>
      <div className={cx("header_container")}>
        <div className={cx("menu-content")}>
          <div className={cx("menu-item")}>Freeship 15K mọi đơn hàng</div>
          <div className={cx("separator")}></div>
          <div className={cx("menu-item")}>Quà tặng cho đơn từ 299K</div>
          <div className={cx("separator")}></div>
          <div className={cx("menu-item")}>
            Mua online nhận tại cửa hàng gần nhất
          </div>
        </div>
      </div>

      <div className={cx("header_content")}>
        <div className={cx("logo")}>
          <a href="/">
            <img className={cx("logo-img")} alt="logo" src={logo} />
          </a>
        </div>

        <div className={cx("right-header")}>
          <div className={cx("search-bar")}>
            <div className={cx("search-icon")}>
              <SearchIcon />
            </div>
            <input
              type="text"
              className={cx("search-input")}
              placeholder="Son chính hãng chỉ 189K"
            />
            <button className={cx("scan-search")}>
              <img src={ScanIcon} alt="" />
            </button>
          </div>

          <div className={cx("menu-section")}>
            <div className={cx("icon-section")}>
              <StoreIcon fontSize="medium" style={{ color: "#4b4b4b" }} />
              <p>Hệ thống cửa hàng</p>
            </div>
            <div className={cx("icon-section")}>
              <NewspaperIcon fontSize="medium" style={{ color: "#4b4b4b" }} />
              <p>Tạp chí làm đẹp</p>
            </div>
            <div className={cx("icon-section")}>
              <MoreHorizIcon fontSize="medium" />
            </div>
            <div
              className={cx("icon-section")}
              style={{ borderLeft: "groove" }}
            >
              <UserIcon
                fontSize="medium"
                style={{ color: "#4b4b4b", marginLeft: "16px" }}
              />
              <p>Đăng nhập</p>
            </div>
            <div className={cx("icon-section")}>
              <FavoriteBorderIcon fontSize="medium" />
            </div>
            <div className={cx("icon-section")}>
              <ShoppingBagOutlinedIcon fontSize="medium" />
            </div>
          </div>
        </div>
      </div>

      <div className={cx("scroll-container")}>
        {isLeftVisible && (
          <button className={cx("scroll-button", "left")} onClick={scrollLeft}>
            <ArrowLeftIcon />
          </button>
        )}
        <div className={cx("main_header", "scrollable")} ref={scrollableRef}>
          <div className={cx("menu-header")}>Thương hiệu</div>
          <div className={cx("menu-header")}>Khuyến mãi hot</div>
          <div className={cx("menu-header")}>Sản phẩm cao cấp</div>
          <div className={cx("menu-header")}>Trang điểm</div>
          <div className={cx("menu-header")}>Chăm sóc da</div>
          <div className={cx("menu-header")}>Chăm sóc cá nhân</div>
          <div className={cx("menu-header")}>Chăm sóc cơ thể</div>
          <div className={cx("menu-header")}>Mã giảm</div>
          <div className={cx("menu-header")}>Sản phẩm mới</div>

          <div className={cx("menu-header")}>Chăm sóc cơ thể</div>
          <div className={cx("menu-header")}>Mã giảm</div>
          <div className={cx("menu-header")}>Sản phẩm mới</div>
          <div className={cx("menu-header")}>Chăm sóc cơ thể</div>
          <div className={cx("menu-header")}>Mã giảm</div>
          <div className={cx("menu-header")}>Sản phẩm mới</div>
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
    </header>
  );
};

export default Header;
