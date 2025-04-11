import React, { useState } from "react";
import classNames from "classnames/bind";
import { useLocation, Link } from "react-router-dom"; // Sử dụng useLocation và Link
import styles from "./SidebarAdmin.module.scss";
import logo from "../../../assets/images/logo.webp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Shield";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../../../services/auth.service";
import { useAuth } from "../../Context/Auth.context";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const cx = classNames.bind(styles);

const Sidebar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const { permissions } = useAuth();

  const hasPermission = (key) => {
    return permissions?.includes(key);
  };

  // Hàm để thay đổi trạng thái active
  const handleActive = (path) => {
    setActivePath(path);
  };

  const logOut = async () => {
    await logout();
    handleActive("adminbb/login");
  };

  return (
    <div className={cx("sidebar")}>
      <div className={cx("sidebar-img")}>
        <img src={logo} alt="Logo" />
      </div>
      <ul className={cx("nav")}>
        <li className={cx("submenu")}>
          <div className={cx("title-submenu")}>
            <span>Trang chính</span>
          </div>
          <ul>
            <li
              className={cx("submenu", {
                active: activePath === "/adminbb",
              })}
            >
              <Link to="/adminbb" onClick={() => handleActive("/adminbb")}>
                <DashboardIcon fontSize="small" />
                <span>Trang chủ</span>
              </Link>
            </li>
          </ul>
        </li>
        <div className={cx("separate")}></div>
        <li className={cx("submenu")}>
          <div className={cx("title-submenu")}>
            <span>Quản lý sản phẩm</span>
          </div>
          <ul>
            {hasPermission("products_view") && (
              <li
                className={cx("submenu", {
                  active: activePath === "/adminbb/product-list",
                })}
              >
                <Link
                  to="/adminbb/product-list"
                  onClick={() => handleActive("/adminbb/product-list")}
                >
                  <InventoryIcon fontSize="small" />
                  <span>Sản phẩm</span>
                </Link>
              </li>
            )}
            {hasPermission("products-category_view") && (
              <li
                className={cx("submenu", {
                  active: activePath === "/adminbb/category",
                })}
              >
                <Link
                  to="/adminbb/category"
                  onClick={() => handleActive("/adminbb/category")}
                >
                  <CategoryIcon fontSize="small" />
                  <span>Danh mục</span>
                </Link>
              </li>
            )}
            {hasPermission("brands_view") && (
              <li
                className={cx("submenu", {
                  active: activePath === "/adminbb/brand-list",
                })}
              >
                <Link
                  to="/adminbb/brand-list"
                  onClick={() => handleActive("/adminbb/brand-list")}
                >
                  <LocalOfferIcon fontSize="small" />
                  <span>Thương hiệu</span>
                </Link>
              </li>
            )}
            {hasPermission("vouchers_view") && (
              <li
                className={cx("submenu", {
                  active: activePath === "/adminbb/flashsale",
                })}
              >
                <Link
                  to="/adminbb/flashsale"
                  onClick={() => handleActive("/adminbb/flashsale")}
                >
                  <TrendingDownIcon fontSize="small" />
                  <span>Giảm giá</span>
                </Link>
              </li>
            )}
          </ul>
        </li>
        <div className={cx("separate")}></div>
        <li className={cx("submenu")}>
          <div className={cx("title-submenu")}>
            <span>Quản lý người dùng</span>
          </div>
          <ul>
            {hasPermission("accounts_view") && (
              <li
                className={cx("submenu", {
                  active: activePath === "/adminbb/user",
                })}
              >
                <Link
                  to="/adminbb/user"
                  onClick={() => handleActive("/adminbb/user")}
                >
                  <PersonIcon fontSize="small" />
                  <span>Người dùng</span>
                </Link>
              </li>
            )}
            {hasPermission("roles_view") && (
              <li
                className={cx("submenu", {
                  active: activePath === "/adminbb/role",
                })}
              >
                <Link
                  to="/adminbb/role"
                  onClick={() => handleActive("/adminbb/role")}
                >
                  <ShieldIcon fontSize="small" />
                  <span>Vai trò & Quyền</span>
                </Link>
              </li>
            )}
          </ul>
        </li>
        <div className={cx("separate")}></div>
        <li className={cx("submenu")}>
          <div className={cx("title-submenu")}>
            <span>Cài đặt</span>
          </div>
          <ul>
            <li
              className={cx("submenu", {
                active: activePath === "/adminbb/profile",
              })}
            >
              <Link
                to="/adminbb/profile"
                onClick={() => handleActive("/adminbb/profile")}
              >
                <AssignmentIndIcon fontSize="small" />
                <span>Trang cá nhân</span>
              </Link>
            </li>
            <li
              className={cx("submenu", {
                active: activePath === "/adminbb/login",
              })}
            >
              <Link to="/adminbb/login" onClick={() => logOut()}>
                <LogoutIcon fontSize="small" />
                <span>Đăng xuất</span>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
