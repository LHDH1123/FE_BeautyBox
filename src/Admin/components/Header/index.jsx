import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, DialogActions, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addBrand } from "../../../services/brand.service";

const cx = classNames.bind(styles);

const Header = ({ title }) => {
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalAddBrand, setIsModalAddBrand] = useState(false);
  const [isModalAddRole, setIsModalAddRole] = useState(false);
  const [isModalAddUser, setIsModalAddUser] = useState(false);

  const navigate = useNavigate();

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const [brand, setBrand] = useState({
    name: "",
    thumbnail: null,
    status: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setBrand((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleCloseModalAdd = () => {
    if (title === "Danh mục") {
      if (isModalAdd === true) {
        setIsModalAdd(false);
      } else {
        setIsModalAdd(true);
      }
    }

    if (title === "Thương Hiệu") {
      if (isModalAddBrand === true) {
        setIsModalAddBrand(false);
      } else {
        setIsModalAddBrand(true);
      }
    }

    if (title === "Sản Phẩm") {
      navigate("/adminbb/create-product");
    }

    if (title === "Vai Trò & Quyền") {
      if (isModalAddRole === true) {
        setIsModalAddRole(false);
      } else {
        setIsModalAddRole(true);
      }
    }

    if (title === "Người Dùng") {
      if (isModalAddUser === true) {
        setIsModalAddUser(false);
      } else {
        setIsModalAddUser(true);
      }
    }
  };

  const handleAddBrand = async () => {
    console.log(brand);

    if (!brand.name) {
      alert("Vui lòng nhập tên thương hiệu!");
      return;
    }

    // Nếu không có ảnh, đặt giá trị mặc định hoặc cảnh báo người dùng
    if (!brand.thumbnail) {
      alert("Vui lòng tải lên ảnh thương hiệu!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", brand.name);
      formData.append("status", brand.status ?? true); // Mặc định là true nếu không có giá trị
      formData.append("thumbnail", brand.thumbnail); // Ảnh được chọn từ input file

      const response = await addBrand(formData);

      if (response) {
        console.log("Thêm thương hiệu thành công:", response);
      }
      setIsModalAddBrand(false);
      
    } catch (error) {
      console.error("Lỗi khi thêm thương hiệu:", error);
      alert("Đã xảy ra lỗi! Vui lòng thử lại.");
    }
  };

  return (
    <div className={cx("header")}>
      <div className={cx("title-header")}>
        <div className={cx("title")}>
          <div className={cx("title-page")}>{title}</div>
          <div className={cx("title-desc")}>Quản Lý {title} Của Bạn</div>
        </div>
      </div>
      <div className={cx("btn-add")} onClick={handleCloseModalAdd}>
        <AddCircleOutlineIcon />
        <button>
          {title === "Vai Trò & Quyền" ? "Thêm Vai Trò" : `Thêm ${title}`}
        </button>
      </div>

      {/* Add Category */}
      <Dialog
        open={isModalAdd} // Ensure this is boolean
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px", // Dịch lên trên 40px
            borderRadius: "16px", // Bo góc 16px
            height: "300px",
            width: "500px",
          },
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

          <div className={cx("modalContent")}>
            <div className={cx("title")}>Tạo danh mục</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Danh mục cha</div>
              <input type="text" className={cx("input")} />
            </div>
            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch {...label} defaultChecked />
              </div>
            </div>
            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModalAdd}
              >
                Hủy
              </button>
              <button type="submit" className={cx("btn-submit")}>
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add brand */}
      <Dialog
        open={isModalAddBrand} // Ensure this is boolean
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px", // Dịch lên trên 40px
            borderRadius: "16px", // Bo góc 16px
            height: "460px",
            width: "500px",
          },
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

          <div className={cx("modalContent")}>
            <div className={cx("title")}>Tạo thương hiệu</div>

            <div className={cx("formGroup")}>
              <div className={cx("label")}>Thương hiệu</div>
              <input
                type="text"
                name="name"
                className={cx("input")}
                value={brand.name}
                onChange={handleChange}
              />
            </div>

            <div
              className={cx("formGroup")}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div>
                <div className={cx("label")}>thumbnail</div>
                <label className={cx("input-blocks")}>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="thumbnail/*"
                    style={{ display: "none" }}
                    onChange={handleChange}
                  />
                  <AddCircleOutlineIcon
                    fontSize="inherit"
                    style={{ color: "#ff9f43" }}
                  />
                  <div className={cx("title-img")}>
                    {brand.thumbnail ? brand.thumbnail.name : "Thêm hình ảnh"}
                  </div>
                </label>
              </div>
              <button
                type="button"
                className={cx("btn-change")}
                onClick={() => setBrand({ ...brand, thumbnail: null })}
              >
                Xóa ảnh
              </button>
            </div>

            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  name="status"
                  checked={brand.status}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={cx("buttons")}>
              <button type="button" className={cx("btn-cancel")}>
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleAddBrand}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add role */}
      <Dialog
        open={isModalAddRole} // Ensure this is boolean
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px", // Dịch lên trên 40px
            borderRadius: "16px", // Bo góc 16px
            height: "270px",
            width: "500px",
          },
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

          <div className={cx("modalContent")}>
            <div className={cx("title")}>Tạo vai trò</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Tên vai trò</div>
              <input type="text" className={cx("input")} />
            </div>

            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModalAdd}
              >
                Hủy
              </button>
              <button type="submit" className={cx("btn-submit")}>
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add user */}
      <Dialog
        open={isModalAddUser} // Ensure this is boolean
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px", // Dịch lên trên 40px
            borderRadius: "16px", // Bo góc 16px
            // height: "460px",
            width: "500px",
          },
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

          <div className={cx("modalContent")} style={{ marginLeft: "15px" }}>
            <div className={cx("title")}>Tạo người dùng</div>
            <div
              className={cx("formGroup")}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div>
                <div className={cx("label")}>Ảnh đại diện</div>
                <div className={cx("input-blocks")}>
                  <AddCircleOutlineIcon
                    fontSize="inherit"
                    style={{ color: "#ff9f43" }}
                  />
                  <div className={cx("title-img")}>Thêm hình ảnh</div>
                </div>
              </div>
              <button type="submit" className={cx("btn-change")}>
                Thay đổi ảnh
              </button>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Tên</div>
                <input type="text" className={cx("input")} />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>SĐT</div>
                <input type="text" className={cx("input")} />
              </div>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Email</div>
                <input type="text" className={cx("input")} />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Vai trò</div>
                <select className={cx("select-role")} id="">
                  <option value="">Chọn vai trò</option>
                  <option value="">Admin</option>
                  <option value="">Quản lý nội dung</option>
                </select>
              </div>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Mật khẩu</div>
                <input type="text" className={cx("input")} />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Xác nhận lại mật khẩu</div>
                <input type="text" className={cx("input")} />
              </div>
            </div>

            <div className={cx("buttons")} style={{ marginRight: "12px" }}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModalAdd}
              >
                Hủy
              </button>
              <button type="submit" className={cx("btn-submit")}>
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default Header;
