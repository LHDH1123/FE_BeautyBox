import React from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const cx = classNames.bind(styles);

const Header = ({ title }) => {
  return (
    <div className={cx("header")}>
      <div className={cx("title-header")}>
        <div className={cx("title")}>
          <div className={cx("title-page")}>{title}</div>
          <div className={cx("title-desc")}>Quản Lý {title} Của Bạn</div>
        </div>
      </div>
      <div className={cx("btn-add")}>
        <AddCircleOutlineIcon />
        <button>
          {title === "Vai Trò & Quyền" ? "Thêm Vai Trò" : `Thêm ${title}`}
        </button>
      </div>
    </div>
  );
};

export default Header;
