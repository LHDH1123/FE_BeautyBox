import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "../../../assets/images/logo.webp";
import ScanIcon from "../../../assets/scan-image.gif";
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
import { Dialog, Box, DialogActions, Snackbar, Alert } from "@mui/material";
import Cart from "../Cart";
import CartFav from "../CartFav";
import { useNavigate } from "react-router-dom";
import Collection from "../Collection";
import CategoryHeader from "../CategoryHeader";
import { getCategorys } from "../../../services/category.service";
import {
  forgotPasswordPost,
  getUser,
  loginPost,
  logout,
  otpPasswordPost,
  registerPost,
  resetPasswordPost,
} from "../../../services/user.service";
import { jwtDecode } from "jwt-decode";
import { AxiosInstance } from "../../../configs/axios";
import { deleteAllLike, getLike } from "../../../services/like.service";
import { useAuth } from "../../Context/AuthContext";
import { getCart } from "../../../services/cart.service";
import { getDetailProduct } from "../../../services/product.service";
import { MuiOtpInput } from "mui-one-time-password-input";

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
  const [isLogin, setIsLogin] = useState(false);
  const [selectedCart, setSelectedCart] = useState("delivery");
  const navigate = useNavigate();
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoginUser, setIsLoginUser] = useState(true);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [isModalOTP, setIsModalOTP] = useState(false);
  const [isResetPass, setIsResetPass] = useState(false);
  const [alertData, setAlertData] = useState("");
  const [countdown, setCountdown] = useState(180); // 3 phút = 180 giây

  const [emailForgot, setEmailForgot] = useState({
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [resetPass, setResetPass] = useState({
    confirmPass: "",
    password: "",
  });

  const [register, setRegister] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    confirmPass: "",
  });

  const {
    setUpdateUser,
    user,
    setUser,
    nameUser,
    setNameUser,
    cart,
    setCart,
    selectCart,
    setSelectCart,
    like,
    setLike,
  } = useAuth();

  // Tự động ẩn cảnh báo sau 10 giây

  const menuHeaders = [
    { id: 1, label: "Thương hiệu", title: "collection" },
    { id: 2, label: "Khuyến mãi hot", title: "new" },
    { id: 3, label: "Sản phẩm cao cấp", title: "new" },
    { id: 4, label: "Sản phẩm mới", title: "new" },
    // { id: 5, label: "Mã giảm", title: "new" },
  ];
  const [listCategorys, setListCategorys] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [isEmailPassword, setIsEmailPassword] = useState("");
  const [isHaveAcc, setIsHaveAcc] = useState(false);
  const [isDataRegister, setIsDataRegister] = useState(false);

  // Tự động ẩn cảnh báo sau 10 giây
  useEffect(() => {
    if (
      isEmailPassword !== null ||
      isHaveAcc ||
      isDataRegister ||
      alertData !== ""
    ) {
      const timer = setTimeout(() => {
        setIsEmailPassword(null);
        setIsHaveAcc(false);
        setIsDataRegister(false);
        setAlertData("");
      }, 2000); // 10s

      return () => clearTimeout(timer);
    }
  }, [isEmailPassword, isHaveAcc, isDataRegister, alertData]);

  useEffect(() => {
    let timer;

    if (isModalOTP && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isModalOTP, countdown]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cart || !cart.products) return;

      try {
        const productDetails = await Promise.all(
          cart.products.map(async (item) => {
            const product = await getDetailProduct(item.product_id);
            return {
              id: product[0]._id,
              SKU: product[0].SKU,
              title: product[0].title,
              price: product[0].price,
              discountPercentage: product[0].discountPercentage,
              quantity: item.quantity, // Lấy số lượng từ cart
            };
          })
        );

        const calculateTotalPrice = () => {
          const total = productDetails.reduce((acc, product) => {
            const discountedPrice =
              product.price -
              (product.price * product.discountPercentage) / 100;
            return acc + discountedPrice * product.quantity;
          }, 0);

          setTotalPrice(total);
        };

        calculateTotalPrice();
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProductDetails();
  }, [cart]);

  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        const response = await getCategorys();
        if (response) {
          const filteredCategories = response.filter(
            (category) => category.parent_id === ""
          );
          setListCategorys(filteredCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategorys();
  }, []);

  const handleNavigate = (label) => {
    if (label === "Thương hiệu") {
      navigate("/brands");
    }
    if (label === "Sản phẩm mới") {
      navigate(`/products/san-pham-moi`);
    }
  };

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
      handleScroll();
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [listCategorys]);

  const handleOpenModal = () => {
    setIsModalUpload(true);
  };

  const handleCloseModal = () => {
    setIsModalUpload(false);
  };

  const handleOpenModalLogin = () => {
    setIsLogin(!isLogin);
  };

  const handleModalLoginUser = () => {
    setIsModalLogin(true);
  };

  const handleCloseModalLogin = () => {
    setIsModalLogin(false);
    setIsForgotPass(false);
    setIsRegister(false);
    setIsLoginUser(true);
    setIsModalOTP(false);
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

  const handleListProduct = (slug, title) => {
    navigate(`/products/${slug}`, { state: { title } });
    // console.log(id, slug);
  };

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
    setRegister({ ...register, [e.target.name]: e.target.value });
    setEmailForgot({ ...emailForgot, [e.target.name]: e.target.value });
  };

  const handleChangePass = (e) => {
    setResetPass({ ...resetPass, [e.target.name]: e.target.value });
  };

  const handleLogin = async (isRegister) => {
    try {
      if (!login.email) {
        setIsEmailPassword(true);
        setIsDataRegister(true);
        return;
      }

      if (!login.password) {
        setIsEmailPassword(false);
        setIsDataRegister(true);
        return;
      }

      setIsEmailPassword("");

      if (!isRegister) {
        // 🟢 Xử lý đăng nhập
        const response = await loginPost(login);
        if (response === null) {
          setIsHaveAcc(true);
        }

        if (response?.accessToken) {
          const decodedUser = jwtDecode(response.accessToken);
          const userData = await getUser(decodedUser.userId);

          // ✅ Cập nhật state ngay lập tức
          setUser(userData.user);
          setNameUser(userData.user.fullName);
          setUpdateUser({
            id: userData.user._id,
            fullName: userData.user.fullName,
            email: userData.user.email,
            phone: userData.user.phone,
          });

          // ✅ Cập nhật Axios với token mới
          AxiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.accessToken}`;

          // ✅ Gọi API để cập nhật giỏ hàng & danh sách yêu thích
          const [cartData, likeData] = await Promise.all([
            getCart(userData.user._id),
            getLike(userData.user._id),
          ]);
          setCart(cartData);
          setLike(likeData);

          // ✅ Đóng modal login nếu có
          setIsModalLogin(false);
        }
      } else {
        if (!register.fullName) {
          setIsEmailPassword(true);
          setIsDataRegister(true);
          return;
        }

        if (!register.phone) {
          setIsEmailPassword(true);
          setIsDataRegister(true);
          return;
        }

        if (!register.email) {
          setIsEmailPassword(true);
          setIsDataRegister(true);
          return;
        }

        if (!register.password) {
          setIsEmailPassword(false);
          setIsDataRegister(true);
          return;
        }

        if (!register.confirmPass) {
          setIsEmailPassword(false);
          setIsDataRegister(true);
          return;
        }
        // 🔵 Xử lý đăng ký
        if (register.password !== register.confirmPass) {
          alert("Password and Confirm Password must be the same");
          return;
        }

        const response = await registerPost({
          fullName: register.fullName,
          email: register.email,
          password: register.password,
          phone: register.phone,
        });

        if (response) {
          console.log("🎉 Đăng ký thành công:", response);
          setRegister({
            fullName: "",
            email: "",
            password: "",
            phone: "",
            confirmPass: "",
          });
          setIsRegister(false);
        }
      }
    } catch (error) {
      console.error("❌ Lỗi đăng nhập / đăng ký:", error);
      setIsHaveAcc(true);
    }
  };

  const handleDeleteAllLike = async () => {
    if (like) {
      const response = await deleteAllLike(like.user_id);
      if (response) {
        console.log("Xóa tất cả sản phẩm thành công", response);
      }
    }
  };

  const handleLogOut = async () => {
    try {
      const response = await logout();
      if (response) {
        console.log("Logout successful:", response);
        setLike("");
        setCart("");
        setUser("");
        setIsLogin(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsLogin(false);
  };

  const handleNavigateCheckout = () => {
    if (cart) {
      navigate("/check-out", { state: selectCart });
      setIsModalCart(false);
    } else {
      console.log("không có sản phẩm nào trong giỏ hàng");
    }
  };

  const handleModalForgot = () => {
    setIsForgotPass(true);
    setIsRegister(false);
    setIsLoginUser(false);
  };

  const handleLoginUser = () => {
    setIsForgotPass(false);
    setIsRegister(false);
    setIsLoginUser(true);
  };

  const handleModalRegister = () => {
    setIsForgotPass(false);
    setIsRegister(true);
    setIsLoginUser(false);
  };

  const handleForgot = async () => {
    if (!emailForgot.email) {
      alert("Vui lòng nhập địa chỉ email");
      return;
    }

    try {
      const response = await forgotPasswordPost(emailForgot.email);
      if (response) {
        setIsForgotPass(false);
        setIsModalOTP(true);
      }
    } catch (error) {
      console.error(error);
      setAlertData(error.response.data.message);
    }
  };

  const handleOTP = async () => {
    if (!otp) {
      alert("Vui lòng nhập mã OTP");
    }
    try {
      const response = await otpPasswordPost({
        email: emailForgot.email,
        otp: otp,
      });
      if (response) {
        setIsModalOTP(false);
        setIsResetPass(true);
      }
    } catch (error) {
      console.log(error);
      setAlertData(error.response.data.message);
    }
  };

  const handleResetPass = async () => {
    if (!resetPass.password && !resetPass.confirmPass) {
      alert("Vui lòng nhập mật khẩu và xác nhận mật khẩu");
    }

    if (resetPass.password !== resetPass.confirmPass) {
      alert("Mật khẩu và xác nhận mật khẩu không trùng nhau");
    }

    try {
      const response = await resetPasswordPost({
        email: emailForgot.email,
        password: resetPass.password,
      });
      if (response) {
        setIsResetPass(false);
        setIsLoginUser(true);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setAlertData(error.response.data.message);
    }
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
                      <svg
                        width="29"
                        height="19"
                        viewBox="0 0 29 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M25.2908 18.1931C24.971 18.1931 24.6513 18.0652 24.3955 17.8094L22.605 16.0509H14.2919C12.7252 16.0509 11.4463 14.772 11.4463 13.2053V6.33098C11.4463 4.76429 12.7252 3.48535 14.2919 3.48535H26.154C27.7207 3.48535 28.9997 4.76429 28.9997 6.33098V13.1733C28.9997 14.5801 27.9765 15.7631 26.6017 15.9869V16.8822C26.6017 17.4257 26.2819 17.8734 25.8023 18.0652C25.6425 18.1611 25.4826 18.1931 25.2908 18.1931ZM14.2599 4.41258C13.2048 4.41258 12.3415 5.27586 12.3415 6.33098V13.1733C12.3415 14.2284 13.2048 15.0917 14.2599 15.0917H22.9567L25.035 17.138C25.1948 17.2979 25.3867 17.2339 25.4506 17.2019C25.5146 17.17 25.6744 17.074 25.6744 16.8502V15.0597H26.1221C27.1772 15.0597 28.0405 14.1964 28.0405 13.1413V6.33098C28.0405 5.27586 27.1772 4.41258 26.1221 4.41258H14.2599Z"
                          fill="black"
                        ></path>
                        <path
                          d="M8.21618 7.41801C8.21618 6.61868 8.63184 6.26697 9.01552 5.97921C9.36722 5.72343 9.65498 5.49961 9.65498 4.98804C9.65498 4.44449 9.23933 4.09278 8.72776 4.09278C8.21618 4.09278 7.76855 4.41252 7.73658 4.95606H6.90527C6.93725 3.837 7.80053 3.26147 8.72776 3.26147C9.68696 3.26147 10.5502 3.90094 10.5502 4.98804C10.5502 5.78737 10.1346 6.13908 9.7509 6.42684C9.43117 6.68263 9.11144 6.93841 9.11144 7.41801V7.57788H8.21618V7.41801ZM8.18421 8.18538H9.17538V9.20852H8.18421V8.18538Z"
                          fill="black"
                        ></path>
                        <path
                          d="M18.3209 10.4552C18.6917 10.4552 18.9923 10.1546 18.9923 9.78375C18.9923 9.41292 18.6917 9.1123 18.3209 9.1123C17.95 9.1123 17.6494 9.41292 17.6494 9.78375C17.6494 10.1546 17.95 10.4552 18.3209 10.4552Z"
                          fill="black"
                        ></path>
                        <path
                          d="M20.2076 10.4554C20.5784 10.4554 20.879 10.1548 20.879 9.78399C20.879 9.41316 20.5784 9.11255 20.2076 9.11255C19.8367 9.11255 19.5361 9.41316 19.5361 9.78399C19.5361 10.1548 19.8367 10.4554 20.2076 10.4554Z"
                          fill="black"
                        ></path>
                        <path
                          d="M22.0933 10.4554C22.4641 10.4554 22.7648 10.1548 22.7648 9.78399C22.7648 9.41316 22.4641 9.11255 22.0933 9.11255C21.7225 9.11255 21.4219 9.41316 21.4219 9.78399C21.4219 10.1548 21.7225 10.4554 22.0933 10.4554Z"
                          fill="black"
                        ></path>
                        <path
                          d="M3.70891 14.7078C3.54905 14.7078 3.3572 14.6758 3.19734 14.6118C2.71774 14.42 2.398 13.9404 2.398 13.4288V12.5336C1.05512 12.3098 0 11.1267 0 9.71991V2.84563C0 1.27894 1.27894 0 2.84563 0H14.7078C16.2745 0 17.5534 1.27894 17.5534 2.84563V3.93273H16.6262V2.84563C16.6262 1.79051 15.7629 0.927229 14.7078 0.927229H2.8776C1.82248 0.927229 0.959201 1.79051 0.959201 2.84563V9.68793C0.959201 10.7431 1.82248 11.6063 2.8776 11.6063H3.32523V13.3968C3.32523 13.6207 3.4851 13.7166 3.54905 13.7486C3.61299 13.7805 3.80483 13.8445 3.9647 13.6846L6.04297 11.6383H11.8941V12.5655H6.42665L4.60417 14.356C4.34838 14.5799 4.02865 14.7078 3.70891 14.7078Z"
                          fill="black"
                        ></path>
                      </svg>
                      Trung tâm hỗ trợ
                    </li>
                    <li className={cx("item")} onClick={handleNavigateProfile}>
                      <svg
                        width="29"
                        height="21"
                        viewBox="0 0 29 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M29 8.4062C29 3.78434 25.4769 0 21.1094 0C18.8966 0 16.8876 0.961594 15.4608 2.54357C15.0532 2.35746 14.5873 2.2644 14.1506 2.2644H3.40663C1.51406 2.2644 0 3.90842 0 5.89365V17.4018C0 19.387 1.51406 21 3.37751 21H14.1797C16.0432 21 17.5572 19.387 17.5572 17.4018V15.9129C18.6345 16.5022 19.8283 16.8124 21.1094 16.8124C22.4197 16.8124 23.6717 16.4712 24.749 15.8508L27.4859 20.7518L28.243 20.2866L25.506 15.3855C27.6315 13.8656 29 11.322 29 8.4062ZM10.8022 3.19498V9.52289C10.8022 9.89513 10.511 10.2053 10.1616 10.2053H7.39558C7.04619 10.2053 6.75502 9.89513 6.75502 9.52289V3.19498H10.8022ZM16.7129 17.4018C16.7129 18.8907 15.5773 20.0694 14.2088 20.0694H3.37751C1.97992 20.0694 0.873494 18.8597 0.873494 17.4018V5.89365C0.873494 4.40473 2.00904 3.226 3.37751 3.226H5.88153V9.55392C5.88153 10.4535 6.5512 11.1669 7.39558 11.1669H10.1616C11.006 11.1669 11.6757 10.4535 11.6757 9.55392V3.226H14.1797C14.4127 3.226 14.6456 3.25702 14.8785 3.35008C13.8594 4.77696 13.248 6.54505 13.248 8.43722C13.248 11.322 14.6165 13.8656 16.7129 15.3855V17.4018ZM14.1215 8.4062C14.1215 4.28065 17.2661 0.930576 21.1386 0.930576C25.011 0.930576 28.1556 4.28065 28.1556 8.4062C28.1556 12.5318 25.011 15.8818 21.1386 15.8818C17.2661 15.8818 14.1215 12.5318 14.1215 8.4062Z"
                          fill="black"
                        ></path>
                        <path
                          d="M24.6034 5.95569H17.6446V6.88626H24.6034V5.95569Z"
                          fill="black"
                        ></path>
                        <path
                          d="M24.6034 9.92615H17.6446V10.8567H24.6034V9.92615Z"
                          fill="black"
                        ></path>
                      </svg>
                      Tra cứu đơn hàng
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div
              className={cx("icon-section")}
              style={{ borderLeft: "groove" }}
            >
              <UserIcon
                fontSize="medium"
                style={{ color: "#4b4b4b", marginLeft: "16px" }}
              />
              {user ? (
                <p onClick={() => handleOpenModalLogin()}>{nameUser}</p>
              ) : (
                <p onClick={() => handleModalLoginUser()}>Đăng nhập</p>
              )}

              {isLogin && (
                <div className={cx("more")} style={{ right: "24px" }}>
                  <ul className={cx("list-more")}>
                    <li
                      className={cx("item")}
                      style={{
                        fontSize: "16px",
                        padding: "15px",
                        fontWeight: "700",
                      }}
                    >
                      Hi, Lê Huy!
                    </li>
                    <li className={cx("item")} onClick={() => handleProfile()}>
                      <svg
                        width="29"
                        height="19"
                        viewBox="0 0 29 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M25.7449 0H3.2551C1.45 0 0 1.48722 0 3.33866V15.6613C0 17.5128 1.45 19 3.2551 19H25.7449C27.55 19 29 17.5128 29 15.6613V3.33866C29 1.48722 27.55 0 25.7449 0ZM28.1122 15.631C28.1122 16.9665 27.0469 18.0591 25.7449 18.0591H3.2551C1.95306 18.0591 0.887755 16.9665 0.887755 15.631V3.33866C0.887755 2.0032 1.95306 0.910543 3.2551 0.910543H25.7449C27.0469 0.910543 28.1122 2.0032 28.1122 3.33866V15.631Z"
                          fill="black"
                        ></path>
                        <path
                          d="M10.4459 9.25719C11.1561 8.65016 11.5704 7.73962 11.6 6.79872C11.6296 5.00799 10.1796 3.42971 8.43367 3.39936C7.54592 3.36901 6.71735 3.70288 6.06633 4.34026C5.41531 4.97764 5.0898 5.82748 5.0898 6.73802C5.0898 7.70927 5.50408 8.65016 6.24388 9.28754C4.58673 10.1374 3.72857 11.8067 3.72857 14.2348H4.61633C4.61633 12.0192 5.35612 10.623 6.8949 9.98562C7.13163 9.89457 7.27959 9.65176 7.30918 9.40895C7.33878 9.16613 7.22041 8.92332 7.01327 8.77157C6.36225 8.31629 5.94796 7.55751 5.94796 6.76837C5.94796 6.10064 6.21429 5.49361 6.65816 5.03834C7.13163 4.58307 7.72347 4.34026 8.37449 4.34026C9.64694 4.37061 10.7122 5.52396 10.6827 6.82907C10.6531 7.61821 10.2684 8.34665 9.64694 8.80192C9.4398 8.95367 9.32143 9.19649 9.35102 9.4393C9.38061 9.68211 9.52857 9.92492 9.76531 10.016C11.3041 10.6534 12.0439 12.0495 12.0439 14.2652H12.9316C12.9316 11.7764 12.1031 10.1374 10.4459 9.25719Z"
                          fill="black"
                        ></path>
                        <path
                          d="M25.3306 4.58307H15.2102V5.49361H25.3306V4.58307Z"
                          fill="black"
                        ></path>
                        <path
                          d="M25.3306 9.04473H15.2102V9.95527H25.3306V9.04473Z"
                          fill="black"
                        ></path>
                        <path
                          d="M25.3306 13.476H15.2102V14.3866H25.3306V13.476Z"
                          fill="black"
                        ></path>
                      </svg>
                      <div className={cx("title-item")}>
                        <div className={cx("title-li")}>
                          Thông tin tài khoản
                        </div>
                        <div className={cx("titleLi-desc")}>
                          Tài khoản, Đơn hàng, Địa chỉ giao nhận, Đổi mật khẩu
                        </div>
                      </div>
                    </li>
                    <li className={cx("item")}>
                      <svg
                        width="29"
                        height="21"
                        viewBox="0 0 29 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M29 8.4062C29 3.78434 25.4769 0 21.1094 0C18.8966 0 16.8876 0.961594 15.4608 2.54357C15.0532 2.35746 14.5873 2.2644 14.1506 2.2644H3.40663C1.51406 2.2644 0 3.90842 0 5.89365V17.4018C0 19.387 1.51406 21 3.37751 21H14.1797C16.0432 21 17.5572 19.387 17.5572 17.4018V15.9129C18.6345 16.5022 19.8283 16.8124 21.1094 16.8124C22.4197 16.8124 23.6717 16.4712 24.749 15.8508L27.4859 20.7518L28.243 20.2866L25.506 15.3855C27.6315 13.8656 29 11.322 29 8.4062ZM10.8022 3.19498V9.52289C10.8022 9.89513 10.511 10.2053 10.1616 10.2053H7.39558C7.04619 10.2053 6.75502 9.89513 6.75502 9.52289V3.19498H10.8022ZM16.7129 17.4018C16.7129 18.8907 15.5773 20.0694 14.2088 20.0694H3.37751C1.97992 20.0694 0.873494 18.8597 0.873494 17.4018V5.89365C0.873494 4.40473 2.00904 3.226 3.37751 3.226H5.88153V9.55392C5.88153 10.4535 6.5512 11.1669 7.39558 11.1669H10.1616C11.006 11.1669 11.6757 10.4535 11.6757 9.55392V3.226H14.1797C14.4127 3.226 14.6456 3.25702 14.8785 3.35008C13.8594 4.77696 13.248 6.54505 13.248 8.43722C13.248 11.322 14.6165 13.8656 16.7129 15.3855V17.4018ZM14.1215 8.4062C14.1215 4.28065 17.2661 0.930576 21.1386 0.930576C25.011 0.930576 28.1556 4.28065 28.1556 8.4062C28.1556 12.5318 25.011 15.8818 21.1386 15.8818C17.2661 15.8818 14.1215 12.5318 14.1215 8.4062Z"
                          fill="black"
                        ></path>
                        <path
                          d="M24.6034 5.95569H17.6446V6.88626H24.6034V5.95569Z"
                          fill="black"
                        ></path>
                        <path
                          d="M24.6034 9.92615H17.6446V10.8567H24.6034V9.92615Z"
                          fill="black"
                        ></path>
                      </svg>
                      <div className={cx("title-item")}>
                        <div className={cx("title-li")}>Lịch sử đặt hàng</div>
                        <div className={cx("titleLi-desc")}>
                          Tra cứu đơn hàng đã đặt trước đó
                        </div>
                      </div>
                    </li>
                    <li
                      className={cx("item")}
                      style={{
                        fontSize: "16px",
                        padding: "15px",
                        fontWeight: "400",
                      }}
                      onClick={() => handleLogOut()}
                    >
                      Đăng xuất
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className={cx("icon-section")} onClick={handleOpenModalLike}>
              <FavoriteBorderIcon fontSize="medium" />
              {like && like.products && like.products.length > 0 && (
                <span className={cx("badge")}>{like.products.length}</span>
              )}
            </div>
            <div className={cx("icon-section")} onClick={handleOpenModalCart}>
              <ShoppingBagOutlinedIcon fontSize="medium" />
              {cart && cart.products && cart.products.length > 0 && (
                <span className={cx("badgeCart")}>{cart.products.length}</span>
              )}
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
          {menuHeaders.map((menu) => (
            <div
              key={menu.label}
              className={cx("menu-header")}
              onClick={() => handleNavigate(menu.label)}
              onMouseEnter={() => setHoveredMenu(menu.id)}
              onMouseLeave={() => {
                setHoveredMenu(null);
              }}
            >
              {menu.label}
              {menu.title !== "new" && hoveredMenu === menu.id && (
                <div
                  className={cx("menu-dropdown")}
                  onClick={(event) => {
                    event.stopPropagation(); // Ngăn sự kiện click truyền lên menu-header
                  }}
                >
                  <Collection props={menu.label} />
                </div>
              )}
            </div>
          ))}
          {listCategorys.map((menu) => (
            <div
              key={menu._id}
              className={cx("menu-header")}
              onClick={() => handleListProduct(menu.slug, menu.title)}
              onMouseEnter={() => setHoveredMenu(menu._id)}
              onMouseLeave={() => {
                setHoveredMenu(null);
              }}
            >
              {menu.title}
              {hoveredMenu === menu._id && (
                <div
                  className={cx("menu-dropdown")}
                  onClick={(event) => {
                    event.stopPropagation(); // Ngăn sự kiện click truyền lên menu-header
                  }}
                >
                  {menu.title === "collection" ? (
                    <Collection props="collection" />
                  ) : (
                    <CategoryHeader
                      props={hoveredMenu === menu._id ? menu._id : ""}
                    />
                  )}
                </div>
              )}
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
            marginTop: "-30px", // Dịch lên trên 30px
            borderRadius: "16px", // Bo góc 16px
          },
        }}
      >
        <Box>
          {/* Close Button */}
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalLogin}>
                <CloseOutlinedIcon />
              </button>
            </div>
          </DialogActions>

          {/* Content */}
          <div className={cx("content-login")}>
            {/* Header */}
            <div className={cx("search-image")}>
              <div className={cx("title")}>
                {isRegister && "Đăng ký"}
                {isLoginUser && "Đăng nhập "}
                {isForgotPass && "Quên mật khẩu"}
                {isModalOTP && "Nhập mã OTP"}
                {isResetPass && "Cập nhật mật khẩu"}
              </div>
            </div>

            {/* Authentication Form */}
            <div className={cx("auth")}>
              {isModalOTP && (
                <div
                  style={{
                    margin: "0px 20px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    Mã xác thực (OTP) sẽ được gửi qua tin nhắn Zalo hoặc Gmail
                    để cập nhật lại mật khẩu
                  </span>
                </div>
              )}

              {/* Đăng ký: Họ và Tên */}
              {isRegister && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>Họ Tên</div>
                  <input type="text" name="fullName" onChange={handleChange} />
                </div>
              )}

              {isLoginUser && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>Email</div>
                  <input type="text" name="email" onChange={handleChange} />
                </div>
              )}

              {isLoginUser && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>Mật khẩu</div>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                  />
                  {isEmailPassword === true && (
                    <div className={cx("alert-login")}>
                      * Vui lòng nhập email
                    </div>
                  )}

                  {isEmailPassword === false && (
                    <div className={cx("alert-login")}>
                      * Vui lòng nhập password
                    </div>
                  )}

                  {isHaveAcc && (
                    <div className={cx("alert-login")}>
                      * Email, Mật khẩu không đúng
                    </div>
                  )}
                </div>
              )}
              {/* Đăng kí */}
              {isRegister && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>SĐT</div>
                  <input type="text" name="phone" onChange={handleChange} />
                </div>
              )}
              {isRegister && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>Email</div>
                  <input type="text" name="email" onChange={handleChange} />
                </div>
              )}
              {/* Đăng kí */}
              {isRegister && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>Mật khẩu</div>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Xác nhận mật khẩu (chỉ khi đăng ký) */}
              {isRegister && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>Xác nhận lại mật khẩu</div>
                  <input
                    type="password"
                    name="confirmPass"
                    onChange={handleChange}
                  />
                </div>
              )}

              {isForgotPass && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>Email</div>
                  <input type="email" name="email" onChange={handleChange} />
                </div>
              )}

              {isModalOTP && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "30px",
                    marginTop: "30px",
                  }}
                >
                  <MuiOtpInput
                    value={otp}
                    onChange={(newValue) => {
                      setOtp(newValue);
                    }}
                    length={6}
                    type="number"
                    TextFieldsProps={{
                      sx: {
                        width: "40px", // chiều rộng mỗi ô
                        height: "40px", // chiều cao mỗi ô
                        fontSize: "16px", // cỡ chữ
                        mx: 0.5, // margin trái/phải giữa các ô
                      },
                    }}
                  />
                </div>
              )}

              {isResetPass && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>Mật khẩu mới</div>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChangePass}
                  />
                </div>
              )}
              {isResetPass && (
                <div className={cx("input-login")}>
                  <div className={cx("label-login")}>Xác nhận lại mật khẩu</div>
                  <input
                    type="password"
                    name="confirmPass"
                    onChange={handleChangePass}
                  />
                </div>
              )}

              {isDataRegister && (
                <div className={cx("alert-login")}>
                  * Vui lòng nhập đầy đủ thông tin
                </div>
              )}

              {isModalOTP && (
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    color: countdown === 0 ? "#007bff" : "gray",
                    cursor: countdown === 0 ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (countdown === 0) {
                      handleForgot(); // hàm bạn viết để gọi lại API gửi OTP
                      setCountdown(180); // reset lại timer
                    }
                  }}
                >
                  {countdown > 0 ? (
                    <>
                      <span
                        style={{
                          color: "#c73130",
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        {Math.floor(countdown / 60)}:
                        {(countdown % 60).toString().padStart(2, "0")}
                      </span>
                      Gửi lại mã OTP
                    </>
                  ) : (
                    "Gửi lại mã OTP"
                  )}
                </span>
              )}

              {alertData && (
                <div className={cx("alert-login")}>* {alertData}</div>
              )}

              {/* Submit Button */}
              {isRegister && (
                <button type="submit" onClick={() => handleLogin(isRegister)}>
                  Đăng ký
                </button>
              )}
              {isLoginUser && (
                <button type="submit" onClick={() => handleLogin(isRegister)}>
                  Đăng nhập
                </button>
              )}
              {isForgotPass && (
                <button type="submit" onClick={() => handleForgot()}>
                  Tiếp tục
                </button>
              )}

              {isModalOTP && (
                <div>
                  <button type="submit" onClick={() => handleOTP()}>
                    Tiếp tục
                  </button>
                </div>
              )}

              {isResetPass && (
                <button type="submit" onClick={() => handleResetPass()}>
                  Cập nhật
                </button>
              )}
            </div>

            {/* Chuyển đổi giữa Đăng nhập & Đăng ký */}
            <div className={cx("text-register")}>
              {isRegister && (
                <>
                  Bạn đã có tài khoản?{" "}
                  <span onClick={handleLoginUser}>Đăng nhập</span>
                </>
              )}
              {isLoginUser && (
                <>
                  Bạn chưa có tài khoản?{" "}
                  <span onClick={handleModalRegister}>Đăng ký</span>{" "}
                  <span onClick={handleModalForgot}>Quên mật khẩu</span>
                </>
              )}

              {isForgotPass && (
                <>
                  Tôi đã nhớ mật khẩu!{" "}
                  <span
                    onClick={handleLoginUser}
                    style={{ marginTop: " 20xp" }}
                  >
                    Đăng nhập
                  </span>
                </>
              )}
            </div>

            {/* Ghi chú khi đăng nhập */}
            {isLoginUser && (
              <div>
                <div className={cx("text-login")}>
                  *Vui lòng không hủy đơn hàng khi đã thanh toán*
                </div>
                <div className={cx("note-login")}>
                  Đăng nhập ngay để mua sắm dễ dàng hơn, sử dụng những tiện ích
                  mới nhất và tận hưởng thêm nhiều ưu đãi độc quyền dành riêng
                  cho thành viên Beauty Box.
                </div>
              </div>
            )}
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
                <Cart
                  cart={cart}
                  setCart={setCart}
                  selectCart={selectCart}
                  setSelectCart={setSelectCart}
                />
              )}

              {selectedCart === "delivery" && (
                <div className={cx("checkout")}>
                  <div className={cx("shipment")}>
                    <div className={cx("title-checkout")}>Giao hàng</div>
                    <div className={cx("price")}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalPrice)}
                    </div>
                  </div>

                  <div
                    className={cx("shipment")}
                    style={{ marginBottom: "16px", color: "rgb(182 182 182)" }}
                  >
                    <div className={cx("title-checkout")}>Click & Collect</div>
                    <div className={cx("price")}>0đ</div>
                  </div>

                  <div className={cx("btn-checkout")}>
                    <button type="submit" onClick={handleNavigateCheckout}>
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
                    <div className={cx("price")}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalPrice)}
                    </div>
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

            <button
              style={{ fontSize: "14px", fontWeight: "700" }}
              onClick={() => handleDeleteAllLike()}
            >
              Xóa hết
            </button>
          </div>

          <div className={cx("body-fav")}>
            <CartFav like={like} setLike={setLike} />
          </div>
        </Box>
      </Dialog>
    </header>
  );
};

export default Header;
