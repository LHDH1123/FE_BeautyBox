import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Snackbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { changePassWord, editUser } from "../../../services/user.service";

import {
  createAddress,
  deleteAddress,
  getAddressById,
  updateAddress,
} from "../../../services/address.service";
import { useAuth } from "../../Context/AuthContext";
import { getOrderUser } from "../../../services/order.service";
import { OrderSuccess } from "../../../services/checkout.service";
import { useLocation } from "react-router-dom";

const cx = classNames.bind(styles);

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Tài khoản");
  const listTab = ["Tài khoản", "Đơn hàng", "Địa chỉ giao nhận", "Mật khẩu"];
  const [isModalAddress, setIsModalAddress] = useState(false);
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalDetail, setIsModalDetail] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [resetPass, setResetPass] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAccess, setIsAccess] = useState(false);
  // const [nameUser, setNameUser] = useState("");
  // const [address, setAddress] = useState([]);
  const [editAddress, setEditAddress] = useState({
    titleAddress: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    districts: "",
    ward: "",
    address: "",
    status: true,
  });
  const [addAddress, setAddAddress] = useState({
    titleAddress: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    districts: "",
    ward: "",
    address: "",
    status: false,
  });

  const {
    user,
    updateUser,
    setUpdateUser,
    setUser,
    nameUser,
    setNameUser,
    address,
    setAddress,
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const location = useLocation();
  const message = location.state?.message;

  const handleFoward = (tab) => {
    setActiveTab(tab);
  };

  const handleModal = () => {
    setIsModalAddress((prev) => !prev);
  };

  const handleModalAdd = () => {
    setIsModalAdd((prev) => !prev);
  };

  const handleModalDetail = () => {
    setIsModalDetail((prev) => !prev);
  };

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleChangePass = (e) => {
    setResetPass({ ...resetPass, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { fullName, email, phone } = updateUser;

      // ✅ Validate fullName (chỉ chữ cái và khoảng trắng)
      const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/u;
      if (!nameRegex.test(fullName)) {
        console.error("Họ và tên không hợp lệ");
        setErrorMessage("Họ và tên không được chứa ký tự đặc biệt hoặc số");
        setOpenSnackbar(true);
        return;
      }

      // ✅ Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error("Email không hợp lệ");
        setErrorMessage("Email không hợp lệ");
        setOpenSnackbar(true);
        return;
      }

      // ✅ Validate phone
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(phone)) {
        console.error("Số điện thoại không hợp lệ");
        setErrorMessage("Số điện thoại không hợp lệ");
        setOpenSnackbar(true);
        return;
      }

      // ✅ Gửi request nếu tất cả hợp lệ
      const response = await editUser(updateUser.id, {
        fullName,
        email,
        phone,
      });

      if (response) {
        console.log("Lưu thông tin thành công", response);
        setUser((prevUser) => ({
          ...prevUser,
          fullName: response.fullName,
          email: response.email,
          phone: response.phone,
        }));

        setNameUser(response.user.fullName);
        setErrorMessage("Cập nhật thông tin thành công");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Đã xảy ra lỗi khi cập nhật thông tin");
      setOpenSnackbar(true);
    }
  };

  const handleEdit = async (id) => {
    handleModal();
    try {
      const response = await getAddressById(id);
      if (response) {
        setEditAddress(response);
      } else {
        console.warn("No address found for the given ID");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleChangeEdit = (e) => {
    const { name, value, type, checked } = e.target;

    setEditAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChangeAdd = (e) => {
    const { name, value, type, checked } = e.target;

    setAddAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateAddress = async () => {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/u;
    if (
      !nameRegex.test(editAddress.name) ||
      !nameRegex.test(editAddress.last_name)
    ) {
      setErrorMessage("Họ và tên không được chứa ký tự đặc biệt hoặc số");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    // ✅ Validate phone
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(editAddress.phone)) {
      setErrorMessage("Số điện thoại không hợp lệ");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    // ✅ Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editAddress.email)) {
      setErrorMessage("Email không hợp lệ");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }

    try {
      const response = await updateAddress(editAddress._id, editAddress);
      if (response) {
        setAddress((prevAddresses) =>
          prevAddresses.map(
            (addr) =>
              addr._id === editAddress._id
                ? { ...response, status: editAddress.status }
                : { ...addr, status: editAddress.status ? false : addr.status } // Set false nếu addr không phải là editAddress
          )
        );
        handleModal();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const response = await deleteAddress(id);
      if (response) {
        setAddress(
          (prevAddresses) => prevAddresses.filter((addr) => addr._id !== id) // Loại bỏ địa chỉ bị xóa
        );
      }
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
    }
  };

  const handleAdd = async () => {
    console.log(addAddress);
    if (
      !addAddress.name &&
      !addAddress.last_name &&
      !addAddress.email &&
      !addAddress.phone &&
      !addAddress.city &&
      !addAddress.districts &&
      !addAddress.ward
    ) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    // ✅ Validate name & lastName - không có ký tự đặc biệt
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/u;
    if (
      !nameRegex.test(addAddress.name) ||
      !nameRegex.test(addAddress.last_name)
    ) {
      setErrorMessage("Họ và tên không được chứa ký tự đặc biệt hoặc số");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    // ✅ Validate phone (10 chữ số bắt đầu bằng 0)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(addAddress.phone)) {
      setErrorMessage("Số điện thoại không hợp lệ");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }

    // ✅ Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addAddress.email)) {
      setErrorMessage("Email không hợp lệ");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }

    try {
      const response = await createAddress(updateUser.id, addAddress);
      if (response) {
        setAddress((prevAddresses) =>
          addAddress.status
            ? prevAddresses
                .map((addr) => ({ ...addr, status: false }))
                .concat(response.data)
            : [...prevAddresses, response.data]
        );

        handleModalAdd();
        setAddAddress({
          titleAddress: "",
          name: "",
          lastName: "",
          email: "",
          phone: "",
          city: "",
          districts: "",
          ward: "",
          address: "",
          status: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrderUser(user._id);
      if (response) {
        const sortedOrders = response.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (message === "Đơn hàng") {
      setActiveTab("Đơn hàng");
    }
    if (user?._id) {
      fetchOrders();
    }
  }, [user?._id]); // Chỉ phụ thuộc vào user._id thay vì toàn bộ user object

  const handleDetail = async (orderDetail) => {
    setIsModalDetail(true);
    try {
      const respone = await OrderSuccess(orderDetail);
      if (respone) {
        setOrderDetail(respone.order);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSavePass = async () => {
    // Kiểm tra xem các trường mật khẩu có được nhập đầy đủ không
    if (!resetPass.oldPass || !resetPass.newPass || !resetPass.confirmPass) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }

    // Kiểm tra xem mật khẩu mới có khớp với mật khẩu xác nhận không
    if (resetPass.newPass !== resetPass.confirmPass) {
      setErrorMessage("Xác nhận mật khẩu không khớp.");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }

    try {
      // Gửi yêu cầu đổi mật khẩu
      const response = await changePassWord(user._id, {
        oldPassword: resetPass.oldPass,
        newPassword: resetPass.newPass,
      });

      // Kiểm tra và thông báo kết quả trả về
      if (response) {
        setErrorMessage("Đổi mật khẩu thành công"); // Lấy thông báo từ API
        setOpenSnackbar(true);
        setIsAccess(true);
        setResetPass({
          oldPass: "",
          newPass: "",
          confirmPass: "",
        });
      }
    } catch (error) {
      console.error("Lỗi:", error);

      // Kiểm tra lỗi và hiển thị thông báo hợp lý
      if (error.response && error.response.data) {
        // Trường hợp lỗi từ server (response trả về)
        setErrorMessage(error.response.data.message || "Có lỗi xảy ra.");
      } else {
        // Trường hợp lỗi không xác định (lỗi mạng, timeout...)
        setErrorMessage("Có lỗi không xác định.");
      }

      setOpenSnackbar(true);
      setIsAccess(false);
    }
  };

  return (
    <div className={cx("profile-container")}>
      {errorMessage && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000} // Ẩn sau 3 giây
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Hiển thị trên cùng
        >
          {isAccess ? (
            <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
              {errorMessage}
            </Alert>
          ) : (
            <Alert severity="warning" onClose={() => setOpenSnackbar(false)}>
              {errorMessage}
            </Alert>
          )}
        </Snackbar>
      )}
      <div className={cx("sidebar")}>
        <div className={cx("card")}>
          <div className={cx("avatar")}>
            <svg
              width="50"
              height="50"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5 0C6.50896 0 0 6.50896 0 14.5C0 22.491 6.50896 29 14.5 29C22.491 29 29 22.491 29 14.5C29 6.50896 22.5063 0 14.5 0ZM14.5 1.06955C21.9104 1.06955 27.9305 7.08957 27.9305 14.5C27.9305 17.7392 26.7845 20.7034 24.8746 23.0258C24.3093 21.1006 23.148 19.3588 21.4979 18.0448C20.2908 17.0669 18.8699 16.3641 17.3419 15.9821C19.2366 14.9737 20.52 12.9721 20.52 10.6802C20.52 7.36459 17.8156 4.66017 14.5 4.66017C11.1844 4.66017 8.47998 7.33404 8.47998 10.6649C8.47998 12.9568 9.76344 14.9584 11.6581 15.9668C10.1301 16.3488 8.70917 17.0516 7.50211 18.0295C5.86723 19.3435 4.69073 21.0854 4.12539 23.0105C2.21549 20.6881 1.06955 17.7239 1.06955 14.4847C1.08483 7.08957 7.10485 1.06955 14.5 1.06955ZM14.5 15.6154C11.765 15.6154 9.54952 13.3999 9.54952 10.6649C9.54952 7.92993 11.765 5.71444 14.5 5.71444C17.235 5.71444 19.4505 7.92993 19.4505 10.6649C19.4505 13.3999 17.235 15.6154 14.5 15.6154ZM14.5 27.9152C10.7871 27.9152 7.42571 26.4025 4.99631 23.9578C5.40885 21.9868 6.52423 20.1839 8.17439 18.8546C9.9315 17.4489 12.1776 16.6697 14.5 16.6697C16.8224 16.6697 19.0685 17.4489 20.8256 18.8546C22.4758 20.1839 23.5911 21.9868 24.0037 23.9578C21.5743 26.4025 18.2129 27.9152 14.5 27.9152Z"
                fill="black"
              ></path>
            </svg>
          </div>
          <div className={cx("name")}>{nameUser}</div>

          {/* <div className={cx("points-section")}>
            <div className={cx("tier")}>BRONZE | 0 HSVPoint</div>
            <p>
              Nhận thêm <strong>100 điểm</strong> nữa để nâng hạng lên SILVER
            </p>
            <a href="#">Xem tất cả quyền lợi</a>
          </div> */}
        </div>
        <div className={cx("nav-links")}>
          {listTab.map((tab) => (
            <div
              key={tab}
              className={cx("tab", { active: activeTab === tab })}
              onClick={() => handleFoward(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={cx("content")}>
        {activeTab === "Địa chỉ giao nhận" ? (
          <div className={cx("header")}>
            <h2 className={cx("title")}>{activeTab}</h2>
            <button
              className={cx("add")}
              onClick={() => {
                handleModalAdd();
              }}
            >
              + Thêm địa chỉ
            </button>
          </div>
        ) : (
          <h2 className={cx("title")}>{activeTab}</h2>
        )}

        {activeTab === "Tài khoản" && (
          <div className={cx("form-account")}>
            <div className={cx("form-group")}>
              <label>Họ Tên *</label>
              <input
                type="text"
                name="fullName"
                value={updateUser.fullName}
                onChange={handleChange}
              />
            </div>
            {/* <div className={cx("form-group")}>
              <label>Họ *</label>
              <input type="text" value="Lê" />
            </div> */}

            <div className={cx("form-group")}>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={updateUser.email}
                onChange={handleChange}
              />
            </div>
            <div className={cx("form-group")}>
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={updateUser.phone}
                onChange={handleChange}
              />
            </div>
            <button className={cx("save-button")} onClick={() => handleSave()}>
              Lưu
            </button>
          </div>
        )}
        {activeTab === "Địa chỉ giao nhận" && (
          <div className={cx("form-address")}>
            {address?.map((data) => (
              <div className={cx("info-form")} key={data._id}>
                <div className={cx("addressShip")}>
                  <div className={cx("address")}>{data.titleAddress}</div>
                  {data.status && (
                    <span className={cx("default")}>Mặc định</span>
                  )}
                  <div className={cx("icon")}>
                    <EditOutlinedIcon
                      className={cx("icon-address")}
                      fontSize="small"
                      onClick={() => handleEdit(data._id)}
                    />
                    <DeleteOutlineOutlinedIcon
                      className={cx("icon-address")}
                      fontSize="small"
                      onClick={() => handleDeleteAddress(data._id)}
                    />
                  </div>
                </div>
                <div className={cx("info-address")}>
                  <div className={cx("name-user")}>
                    {data.last_name} {data.name}
                  </div>
                  <div className={cx("phone")}>{data.phone}</div>
                  <div className={cx("email")}>{data.email}</div>
                  <div className={cx("details")}>
                    {data.address}, {data.ward}, {data.districts}, {data.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "Đơn hàng" && (
          <div className={cx("form-oder")}>
            <div className={cx("search-bar")}>
              <div className={cx("search-icon")}>
                <SearchIcon />
              </div>
              <input
                type="text"
                className={cx("search-input")}
                placeholder="Tìm kiếm theo ID đơn hàng"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset về trang đầu khi tìm
                }}
              />
            </div>

            <div className={cx("content-order")}>
              <table>
                <thead>
                  <tr>
                    <th>ID đơn hàng</th>
                    <th>Ngày đặt</th>
                    <th>Tổng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <strong>#{order._id.slice(-8)}</strong>
                        </td>
                        <td style={{ color: "#000" }}>
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td style={{ color: "#000" }}>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.total)}
                        </td>
                        <td>
                          <button
                            className={cx("action-button")}
                            onClick={() => handleDetail(order._id)}
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <div className={cx("noData")}>
                        <InventoryIcon fontSize="large" />
                        <div className={cx("title-noData")}>No Data</div>
                      </div>
                    </tr>
                  )}
                </tbody>
              </table>
              {!searchTerm && (
                <Pagination
                  className={cx("pagnigation")}
                  count={Math.ceil(filteredOrders.length / ordersPerPage)}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="secondary"
                />
              )}
            </div>
          </div>
        )}
        {activeTab === "Mật khẩu" && (
          <div className={cx("form-pass")}>
            <div className={cx("form-group")} style={{ alignItems: "center" }}>
              <label>Mật khẩu cũ</label>
              <input
                type="password"
                name="oldPass"
                style={{ width: "50%", marginBottom: "10px" }}
                value={resetPass.oldPass}
                onChange={handleChangePass}
              />
            </div>

            <div className={cx("form-group")} style={{ alignItems: "center" }}>
              <label>Mật khẩu mới</label>
              <input
                type="password"
                name="newPass"
                style={{ width: "50%", marginBottom: "10px" }}
                value={resetPass.newPass}
                onChange={handleChangePass}
              />
            </div>

            <div className={cx("form-group")} style={{ alignItems: "center" }}>
              <label>Xác lại mật khẩu</label>
              <input
                type="password"
                name="confirmPass"
                style={{ width: "50%", marginBottom: "10px" }}
                value={resetPass.confirmPass}
                onChange={handleChangePass}
              />
            </div>

            <div style={{ display: " flex" }}>
              <button
                className={cx("save-button")}
                style={{ alignItems: "center" }}
                onClick={() => handleSavePass()}
              >
                Lưu
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={isModalAddress}
        onClose={handleModal}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "600px",
            width: "500px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button
                onClick={() => {
                  handleModal();
                }}
              >
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>

          <div className={cx("modalContent")}>
            <div className={cx("title")}>Chỉnh sửa địa chỉ</div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="titleAddress"
                value={editAddress.titleAddress}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="Tên địa chỉ (vd: Văn phòng, Nhà, ...)"
              />
            </div>

            <div className={cx("formGroup")}>
              <div className={cx("fullname")}>
                <input
                  type="text"
                  name="name"
                  value={editAddress.name}
                  className={cx("input")}
                  onChange={handleChangeEdit}
                  placeholder="Tên"
                />
                <input
                  type="text"
                  name="last_name"
                  value={editAddress.last_name}
                  className={cx("input")}
                  onChange={handleChangeEdit}
                  placeholder="Họ"
                />
              </div>
            </div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="phone"
                value={editAddress.phone}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="SĐT"
              />
            </div>
            <div className={cx("formGroup")}>
              <input
                type="text"
                name="email"
                value={editAddress.email}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="Email"
              />
            </div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="city"
                value={editAddress.city}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="Tỉnh/ Thành phố"
              />
            </div>

            <div className={cx("formGroup")}>
              <div className={cx("districts")}>
                <input
                  type="text"
                  name="districts"
                  value={editAddress.districts}
                  className={cx("input")}
                  onChange={handleChangeEdit}
                  placeholder="Quận/ Huyện"
                />
                <input
                  type="text"
                  name="ward"
                  value={editAddress.ward}
                  className={cx("input")}
                  onChange={handleChangeEdit}
                  placeholder="Phường/ Xã"
                />
              </div>
            </div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="address"
                value={editAddress.address}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="Tòa nhà, số nhà, tên đường"
              />
            </div>

            <div className={cx("formGroup")}>
              <div className={cx("default")}>
                <div>
                  <input
                    type="checkbox"
                    name="status"
                    checked={editAddress.status}
                    onChange={(e) =>
                      setEditAddress({
                        ...editAddress,
                        status: e.target.checked,
                      })
                    }
                    className={cx("input")}
                  />
                </div>
                <div className={cx("addressDefault")}>
                  Đặt làm dịa chỉ mặc định
                </div>
              </div>
            </div>

            <div className={cx("buttons")}>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleUpdateAddress}
              >
                Lưu
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      <Dialog
        open={isModalAdd}
        onClose={handleModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "600px",
            width: "500px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button
                onClick={() => {
                  handleModalAdd();
                }}
              >
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>

          <div className={cx("modalContent")}>
            <div className={cx("title")}>Thêm địa chỉ</div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="titleAddress"
                value={addAddress.titleAddress}
                className={cx("input")}
                onChange={handleChangeAdd}
                placeholder="Tên địa chỉ (vd: Văn phòng, Nhà, ...)"
              />
            </div>

            <div className={cx("formGroup")}>
              <div className={cx("fullname")}>
                <input
                  type="text"
                  name="name"
                  value={addAddress.name}
                  className={cx("input")}
                  onChange={handleChangeAdd}
                  placeholder="Tên"
                />
                <input
                  type="text"
                  name="last_name"
                  value={addAddress.last_name}
                  className={cx("input")}
                  onChange={handleChangeAdd}
                  placeholder="Họ"
                />
              </div>
            </div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="phone"
                value={addAddress.phone}
                className={cx("input")}
                onChange={handleChangeAdd}
                placeholder="SĐT"
              />
            </div>
            <div className={cx("formGroup")}>
              <input
                type="text"
                name="email"
                value={addAddress.email}
                className={cx("input")}
                onChange={handleChangeAdd}
                placeholder="Email"
              />
            </div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="city"
                value={addAddress.city}
                className={cx("input")}
                onChange={handleChangeAdd}
                placeholder="Tỉnh/ Thành phố"
              />
            </div>

            <div className={cx("formGroup")}>
              <div className={cx("districts")}>
                <input
                  type="text"
                  name="districts"
                  value={addAddress.districts}
                  className={cx("input")}
                  onChange={handleChangeAdd}
                  placeholder="Quận/ Huyện"
                />
                <input
                  type="text"
                  name="ward"
                  value={addAddress.ward}
                  className={cx("input")}
                  onChange={handleChangeAdd}
                  placeholder="Phường/ Xã"
                />
              </div>
            </div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="address"
                value={addAddress.address}
                className={cx("input")}
                onChange={handleChangeAdd}
                placeholder="Tòa nhà, số nhà, tên đường"
              />
            </div>

            <div className={cx("formGroup")}>
              <div className={cx("default")}>
                <div>
                  <input
                    type="checkbox"
                    name="status"
                    checked={addAddress.status}
                    onChange={(e) =>
                      setAddAddress({
                        ...addAddress,
                        status: e.target.checked,
                      })
                    }
                    className={cx("input")}
                  />
                </div>
                <div className={cx("addressDefault")}>
                  Đặt làm dịa chỉ mặc định
                </div>
              </div>
            </div>

            <div className={cx("buttons")}>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={() => handleAdd()}
              >
                Lưu
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      <Dialog
        open={isModalDetail}
        onClose={handleModalDetail}
        maxWidth={false}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            // height: "800px",
            width: "1000px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button
                onClick={() => {
                  handleModalDetail();
                }}
              >
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>

          <div className={cx("modalContent")}>
            <div className={cx("title")}>Chi tiết đơn hàng</div>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    height: "100%", // đảm bảo full height trong grid
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Thông tin nhận hàng
                    </Typography>
                    {orderDetail.userInfo && (
                      <>
                        <Typography>{orderDetail.userInfo.fullName}</Typography>
                        <Typography>{orderDetail.userInfo.phone}</Typography>
                        <Typography>{orderDetail.userInfo.address}</Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Phương thức thanh toán
                    </Typography>
                    <Typography>
                      {orderDetail.isCheckout
                        ? "PayPal & Chuyển khoản Ngân Hàng"
                        : "Trả tiền mặt khi nhận hàng (COD)"}
                    </Typography>
                    {orderDetail.isCheckout ? (
                      <Typography>Đã thanh toán</Typography>
                    ) : (
                      <Typography>
                        Quý khách vui lòng thanh toán{" "}
                        {parseInt(orderDetail.totalVoucher).toLocaleString()}đ
                        khi nhận hàng
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card
              sx={{
                maxWidth: 1050,
                margin: "auto",
                mt: 0,
                p: 0,
                border: "1px solid rgb(217, 217, 217)",
                marginTop: "20px",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Đơn hàng
                </Typography>
                <List>
                  {orderDetail?.products?.map((item, index) => (
                    <div key={index}>
                      <ListItem sx={{ px: 3 }} style={{ padding: "10px 0px" }}>
                        <Avatar
                          src={item.productInfo.thumbnail[0]}
                          alt={item.productInfo.title}
                          sx={{ width: 50, height: 50, marginRight: 2 }}
                        />
                        <ListItemText
                          primary={
                            <span
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              {item.productInfo.title}
                            </span>
                          }
                          secondary={
                            <span style={{ color: "black" }}>
                              x{item.quantity}
                            </span>
                          }
                        />
                        <Typography variant="body1" fontWeight="bold">
                          {parseInt(item.priceNew).toLocaleString()}đ
                        </Typography>
                      </ListItem>
                      {index < orderDetail.products.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  my={1}
                  px={0}
                >
                  <Typography>Tạm tính</Typography>
                  <Typography>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(orderDetail.total)}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  my={1}
                  px={0}
                >
                  <Typography>Giảm giá</Typography>
                  <Typography color="#0992d0">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      -(orderDetail.total * orderDetail.discount) / 100
                    )}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  my={1}
                  px={0}
                >
                  <Typography>Shipping</Typography>
                  <Typography>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(12000)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  my={1}
                  fontWeight="bold"
                  px={0}
                >
                  <Typography>Tổng</Typography>
                  <Typography>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      fontWeight: "bold",
                      currency: "VND",
                    }).format(orderDetail.totalVoucher)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default Profile;
