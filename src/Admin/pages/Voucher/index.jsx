import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Voucher.module.scss";
import Header from "../../components/Header";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  changeVoucherStatus,
  deleteVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
} from "../../../services/voucher.service";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../Context/Auth.context";

const cx = classNames.bind(styles);

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalSale, setIsModalSale] = useState(false);
  const [editVoucher, setEditVoucher] = useState({
    title: "",
    discount: "",
    min_order_total: "",
    status: true,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [isAccess, setIsAccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { permissions } = useAuth();

  // Fetch danh sách voucher
  const fetchVoucher = async () => {
    try {
      const response = await getAllVouchers();
      if (response) {
        setVouchers(response);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher:", error);
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, []);

  const handleDelete = (id) => {
    setSelectedId(id); // Lưu id của vai trò cần xóa
    setOpen(true); // Mở hộp thoại xác nhận
  };

  // Xóa voucher
  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await deleteVoucher(selectedId);
      if (response) {
        setVouchers((prev) =>
          prev.filter((voucher) => voucher._id !== selectedId)
        );
        setErrorMessage("Xóa voucher thành công");
        setOpenSnackbar(true);
        setIsAccess(true);
      }
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
    } finally {
      setOpen(false); // Đóng hộp thoại sau khi xử lý xong
      setSelectedId(null); // Xóa id đã lưu
    }
  };

  // Thay đổi trạng thái voucher
  const handleChangeStatus = async (id, currentStatus) => {
    if (!permissions?.includes("vouchers_edit")) {
      setErrorMessage("Bạn không có quyền truy cập");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    try {
      const newStatus = !currentStatus;
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher._id === id ? { ...voucher, status: newStatus } : voucher
        )
      );
      await changeVoucherStatus(id, newStatus);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  // Mở modal chỉnh sửa voucher
  const handleOpenModal = async (id) => {
    setIsModalSale(true);
    try {
      const getVoucher = await getVoucherById(id);
      if (getVoucher) {
        setEditVoucher(getVoucher[0]);
      } else {
        console.warn("Không tìm thấy voucher!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin voucher:", error);
    }
  };

  // Đóng modal
  const handleCloseModalAdd = () => {
    setIsModalSale(false);
  };

  // Cập nhật state khi nhập form
  const handleChangeVoucher = (e) => {
    const { name, value, type, checked } = e.target;
    setEditVoucher((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Cập nhật voucher
  const handleEditVoucher = async () => {
    if (!editVoucher.title) {
      setErrorMessage("Vui lòng nhập tên voucher");
      setOpenSnackbar(true);
      setIsAccess(false);

      return;
    }
    if (!editVoucher.discount) {
      setErrorMessage("Vui lòng nhập % giảm giá");
      setOpenSnackbar(true);
      setIsAccess(false);

      return;
    }
    if (!editVoucher.min_order_total) {
      setErrorMessage("Vui lòng nhập Đơn tối thiểu");
      setOpenSnackbar(true);
      setIsAccess(false);

      return;
    }
    try {
      await updateVoucher(editVoucher._id, editVoucher);
      fetchVoucher(); // Cập nhật lại danh sách voucher
      setIsModalSale(false); // Đóng modal
      setErrorMessage("Cập nhật voucher thành công");
      setOpenSnackbar(true);
      setIsAccess(true);
    } catch (error) {
      if (error.message) {
        // Hiển thị thông báo lỗi từ backend
        setErrorMessage(error.message); // Lấy lỗi từ backend và hiển thị
        setOpenSnackbar(true);
        setIsAccess(false);
      }
      console.error("Lỗi khi cập nhật voucher:", error);
    }
  };

  return (
    <div className={cx("table")}>
      <Header title="Giảm Giá" fetchVoucher={fetchVoucher} />
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
      <div className={cx("table-list")}>
        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Giảm giá</th>
                <th>Trạng thái</th>
                <th className={cx("no-sort")}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher, index) => (
                <tr key={voucher._id}>
                  <td style={{ fontWeight: "bold" }}>{index + 1}</td>
                  <td>{voucher.title}</td>
                  <td>{voucher.discount}%</td>
                  <td>
                    <span
                      className={cx(
                        "badge",
                        voucher.status ? "badge-linesuccess" : "badge-linered"
                      )}
                      onClick={() =>
                        handleChangeStatus(voucher._id, voucher.status)
                      }
                    >
                      {voucher.status ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className={cx("action-table-data")}>
                    <div className={cx("edit-delete-action")}>
                      {permissions?.includes("vouchers_edit") && (
                        <div
                          className={cx("icon")}
                          onClick={() => handleOpenModal(voucher._id)}
                        >
                          <ModeEditOutlineOutlinedIcon
                            style={{ color: "#3577f1" }}
                          />
                        </div>
                      )}
                      {permissions?.includes("vouchers_edit") && (
                        <div
                          className={cx("icon")}
                          onClick={() => handleDelete(voucher._id)}
                        >
                          <DeleteOutlineOutlinedIcon style={{ color: "red" }} />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            marginTop: "-100px",
          },
        }}
      >
        <DialogTitle>Bạn có muốn xóa voucher này?</DialogTitle>

        <DialogActions>
          <button
            type="button"
            className={cx("btn-cancel")}
            onClick={() => setOpen(false)}
          >
            Hủy
          </button>
          <button
            type="button"
            className={cx("btn-submit")}
            onClick={handleConfirmDelete}
          >
            Xóa
          </button>
        </DialogActions>
      </Dialog>

      {/* Modal chỉnh sửa voucher */}
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
            <div className={cx("title")}>Chỉnh sửa voucher</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Tên voucher <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={editVoucher.title || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Giảm giá <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="discount"
                className={cx("input")}
                value={editVoucher.discount || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Đơn tối thiểu <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="min_order_total"
                className={cx("input")}
                value={editVoucher.min_order_total || ""}
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
                  checked={editVoucher.status}
                  onChange={handleChangeVoucher}
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
                onClick={handleEditVoucher}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default Voucher;
