import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, DialogActions, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addBrand } from "../../../services/brand.service";
import { addCategory, getCategorys } from "../../../services/category.service";
import { createCategorySelect } from "../../../helper/select-tree";
import { addRole } from "../../../services/role.service";

const cx = classNames.bind(styles);

const Header = ({ title, fetchCategorys, fetchBrands, fetchRoles }) => {
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalAddBrand, setIsModalAddBrand] = useState(false);
  const [isModalAddRole, setIsModalAddRole] = useState(false);
  const [isModalAddUser, setIsModalAddUser] = useState(false);
  const [brand, setBrand] = useState({
    name: "",
    thumbnail: null,
    status: true,
  });
  const [category, setCategory] = useState({
    title: "",
    parent_id: "",
    status: true,
  });
  const [role, setRole] = useState({
    title: "",
    status: true,
  });
  const [getAllCategory, setGetAllCategory] = useState([]);
  const fileInputRef = useRef(null);
  const [getBrand, setGetBrand] = useState([]);

  const navigate = useNavigate();

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const fetchAllCategorys = async () => {
    const response = await getCategorys();
    if (response) {
      setGetAllCategory(response);
    }
  };

  useEffect(() => {
    fetchAllCategorys();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value, type, checked, files } = e.target;
  //   setBrand((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : files ? files[0] : value,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (files && files.length > 0) {
      setBrand((prev) => ({
        ...prev,
        [name]: files[0], // Đảm bảo lấy file đầu tiên trong danh sách
      }));
    } else {
      setBrand((prev) => {
        const newState = {
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        };
        return newState;
      });
    }
  };

  const handleChangeCategory = (e) => {
    const { name, value, type, checked } = e.target;

    setCategory((prev) => {
      const newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      return newState;
    });
  };

  const handleChangeRole = (e) => {
    const { name, value, type, checked } = e.target;
    setRole((prev) => {
      const newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      return newState;
    });
  };

  const handleCloseModalAdd = () => {
    if (title === "Danh mục") {
      setIsModalAdd(!isModalAdd);
    }
    if (title === "Thương Hiệu") {
      setIsModalAddBrand(!isModalAddBrand);
    }
    if (title === "Sản Phẩm") {
      navigate("/adminbb/create-product");
    }
    if (title === "Vai Trò & Quyền") {
      setIsModalAddRole(!isModalAddRole);
    }
    if (title === "Người Dùng") {
      setIsModalAddUser(!isModalAddUser);
    }
  };

  const handleAddBrand = async () => {
    if (!brand.name || !brand.thumbnail) {
      alert("Vui lòng nhập tên thương hiệu và tải lên ảnh thương hiệu!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", brand.name);
      formData.append("status", brand.status ?? true);
      formData.append("thumbnail", brand.thumbnail);

      const response = await addBrand(formData);
      if (response) {
        console.log("Thêm thương hiệu thành công:", response);

        await fetchBrands();
        setIsModalAddBrand(false);
        setBrand({
          name: "",
          thumbnail: null,
          status: true,
        });
        setGetBrand([]);
      } else {
        alert("Không có phản hồi từ server.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm thương hiệu:", error);
      alert("Đã xảy ra lỗi! Vui lòng thử lại.");
    }
  };

  const handleAddCateogy = async () => {
    if (!category.title) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", category.title);
      formData.append("parent_id", category.parent_id);
      formData.append("status", category.status); // Đảm bảo chỉ gửi file hợp lệ

      const response = await addCategory(formData);
      fetchCategorys();
      fetchAllCategorys();
      if (response) {
        console.log("Thêm danh mục thành công:", response);
      }
      setGetAllCategory(false);
      setCategory({
        title: "",
        parent_id: "",
        status: true,
      });
    } catch (error) {
      console.error("Lỗi khi thêm thương hiệu:", error);
      alert("Đã xảy ra lỗi! Vui lòng thử lại.");
    }
  };

  const handleAddRole = async () => {
    if (!role.title) {
      alert("Vui lòng nhập vai trò!");
      return;
    }
    try {
      const response = await addRole(role);
      if (response) {
        console.log("Thêm vai trò thành công:", response);
        fetchRoles();
        setIsModalAddRole(false);
        setRole({ title: "", status: true });
      }
    } catch (error) {
      console.error("Lỗi khi thêm vai trò:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGetBrand({ ...getBrand, thumbnail: reader.result }); // Lưu URL của ảnh vào state
      };
      reader.readAsDataURL(file);
      setBrand((prev) => ({ ...prev, thumbnail: file })); // Lưu file thật vào state để gửi lên server
    }
  };

  const handleClickChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file picker for image
    }
  };

  return (
    <div className={cx("header")}>
      <div className={cx("title-header")}>
        <div className={cx("title")}>
          <div className={cx("title-page")}>{title}</div>
          {title === "Chi tiết sản phẩm" ? (
            <div className={cx("title-desc")}>
              Chi tiết đầy đủ của một sản phẩm
            </div>
          ) : (
            <div className={cx("title-desc")}>Quản Lý {title} Của Bạn</div>
          )}
        </div>
      </div>

      {title !== "Chi tiết sản phẩm" && title !== "Quyền hạn" && (
        <div className={cx("btn-add")} onClick={handleCloseModalAdd}>
          <AddCircleOutlineIcon />
          <button>
            {title === "Vai Trò & Quyền" ? "Thêm Vai Trò" : `Thêm ${title}`}
          </button>
        </div>
      )}

      {/* Add Category Modal */}
      <Dialog
        open={isModalAdd}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "400px",
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
              <div className={cx("label")}>Tên danh mục</div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={category.title || ""}
                onChange={handleChangeCategory}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Danh mục cha</div>
              <select
                id="parent_id"
                name="parent_id"
                className={cx("input")}
                value={category.parent_id || ""}
                onChange={handleChangeCategory}
              >
                <option value="">Chọn danh mục cha</option>
                {createCategorySelect(getAllCategory)}
              </select>
            </div>
            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  {...label}
                  name="status"
                  color="warning"
                  checked={category.status}
                  onChange={(e) =>
                    setCategory((prev) => ({
                      ...prev,
                      status: e.target.checked, // Switch luôn gửi boolean
                    }))
                  }
                />
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
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleAddCateogy}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add Brand Modal */}
      <Dialog
        open={isModalAddBrand}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
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
                <div className={cx("label")}>Logo</div>
                <label className={cx("input-blocks")}>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />

                  {getBrand.thumbnail ? (
                    <img
                      src={getBrand.thumbnail}
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
                </label>
              </div>
              <button
                type="button"
                className={cx("btn-change")}
                onClick={handleClickChangeImage}
              >
                Thay đổi ảnh
              </button>
            </div>
            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  name="status"
                  color="warning"
                  checked={brand.status}
                  onChange={handleChange}
                />
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

      {/* Add Role Modal */}
      <Dialog
        open={isModalAddRole}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
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
            <div className={cx("title")}>Tạo vai trò</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Tên vai trò</div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={role.title}
                onChange={handleChangeRole}
              />
              <div className={cx("status")}>
                <div className={cx("label")}>Trạng thái</div>
                <div className={cx("switch")}>
                  <Switch
                    {...label}
                    name="status"
                    color="warning"
                    checked={role.status}
                    onChange={handleChangeRole}
                  />
                </div>
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
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleAddRole}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add User Modal */}
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
                <select className={cx("select-role")}>
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
