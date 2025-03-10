import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Account.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";
import TableHeader from "../../components/TableHeader";
import {
  changeStatusAccount,
  deleteAccounts,
  getAllAccounts,
  updateAccount,
} from "../../../services/account.service";
import { getAllRoles, getNameRole } from "../../../services/role.service";
import { Box, Dialog, DialogActions, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const cx = classNames.bind(styles);

const User = () => {
  const [allAccount, setAllAccount] = useState([]);
  const [allRole, setAllRole] = useState([]);

  const [editAccount, setEditAccount] = useState({
    avatar: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role_id: "",
    status: false,
  });
  const [isModalAddUser, setIsModalAddUser] = useState(false);
  const fileInputRef = useRef(null);
  const [getAccount, setGetAccount] = useState([]);

  const fetchAccount = async () => {
    try {
      const response = await getAllAccounts();

      const accountWithRole = await Promise.all(
        response.map(async (account) => {
          const roleName = await getNameRole(account.role_id);
          return { ...account, nameRole: roleName };
        })
      );

      setAllAccount(accountWithRole);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
    }
  };

  const fetchAllRoles = async () => {
    const response = await getAllRoles();
    if (response) {
      setAllRole(response);
    }
  };

  useEffect(() => {
    fetchAccount();
    fetchAllRoles();
  }, []);

  const handleChangeStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await changeStatusAccount(id, newStatus);

      setAllAccount((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, status: newStatus } : product
        )
      );

      // Gọi API để cập nhật trạng thái trên server
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) return;

    try {
      await deleteAccounts(id);
      const updatedAccounts = allAccount.filter(
        (account) => account._id !== id
      );
      setAllAccount(updatedAccounts);
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEditAccount((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      return newState;
    });
  };

  const handleCloseModalAdd = () => {
    setIsModalAddUser(!isModalAddUser);
  };

  const handlEdit = (account) => {
    setEditAccount({
      id: account._id || "",
      thumbnail: account.thumbnail || "",
      fullName: account.fullName || "",
      email: account.email || "",
      phone: account.phone || "",
      role_id: account.role_id || "",
      status: account.status ?? false,
    });
    setGetAccount({ ...getAccount, thumbnail: account.thumbnail });
    setIsModalAddUser(true);
  };

  const handleClickChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file picker for image
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGetAccount({ ...getAccount, thumbnail: reader.result }); // Lưu URL của ảnh vào state
      };
      reader.readAsDataURL(file); // Lưu file thật vào state để gửi lên server
      setEditAccount((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleUpdate = async () => {
    if (!editAccount.fullName || !editAccount.email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (editAccount.password !== editAccount.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!editAccount.role_id) {
      alert("Vui lòng chọn vai trò!");
    }
    console.log(editAccount);
    try {
      const formData = new FormData();
      formData.append("fullName", editAccount.fullName);
      formData.append("phone", editAccount.phone);
      formData.append("email", editAccount.email);
      formData.append("role_id", editAccount.role_id);
      formData.append("status", editAccount.status);

      if (editAccount.thumbnail) {
        formData.append("thumnail", editAccount.thumbnail);
      }

      const response = await updateAccount(editAccount.id, formData);

      if (response) {
        console.log(response);
        setIsModalAddUser(false);
        fetchAccount();
      } else {
        alert("Lỗi khi sửa tài khoản!");
      }
    } catch (error) {
      console.error("Lỗi khi sửa tài khoản:", error);
    }
  };

  return (
    <div className={cx("table")}>
      <Header title="Người Dùng" fetchAccount={fetchAccount} />

      <div className={cx("table-list")}>
        <TableHeader />

        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th className={cx("no-sort")}>
                  <input type="checkbox" name="" id="" />
                </th>
                <th>Người dùng</th>
                <th>SĐT</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th className={cx("no-sort")}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {allAccount.map((account) => (
                <tr key={account._id}>
                  <td>
                    <label className={cx("checkboxs")}>
                      <input type="checkbox" />
                      <span className={cx("checkmarks")}></span>
                    </label>
                  </td>
                  <td>{account.fullName}</td>
                  <td>{account.phone}</td>
                  <td>{account.email}</td>
                  <td>{account.nameRole}</td>
                  <td>
                    {new Date(account.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <span
                      className={cx(
                        "badge",
                        account.status ? "badge-linesuccess" : "badge-linered"
                      )}
                      onClick={() =>
                        handleChangeStatus(account._id, account.status)
                      }
                    >
                      {account.status ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className={cx("action-table-data")}>
                    <div className={cx("edit-delete-action")}>
                      <div
                        className={cx("icon")}
                        onClick={() => handlEdit(account)}
                      >
                        <ModeEditOutlineOutlinedIcon
                          style={{ color: "#3577f1" }}
                        />
                      </div>
                      <div
                        className={cx("icon")}
                        onClick={() => handleDelete(account._id)}
                      >
                        <DeleteOutlineOutlinedIcon style={{ color: "red" }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={isModalAddUser}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: { marginTop: "-30px", borderRadius: "16px", width: "500px" },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalAdd}>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>
          <div className={cx("modalContent")} style={{ marginLeft: "20px" }}>
            <div className={cx("title")}>Chỉnh sửa người dùng</div>
            <div
              className={cx("formGroup")}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div>
                <div className={cx("label")}>Ảnh đại diện</div>
                <div
                  className={cx("input-blocks")}
                  onClick={handleClickChangeImage}
                >
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  {getAccount.thumbnail ? (
                    <img
                      src={getAccount.thumbnail}
                      alt="Logo"
                      className={cx("preview-img")}
                    />
                  ) : (
                    <>
                      <AddCircleOutlineIcon
                        fontSize="inherit"
                        style={{ color: "#ff9f43" }}
                      />
                      <div className={cx("title-img")}>Thêm hình ảnh</div>
                    </>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className={cx("btn-change")}
                onClick={handleClickChangeImage}
              >
                Thay đổi ảnh
              </button>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Tên</div>
                <input
                  type="text"
                  name="fullName"
                  value={editAccount.fullName}
                  className={cx("input")}
                  onChange={handleInputChange}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>SĐT</div>
                <input
                  type="text"
                  name="phone"
                  value={editAccount.phone}
                  className={cx("input")}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Email</div>
                <input
                  type="text"
                  name="email"
                  value={editAccount.email}
                  className={cx("input")}
                  onChange={handleInputChange}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Vai trò</div>
                <select
                  name="role_id"
                  className={cx("select-role")}
                  value={editAccount.role_id}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn vai trò</option>
                  {allRole.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Mật khẩu </div>
                <input
                  type="text"
                  name="password"
                  value={editAccount.password}
                  className={cx("input")}
                  onChange={handleInputChange}
                />
              </div>
            </div> */}
            <div className={cx("info")} style={{ marginBottom: "10px" }}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  name="status"
                  color="warning"
                  checked={editAccount.status}
                  onClick={() => {
                    setEditAccount((prev) => ({
                      ...prev,
                      status: !prev.status, // Đảo trạng thái
                    }));
                    console.log(editAccount);
                  }}
                />
              </div>
            </div>

            <div className={cx("buttons")} style={{ marginRight: "20px" }}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModalAdd}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleUpdate}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default User;
