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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Dialog, Box, DialogActions } from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Cart from "../Cart";
import CartFav from "../CartFav";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Header = () => {
  const scrollableRef = useRef(null);
  const divRef = useRef(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const [isModalUpload, setIsModalUpload] = useState(false);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [isModalCart, setIsModalCart] = useState(false);
  const [isModalLike, setIsModalLike] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const [selectedCart, setSelectedCart] = useState("delivery");
  const navigate = useNavigate();

  const handleNavigateStore = () => {
    navigate("/stores");
  };

  const handleNavigateSupport = () => {
    navigate("/help-center");
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const handleOutsideClick = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setIsMore(false);
    }
  };

  // Thêm event listener khi component mount và remove khi unmount
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

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

  const handleOpenModal = () => {
    setIsModalUpload(true);
  };

  const handleCloseModal = () => {
    setIsModalUpload(false);
  };

  const handleOpenModalLogin = () => {
    setIsModalLogin(true);
  };

  const handleCloseModalLogin = () => {
    setIsModalLogin(false);
  };

  const handleOpenModalCart = () => {
    setIsModalCart(true);
  };

  const handleCloseModalCart = () => {
    setIsModalCart(false);
  };

  const handleOpenModalLike = () => {
    setIsModalLike(true);
  };

  const handleCloseModalLike = () => {
    setIsModalLike(false);
  };

  const handleOpenMore = () => {
    if (isMore === false) {
      setIsMore(true);
    } else {
      setIsMore(false);
    }
  };

  const handleButtonCart = (buttonId) => {
    setSelectedCart(buttonId);
  };

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
            <button className={cx("scan-search")} onClick={handleOpenModal}>
              <img src={ScanIcon} alt="" />
            </button>
          </div>

          <div className={cx("menu-section")}>
            <div className={cx("icon-section")} onClick={handleNavigateStore}>
              <StoreIcon fontSize="medium" style={{ color: "#4b4b4b" }} />
              <p>Hệ thống cửa hàng</p>
            </div>
            <div className={cx("icon-section")}>
              <NewspaperIcon fontSize="medium" style={{ color: "#4b4b4b" }} />
              <p>Tạp chí làm đẹp</p>
            </div>
            <div
              className={cx("icon-section")}
              onClick={handleOpenMore}
              ref={divRef}
            >
              <MoreHorizIcon fontSize="medium" />
              {isMore && (
                <div className={cx("more")}>
                  <ul className={cx("list-more")}>
                    <li className={cx("item")} onClick={handleNavigateSupport}>
                      <SupportAgentIcon
                        style={{ color: "#4b4b4b", fontSize: "24px" }}
                      />
                      Trung tâm hỗ trợ
                    </li>
                    <li className={cx("item")} onClick={handleNavigateProfile}>
                      <ManageSearchIcon style={{ color: "#4b4b4b" }} />
                      Tra cứu đơn hàng
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div
              className={cx("icon-section")}
              style={{ borderLeft: "groove" }}
              onClick={handleOpenModalLogin}
            >
              <UserIcon
                fontSize="medium"
                style={{ color: "#4b4b4b", marginLeft: "16px" }}
              />
              <p>Đăng nhập</p>
            </div>
            <div className={cx("icon-section")}>
              <FavoriteBorderIcon
                fontSize="medium"
                onClick={handleOpenModalLike}
              />
            </div>
            <div className={cx("icon-section")}>
              <ShoppingBagOutlinedIcon
                fontSize="medium"
                onClick={handleOpenModalCart}
              />
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

      {/* Search upload image */}
      <Dialog
        open={isModalUpload} // Ensure this is boolean
        onClose={handleCloseModal}
        PaperProps={{
          style: {
            marginTop: "-140px", // Dịch lên trên 40px
            borderRadius: "16px", // Bo góc 16px
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModal}>
                <CloseOutlinedIcon />
              </button>
            </div>
          </DialogActions>
          <div className={cx("content")}>
            <div className={cx("search-image")}>
              <div className={cx("title")}>Tìm kiếm bằng hình ảnh</div>
              <div className={cx("title-description")}>
                Chụp hình sản phẩm bạn đang muốn tìm và tải lên để chúng tôi
                nhận dạng. Kết quả tốt nhất khi bạn chụp trực diện sản phẩm có
                kèm label.
              </div>
              <div className={cx("upload")}>
                <div className={cx("upload-image")}>
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M45.5 45.5H10.5C9.57174 45.5 8.6815 45.1313 8.02513 44.4749C7.36875 43.8185 7 42.9283 7 42V17.5C7 16.5717 7.36875 15.6815 8.02513 15.0251C8.6815 14.3687 9.57174 14 10.5 14H17.4987L20.9987 8.75H34.9987L38.4987 14H45.5C46.4283 14 47.3185 14.3687 47.9749 15.0251C48.6313 15.6815 49 16.5717 49 17.5V42C49 42.9283 48.6313 43.8185 47.9749 44.4749C47.3185 45.1313 46.4283 45.5 45.5 45.5Z"
                      stroke="url(#paint0_linear_1066_11035)"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M28 36.75C32.3492 36.75 35.875 33.2242 35.875 28.875C35.875 24.5258 32.3492 21 28 21C23.6508 21 20.125 24.5258 20.125 28.875C20.125 33.2242 23.6508 36.75 28 36.75Z"
                      stroke="url(#paint1_linear_1066_11035)"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <defs>
                      <linearGradient
                        id="paint0_linear_1066_11035"
                        x1="7"
                        y1="8.75"
                        x2="44.8969"
                        y2="49.4788"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FFD400"></stop>
                        <stop offset="0.505208" stop-color="#C73130"></stop>
                        <stop offset="0.996106" stop-color="#663695"></stop>
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_1066_11035"
                        x1="20.125"
                        y1="21"
                        x2="36.378"
                        y2="36.2841"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FFD400"></stop>
                        <stop offset="0.505208" stop-color="#C73130"></stop>
                        <stop offset="0.996106" stop-color="#663695"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className={cx("title-upload")}>Tải ảnh lên</div>
                </div>
                <div className={cx("upload-image")}>
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.3333 18.6667H46.6667M17.5933 27.37L29.26 7.16333M22.26 36.7033L10.5933 16.4967M32.6667 37.3333H9.33333M38.4067 28.63L26.74 48.8367M33.74 19.2967L45.4067 39.5033M49 28C49 39.598 39.598 49 28 49C16.402 49 7 39.598 7 28C7 16.402 16.402 7 28 7C39.598 7 49 16.402 49 28Z"
                      stroke="url(#paint0_linear_1218_13596)"
                      stroke-width="2"
                      stroke-miterlimit="10"
                    ></path>
                    <defs>
                      <linearGradient
                        id="paint0_linear_1218_13596"
                        x1="7"
                        y1="7"
                        x2="50.3414"
                        y2="47.7576"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FFD400"></stop>
                        <stop offset="0.505208" stop-color="#C73130"></stop>
                        <stop offset="0.996106" stop-color="#663695"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className={cx("title-upload")}>Chụp bằng webcam</div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Login */}
      <Dialog
        open={isModalLogin} // Ensure this is boolean
        onClose={handleCloseModalLogin}
        PaperProps={{
          style: {
            marginTop: "-30px", // Dịch lên trên 40px
            borderRadius: "16px", // Bo góc 16px
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalLogin}>
                <CloseOutlinedIcon />
              </button>
            </div>
          </DialogActions>
          <div className={cx("content-login")}>
            <div className={cx("search-image")}>
              <div className={cx("title")}>Đăng nhập</div>
              <div
                className={cx("title-description")}
                style={{ padding: "0px 62px" }}
              >
                Bạn chưa có tài khoản? Không cần đăng ký. Đăng nhập nhanh với
                Beauty Box bằng số điện thoại.
              </div>
            </div>

            <div className={cx("auth")}>
              <div className={cx("input-login")}>
                <input type="text" name="" id="" />
              </div>
              <button type="submit">Đăng nhập</button>
            </div>
            <div className={cx("text-login")}>
              *Vui lòng không hủy đơn hàng khi đã thanh toán*
            </div>
            <div className={cx("note-login")}>
              Đăng nhập ngay để mua sắm dễ dàng hơn, sử dụng những tiện ích mới
              nhất và tận hưởng thêm nhiều ưu đãi độc quyền dành riêng cho thành
              viên Beauty Box.
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Giỏ hàng */}
      <Dialog
        open={isModalCart}
        onClose={handleCloseModalCart}
        disablePortal
        PaperProps={{
          style: {
            margin: "0px",
            position: "fixed",
            top: "0px",
            right: "0px",
            height: "100vh",
            width: "490px",
            overflow: "hidden",
            maxHeight: "100vh",
          },
        }}
      >
        <Box>
          <div className={cx("header-cart")}>
            <div className={cx("title-cart")}>Giỏ hàng của tôi</div>

            <button onClick={handleCloseModalCart}>
              <CloseOutlinedIcon />
            </button>
          </div>

          <div className={cx("body-cart")}>
            <div className={cx("page-cart")}>
              <div
                className={classNames(cx("cart-btn"), {
                  selected: selectedCart === "delivery", // Kiểm tra nếu nút giao hàng được chọn
                })}
                style={{
                  backgroundColor: selectedCart === "delivery" ? "black" : "", // Đổi màu nền nếu nút này được chọn
                  color: selectedCart === "delivery" ? "#fff" : "", // Đổi màu chữ nếu nút này được chọn
                }}
                onClick={() => handleButtonCart("delivery")}
              >
                Giao hàng (0)
              </div>
              <div
                className={classNames(cx("cart-btn"), {
                  selected: selectedCart === "pickup",
                })}
                style={{
                  backgroundColor: selectedCart === "pickup" ? "black" : "",
                  color: selectedCart === "pickup" ? "#fff" : "",
                }}
                onClick={() => handleButtonCart("pickup")}
              >
                Lấy tại cửa hàng (0)
              </div>
            </div>

            <div>
              {selectedCart === "delivery" && (
                // <div className={cx("cart")}>
                //   Bạn chưa có sản phẩm nào trong giỏ hàng
                // </div>
                <Cart />
              )}

              {selectedCart === "delivery" && (
                <div className={cx("checkout")}>
                  <div className={cx("shipment")}>
                    <div className={cx("title-checkout")}>Giao hàng</div>
                    <div className={cx("price")}>0đ</div>
                  </div>

                  <div
                    className={cx("shipment")}
                    style={{ marginBottom: "16px", color: "rgb(182 182 182)" }}
                  >
                    <div className={cx("title-checkout")}>Click & Collect</div>
                    <div className={cx("price")}>0đ</div>
                  </div>

                  <div className={cx("btn-checkout")}>
                    <button type="submit">
                      Tiếp tục với hình thức giao hàng
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              {selectedCart === "pickup" && (
                <div className={cx("cart")}>
                  Bạn chưa có sản phẩm nào trong giỏ hàng Click & Collect
                </div>
              )}

              {selectedCart === "pickup" && (
                <div className={cx("checkout")}>
                  <div className={cx("shipment")}>
                    <div className={cx("title-checkout")}>Giao hàng</div>
                    <div className={cx("price")}>0đ</div>
                  </div>

                  <div
                    className={cx("shipment")}
                    style={{ marginBottom: "16px", color: "rgb(182 182 182)" }}
                  >
                    <div className={cx("title-checkout")}>Click & Collect</div>
                    <div className={cx("price")}>0đ</div>
                  </div>

                  <div className={cx("btn-checkout")}>
                    <button type="submit">
                      Tiếp tục với hình thức giao hàng Click & Collect
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Ưa thích */}

      <Dialog
        open={isModalLike}
        onClose={handleCloseModalLike}
        disablePortal
        PaperProps={{
          style: {
            margin: "0px",
            position: "fixed",
            top: "0px",
            right: "0px",
            height: "100vh",
            width: "378px",
            overflow: "hidden",
            maxHeight: "100vh",
          },
        }}
      >
        <Box>
          <div className={cx("header-cart")}>
            <div className={cx("title-fav")} style={{ margin: "10px 0px" }}>
              Ưa thích
            </div>

            <button style={{ fontSize: "14px", fontWeight: "700" }}>
              Xóa hết
            </button>
          </div>

          <div className={cx("body-fav")}>
            <CartFav />
          </div>
        </Box>
      </Dialog>
    </header>
  );
};

export default Header;
