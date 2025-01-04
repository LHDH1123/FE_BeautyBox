import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import logo from "../../../assets/images/logo.webp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const cx = classNames.bind(styles);

const Footer = () => {
  const [isFocused, setIsFocused] = useState(false);

  // Hàm cuộn trang lên đầu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Cuộn mượt mà
    });
  };

  return (
    <div className={cx("footer")}>
      <div className={cx("footer_container")}>
        <div className={cx("text-left")}>
          <div className={cx("title")}>NHẬN BẢN TIN LÀM ĐẸP</div>
          <div className={cx("sub-title")}>
            Đừng bỏ lỡ hàng ngàn sản phẩm và chương trình siêu hấp dẫn
          </div>
        </div>
        <div className={cx("input-email", { "show-container": isFocused })}>
          <input
            placeholder="Điền email của bạn"
            className={cx("ant-input")}
            type="text"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <button className={cx("btn_fllow")}>THEO DÕI</button>
        </div>
      </div>

      <div className={cx("info")}>
        <div className={cx("social")}>
          <div className={cx("logo_footer")}>
            <a href="/">
              <img className={cx("logo-img")} alt="logo" src={logo} onClick={scrollToTop}/>
            </a>
          </div>
          <div className={cx("social_footer")}>
            <FacebookIcon fontSize="large" />
            <InstagramIcon fontSize="large" />
          </div>
        </div>

        <div className={cx("info-bbox")}>
          <div className={cx("info-title")}>
            <div className={cx("title_footer")}>VỀ BEAUTYBOX</div>
            <div className={cx("title_chil")}>
              <div className={cx("info_chil")}>Câu chuyện thương hiệu</div>
              <div className={cx("info_chil")}>Về chúng tôi</div>
              <div className={cx("info_chil")}>Liên hệ</div>
            </div>
          </div>
          <div className={cx("info-title")}>
            <div className={cx("title_footer")}>Chính sách</div>
            <div className={cx("title_chil")}>
              <div className={cx("info_chil")}>
                Chính sách và quy định chung
              </div>
              <div className={cx("info_chil")}>
                Chính sách và giao nhận thanh toán
              </div>
              <div className={cx("info_chil")}>Chính sách đổi trả sản phẩm</div>
              <div className={cx("info_chil")}>
                Chính sách bảo mật thông tin cá nhân
              </div>
              <div className={cx("info_chil")}>Điều khoản sử dụng</div>
            </div>
          </div>
          <div className={cx("info-title")}>
            <div className={cx("title_footer")}>My Beauty Box</div>
            <div className={cx("title_chil")}>
              <div className={cx("info_chil")}>Quyền lợi thành viên </div>
              <div className={cx("info_chil")}>Thông tin thành viên</div>
              <div className={cx("info_chil")}>Theo dõi đơn hàng</div>
              <div className={cx("info_chil")}>Hướng dẫn mua hàng online</div>
            </div>
          </div>
          <div className={cx("info-title")}>
            <div className={cx("title_footer")}>Đôi tác - liên kết</div>
            <div className={cx("title_chil")}>
              <div className={cx("info_chil")}>THE FACE SHOP Vietnam</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
