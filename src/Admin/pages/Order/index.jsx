import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Order.module.scss";
import Header from "../../components/Header";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

import {
  Pagination,
  Modal,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { getAllOrder } from "../../../services/order.service";

const cx = classNames.bind(styles);

const Order = () => {
  // const [errorMessage, setErrorMessage] = useState("");
  // const [openSnackbar, setOpenSnackbar] = useState(false);
  // const [isAccess, setIsAccess] = useState(false);
  const [listOrder, setListOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  const itemsPerPage = 20;

  const totalPage = Math.ceil(listOrder.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = listOrder.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const fetchOrder = async () => {
    try {
      const response = await getAllOrder();
      if (response) {
        const sortedOrders = response.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setListOrder(sortedOrders);
      } else {
        console.warn("Dữ liệu trả về không đúng định dạng:", response);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    maxHeight: "80vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className={cx("table")}>
      <Header title="Đơn Hàng" />
      {/* 
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={isAccess ? "success" : "error"}
          onClose={() => setOpenSnackbar(false)}
        >
          {errorMessage}
        </Alert>
      </Snackbar> */}

      <div className={cx("table-list")}>
        <table className={cx("table", "datanew")}>
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Trang thái</th>
              <th>Khách phải trả</th>
              <th>Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-12).toUpperCase()}</td>
                <td>
                  {order.isCheckout
                    ? "Đã thanh toán"
                    : "Thanh toán khi nhận hàng"}
                </td>
                <td>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.total)}
                </td>
                <td className={cx("action-table-data")}>
                  <div className={cx("edit-delete-action")}>
                    <div
                      className={cx("icon")}
                      onClick={() => handleViewOrder(order)}
                    >
                      <RemoveRedEyeOutlinedIcon />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          className={cx("pagnigation")}
          count={totalPage}
          page={currentPage}
          onChange={handlePageChange}
          color="secondary"
          siblingCount={1}
          boundaryCount={1}
        />
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <Modal open={open} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Chi tiết đơn hàng
            </Typography>

            <Typography>
              <strong>Mã đơn hàng:</strong>{" "}
              {selectedOrder._id.slice(-12).toUpperCase()}
            </Typography>
            <Typography>
              <strong>Ngày đặt:</strong>{" "}
              {format(new Date(selectedOrder.createdAt), "dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </Typography>
            <Typography>
              <strong>Trạng thái:</strong>{" "}
              {selectedOrder.isCheckout
                ? "Đã thanh toán"
                : "Thanh toán khi nhận hàng"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Thông tin người nhận:
            </Typography>
            <Typography>👤 {selectedOrder.userInfo.fullName}</Typography>
            <Typography>📞 {selectedOrder.userInfo.phone}</Typography>
            <Typography>📍 {selectedOrder.userInfo.address}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Sản phẩm:
            </Typography>
            {selectedOrder.products.map((item) => (
              <Box key={item._id} sx={{ mb: 1, ml: 2 }}>
                <Typography>
                  {" "}
                  <strong>Mã sản phẩm:</strong> {item.product_id}
                </Typography>
                <Typography>
                  <strong>Số lượng:</strong> {item.quantity}
                </Typography>
                <Typography>
                  <strong>Giá:</strong>{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </Typography>
                {item.discountPercentage > 0 && (
                  <Typography>
                    <strong>Giảm giá:</strong> {item.discountPercentage}%
                  </Typography>
                )}
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography>
              <strong>Tổng tiền:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(selectedOrder.total)}
            </Typography>

            <Box textAlign="right" mt={3}>
              <Button
                onClick={handleCloseModal}
                variant="contained"
                color="secondary"
              >
                Đóng
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Order;
