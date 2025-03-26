import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Box, Dialog, DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  editUser,
  getUser,
  refreshTokenUser,
} from "../../../services/user.service";
import { jwtDecode } from "jwt-decode";
import { AxiosInstance } from "../../../configs/axios";
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAllAddress,
  updateAddress,
} from "../../../services/address.service";

const cx = classNames.bind(styles);

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Tài khoản");
  const listTab = ["Tài khoản", "Đơn hàng", "Địa chỉ giao nhận"];
  const [isModalAddress, setIsModalAddress] = useState(false);
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [user, setUser] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [nameUser, setNameUser] = useState("");
  const [address, setAddress] = useState([]);
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

  const handleFoward = (tab) => {
    setActiveTab(tab);
  };

  const handleModal = () => {
    setIsModalAddress((prev) => !prev);
  };

  const handleModalAdd = () => {
    setIsModalAdd((prev) => !prev);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await refreshTokenUser(); // Thử lấy access token mới

      if (token) {
        try {
          const decodedUser = jwtDecode(token);

          const user = await getUser(decodedUser.userId);

          setUser({
            id: user.user._id || "",
            fullName: user.user.fullName || "",
            email: user.user.email || "",
            phone: user.user.phone || "",
          });
          setNameUser(user.user.fullName);
          fetchAddress(user.user._id);

          AxiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
        } catch (error) {
          console.error("❌ Lỗi giải mã token:", error);
          setUser(null);
        }
      } else {
        console.warn("🚪 Người dùng chưa đăng nhập hoặc token hết hạn");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log("Thông tin đã lưu:", user);
    try {
      const response = await editUser(user.id, {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAddress = async (userId) => {
    try {
      const response = await getAllAddress(userId);
      if (response) {
        setAddress(response);
        handleModal();
      }
    } catch (error) {
      console.error(error);
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
    try {
      const response = await createAddress(user.id, addAddress);
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

  return (
    <div className={cx("profile-container")}>
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
                value={user.fullName}
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
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className={cx("form-group")}>
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={user.phone}
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
            {address.map((data) => (
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
                placeholder="Tìm kiếm"
              />
            </div>

            <div className={cx("content-oder")}>
              <div className={cx("noData")}>
                <InventoryIcon fontSize="large" />
                <div className={cx("title-noData")}>No Data</div>
              </div>
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
    </div>
  );
};

export default Profile;
