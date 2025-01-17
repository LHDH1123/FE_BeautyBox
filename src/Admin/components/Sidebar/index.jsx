import React from "react";
import classNames from "classnames/bind";
import styles from "./SidebarAdmin.module.scss";
import logo from "../../../assets/images/logo.webp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Shield";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LogoutIcon from "@mui/icons-material/Logout";

const cx = classNames.bind(styles);

const Sidebar = () => {
  return (
    <div className={cx("sidebar")}>
      <div className={cx("sidebar-img")}>
        <img src={logo} alt="" />
      </div>
      <ul className={cx("nav")}>
        <li className={cx("submenu")}>
          <div className={cx("title-submenu")}>
            <span>Trang chính</span>
          </div>
          <ul>
            <li className={cx("submenu")}>
              <a href="/adminbb">
                <DashboardIcon fontSize="small" />
                <span>Trang chủ</span>
              </a>
            </li>
          </ul>
        </li>
        <div className={cx("separate")}></div>
        <li className={cx("submenu")}>
          <div className={cx("title-submenu")}>
            <span>Quản lý sản phẩm</span>
          </div>
          <ul>
            <li className={cx("submenu")}>
              <a href="/adminbb/product-list">
                <InventoryIcon fontSize="small" />
                <span>Sản phẩm</span>
              </a>
            </li>
            <li className={cx("submenu")}>
              <a href="/adminbb/category">
                <CategoryIcon fontSize="small" />
                <span>Danh mục</span>
              </a>
            </li>
            <li className={cx("submenu")}>
              <a href="/adminbb/brand-list">
                <LocalOfferIcon fontSize="small" />
                <span>Thương hiệu</span>
              </a>
            </li>
            <li className={cx("submenu")}>
              <a href="/adminbb/flashsale">
                <FlashOnIcon fontSize="small" />
                <span>Flash Sale</span>
              </a>
            </li>
          </ul>
        </li>
        <div className={cx("separate")}></div>
        <li className={cx("submenu")}>
          <div className={cx("title-submenu")}>
            <span>Quản lý người dùng</span>
          </div>
          <ul>
            <li className={cx("submenu")}>
              <a href="/adminbb/user">
                <PersonIcon fontSize="small" />
                <span>Người dùng</span>
              </a>
            </li>
            <li className={cx("submenu")}>
              <a href="/adminbb/role">
                <ShieldIcon fontSize="small" />
                <span>Vai trò & Quyền</span>
              </a>
            </li>
          </ul>
        </li>
        <div className={cx("separate")}></div>
        <li className={cx("submenu")}>
          <div className={cx("title-submenu")}>
            <span>Cài đặt</span>
          </div>
          <ul>
            <li className={cx("submenu")}>
              <a href="/adminbb">
                <LogoutIcon fontSize="small" />
                <span>Đăng xuất</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
