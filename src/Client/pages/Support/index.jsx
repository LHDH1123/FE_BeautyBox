import React from "react";
import classNames from "classnames/bind";
import styles from "./Support.module.scss";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import MessageIcon from "@mui/icons-material/Message";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

const cx = classNames.bind(styles);

const Support = () => {
  return (
    <div className={cx("support")}>
      <div className={cx("list-service")}>
        <div className={cx("service")}>
          <div className={cx("icon")}>
            <HelpOutlineIcon fontSize="large" />
          </div>
          <a href="/">Các câu hỏi thường gặp</a>
          <br />
        </div>
        <div className={cx("service")}>
          <div className={cx("icon")}>
            <PriorityHighIcon fontSize="large" />
          </div>

          <a href="/">Đánh giá chất lượng dịch vụ</a>
          <br />
        </div>
        <div className={cx("service")}>
          <div className={cx("icon")}>
            <StorefrontIcon fontSize="large" />
          </div>

          <a href="/">Tìm cửa hàng gần nhất</a>
          <br />
        </div>
      </div>

      <div className={cx("title")}>
        Quý khách có thể liên hệ với chúng tôi qua các hình thức sau
      </div>

      <div className={cx("list-service")}>
        <div className={cx("service")}>
          <div className={cx("icon")}>
            <PhoneIcon fontSize="large" />
          </div>
          <a href="/">Gọi chúng tôi</a>
          <span>0932598727</span>
        </div>
        <div className={cx("service")}>
          <div className={cx("icon")}>
            <MailOutlineIcon fontSize="large" />
          </div>

          <a href="/">Gởi email cho chúng tôi</a>
          <span>lehuuduchuy124@gmail.com</span>
        </div>
        <div className={cx("service")}>
          <div className={cx("icon")}>
            <MessageIcon fontSize="large" />
          </div>

          <a href="/">Để lại lời nhắn cho chúng tôi</a>
        </div>
      </div>
    </div>
  );
};

export default Support;
