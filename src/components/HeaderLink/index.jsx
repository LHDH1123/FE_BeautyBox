import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./HeaderLink.module.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ScanIcon from "../../assets/scan-image.gif";

const cx = classNames.bind(styles);

HeaderLink.propTypes = {
  title: PropTypes.string,
};

function HeaderLink({ title }) {
  return (
    <div className={cx("header-link")}>
      <div className={cx("content-link")}>
        <div>
          <ul className={cx("link")}>
            <li className={cx("link-li")}>
              <a href="/">Trang chủ</a>
              <span>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  style={{ color: "#797979" }}
                />
              </span>
            </li>
            <li className={cx("link-li")}>
              <a href="/">{title}</a>
            </li>
          </ul>
        </div>

        <div className={cx("title")}>{title}</div>
      </div>

      <div className={cx("search")}>
        <button className={cx("scan-search")}>
          <img src={ScanIcon} alt="" />
          <div className={cx("title-search")}>Tìm kiếm bằng hình ảnh</div>
        </button>
      </div>
    </div>
  );
}

export default HeaderLink;
