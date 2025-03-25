import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Voucher.module.scss";
import Header from "../../components/Header";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  changeVoucherStatus,
  deleteVoucher,
  getVoucherById,
  getVouchers,
  updateVoucher,
} from "../../../services/voucher.service";
import { Box, Dialog, DialogActions, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const cx = classNames.bind(styles);

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalSale, setIsModalSale] = useState(false);
  const [editVoucher, setEditVoucher] = useState({
    title: "",
    discount: "",
    description: "",
    status: true,
  });

  const label = { inputProps: { "aria-label": "Switch demo" } };

  // Fetch danh sách voucher
  const fetchVoucher = async () => {
    try {
      const response = await getVouchers();
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

  // Xóa voucher
  const handleDelete = async (id) => {
    try {
      const response = await deleteVoucher(id);
      if (response) {
        setVouchers((prev) => prev.filter((voucher) => voucher._id !== id));
      }
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
    }
  };

  // Thay đổi trạng thái voucher
  const handleChangeStatus = async (id, currentStatus) => {
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
    if (
      !editVoucher.title ||
      !editVoucher.discount ||
      !editVoucher.description
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      await updateVoucher(editVoucher._id, editVoucher);
      fetchVoucher(); // Cập nhật lại danh sách voucher
      setIsModalSale(false); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
      alert("Có lỗi xảy ra khi cập nhật voucher!");
    }
  };

  return (
    <div className={cx("table")}>
      <Header title="Giảm Giá" fetchVoucher={fetchVoucher} />
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
                      <div
                        className={cx("icon")}
                        onClick={() => handleOpenModal(voucher._id)}
                      >
                        <ModeEditOutlineOutlinedIcon
                          style={{ color: "#3577f1" }}
                        />
                      </div>
                      <div
                        className={cx("icon")}
                        onClick={() => handleDelete(voucher._id)}
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
              <div className={cx("label")}>Tên voucher</div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={editVoucher.title || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Giảm giá</div>
              <input
                type="text"
                name="discount"
                className={cx("input")}
                value={editVoucher.discount || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Mô tả</div>
              <input
                type="text"
                name="description"
                className={cx("input")}
                value={editVoucher.description || ""}
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
