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
import { addRole, getAllRoles } from "../../../services/role.service";
import { addAccount } from "../../../services/account.service";
import { createVoucher } from "../../../services/voucher.service";

const cx = classNames.bind(styles);

const Header = ({
  title,
  fetchCategorys,
  fetchBrands,
  fetchRoles,
  fetchAccount,
  fetchVoucher,
}) => {
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalSale, setIsModalSale] = useState(false);
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
  const [voucher, setVoucher] = useState({
    title: "",
    discount: "",
    description: "",
    status: true,
  });
  const [role, setRole] = useState({
    title: "",
    status: true,
  });
  const [account, setAccount] = useState({
    thumbnail: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role_id: "",
    confirmPassword: "",
    status: true,
  });
  const [getAllCategory, setGetAllCategory] = useState([]);
  const [getAllRole, setGetAllRole] = useState([]);
  const fileInputRef = useRef(null);
  const fileInputRefAccount = useRef(null);
  const [getBrand, setGetBrand] = useState([]);

  const navigate = useNavigate();

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const fetchAllCategorys = async () => {
    const response = await getCategorys();
    if (response) {
      setGetAllCategory(response);
    }
  };

  const fetchAllRoles = async () => {
    const response = await getAllRoles();
    if (response) {
      setGetAllRole(response);
    }
  };

  useEffect(() => {
    fetchAllCategorys();
    fetchAllRoles();
  }, []);

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

  const handleChangeVoucher = (e) => {
    const { name, value, type, checked } = e.target;

    setVoucher((prev) => {
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

  const handleChangeAccount = (e) => {
    const { name, value, type, checked } = e.target;

    setAccount((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    if (title === "Giảm Giá") {
      setIsModalSale(!isModalSale);
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

  const handleAddVoucher = async () => {
    if (!voucher.title && !voucher.discount && !voucher.description) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    console.log(voucher);
    try {
      const response = await createVoucher(voucher);
      if (response) {
        console.log("Thêm voucher thành công:", response);
        fetchVoucher();
        setIsModalSale(false);
        setVoucher({
          title: "",
          discount: "",
          description: "",
          status: true,
        });
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
      setAccount((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleClickChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file picker for image
    }
    if (fileInputRefAccount.current) {
      fileInputRefAccount.current.click(); // Open file picker for image
    }
  };

  const handleAddAccount = async () => {
    if (!account.fullName || !account.email || !account.password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (account.password !== account.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!account.role_id) {
      alert("Vui lòng chọn vai trò!");
    }

    try {
      const formData = new FormData();
      formData.append("fullName", account.fullName);
      formData.append("phone", account.phone);
      formData.append("email", account.email);
      formData.append("role_id", account.role_id);
      formData.append("password", account.password);
      formData.append("confirmPassword", account.confirmPassword);
      formData.append("status", account.status);

      if (account.thumbnail) {
        formData.append("thumnail", account.thumbnail);
      }

      const response = await addAccount(formData);

      if (response) {
        console.log(response);
        setIsModalAddUser(false);
        fetchAccount();
        setAccount({
          fullName: "",
          phone: "",
          email: "",
          role_id: "",
          password: "",
          confirmPassword: "",
          status: true,
          avatar: "",
        });
      } else {
        alert("Lỗi khi thêm tài khoản!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm tài khoản:", error);
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
                  checked={category?.status ?? false} // Tránh undefined
                  onChange={(e) =>
                    setCategory((prev) => ({
                      ...prev,
                      status: e.target.checked, // Switch gửi giá trị boolean chính xác
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
                <div className={cx("input-blocks")}>
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
                </div>
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
                  onClick={handleChange}
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
                    onClick={handleChangeRole}
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

      {/* Add Sale Modal */}
      <Dialog
        open={isModalSale}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "470px",
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
            <div className={cx("title")}>Tạo voucher</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Tên voucher</div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={voucher.title || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Giảm giá</div>
              <input
                type="text"
                name="discount"
                className={cx("input")}
                value={voucher.discount || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Mô tả</div>
              <input
                type="text"
                name="description"
                className={cx("input")}
                value={voucher.description || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  {...label}
                  name="status"
                  color="warning"
                  checked={voucher.status}
                  onChange={(e) =>
                    setVoucher((prev) => ({
                      ...prev,
                      status: e.target.checked,
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
                onClick={handleAddVoucher}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add Account Modal */}
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
            <div className={cx("title")}>Tạo người dùng</div>
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
                    ref={fileInputRefAccount}
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
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>SĐT</div>
                <input
                  type="text"
                  name="phone"
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Email</div>
                <input
                  type="text"
                  name="email"
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Vai trò</div>
                <select
                  name="role_id"
                  className={cx("select-role")}
                  onChange={handleChangeAccount}
                >
                  <option value="">Chọn vai trò</option>
                  {getAllRole.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Mật khẩu </div>
                <input
                  type="text"
                  name="password"
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Xác nhận lại mật khẩu</div>
                <input
                  name="confirmPassword"
                  type="text"
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
            </div>
            <div className={cx("info")} style={{ marginBottom: "10px" }}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  name="status"
                  color="warning"
                  checked={account.status ?? false} // Đảm bảo giá trị không bị undefined
                  onClick={(event, checked) => {
                    setAccount((prev) => ({ ...prev, status: checked }));
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
                onClick={handleAddAccount}
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

export default Header;
