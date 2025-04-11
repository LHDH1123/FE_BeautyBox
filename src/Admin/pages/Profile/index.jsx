import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Header from "../../../Admin/components/Header";
import { Alert, Avatar, IconButton, Snackbar, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { checkLogin } from "../../../services/auth.service";
import { getRole } from "../../../services/role.service";
import { updateAccount } from "../../../services/account.service";

const cx = classNames.bind(styles);

const Profile = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAccess, setIsAccess] = useState(false);
  const [image, setImage] = useState("/path/to/avatar.jpg");
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageFile(null);
  };

  const fetchUser = async () => {
    try {
      const response = await checkLogin();
      if (response) {
        const role = await getRole(response.user.role_id);

        setForm({
          id: response.user._id,
          fullName: response.user.fullName,
          email: response.user.email,
          phone: response.user.phone,
          role: role.title,
        });

        setImage(response.user.thumbnail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);

      if (imageFile) {
        formData.append("thumbnail", imageFile);
      }

      await updateAccount(form.id, formData);

      setIsAccess(true);
      setErrorMessage("Cập nhật thông tin thành công!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setIsAccess(false);
      setErrorMessage("Cập nhật thất bại!");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleReset = () => {
    fetchUser();
  };

  return (
    <div className={cx("table")}>
      <Header title="Trang cá nhân" />

      {errorMessage && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={isAccess ? "success" : "warning"}
            onClose={() => setOpenSnackbar(false)}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      )}

      <div className={cx("profile")}>
        <div className={cx("section")}>
          <div className={cx("content")}>
            {/* LEFT - Avatar */}
            <div className={cx("left")}>
              <div className={cx("avatar-box")}>
                <div className={cx("avatar-wrapper")}>
                  <Avatar
                    src={image}
                    alt="avatar"
                    className={cx("avatar")}
                    sx={{ width: 120, height: 120 }}
                  >
                    p
                  </Avatar>
                  {image && (
                    <IconButton
                      className={cx("remove-btn")}
                      onClick={handleRemoveImage}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  )}
                </div>
                <label className={cx("upload-btn")}>
                  Thay đổi ảnh
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* RIGHT - Form */}
            <div className={cx("right")}>
              <div className={cx("row")}>
                <TextField
                  fullWidth
                  label="Tên"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  label="Vai trò"
                  name="role"
                  value={form.role}
                  InputProps={{ readOnly: true }}
                />
              </div>
              <div className={cx("row")}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  label="SĐT"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className={cx("actions")}>
                <button
                  type="button"
                  className={cx("btn-cancel")}
                  onClick={handleReset}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={cx("btn-submit")}
                  onClick={handleUpdate}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
