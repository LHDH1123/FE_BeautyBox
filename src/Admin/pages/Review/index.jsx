import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Review.module.scss";
import Header from "../../components/Header";
import {
  changePublic,
  edit,
  getAllReviews,
} from "../../../services/review.service";
// import { getUser } from "../../../services/user.service";
// import { getDetailProduct } from "../../../services/product.service";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useAuth } from "../../Context/Auth.context";
import { Alert, Snackbar, TextField, Pagination } from "@mui/material";
import Rating from "@mui/material/Rating";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";

const cx = classNames.bind(styles);

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const { permissions } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAccess, setIsAccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [editedImages, setEditedImages] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const fetchReviews = async () => {
    try {
      const response = await getAllReviews();
      if (response && response.interactions) {
        setReviews(response.interactions);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChangeStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      setReviews((prev) =>
        prev.map((review) =>
          review._id === id ? { ...review, public: newStatus } : review
        )
      );
      await changePublic(id, newStatus);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const handleOpenModal = (review) => {
    setSelectedReview(review);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
    setEditedImages(review.thumbnail || []);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setOpenModal(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...editedImages];
    updatedImages.splice(index, 1);
    setEditedImages(updatedImages);
  };

  const handleEditReview = async () => {
    if (!editedComment.trim() || editedRating === 0) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin.");
      setIsAccess(false);
      setOpenSnackbar(true);
      return;
    }

    try {
      await edit(selectedReview._id, {
        rating: editedRating,
        comment: editedComment,
        thumbnail: editedImages,
      });

      setReviews((prev) =>
        prev.map((review) =>
          review._id === selectedReview._id
            ? {
                ...review,
                rating: editedRating,
                comment: editedComment,
                thumbnail: editedImages,
              }
            : review
        )
      );

      setOpenModal(false);
      setErrorMessage("Đánh giá đã được cập nhật thành công.");
      setIsAccess(true);
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("Lỗi khi cập nhật đánh giá.");
      setIsAccess(false);
      setOpenSnackbar(true);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPage = Math.ceil(reviews.length / itemsPerPage);

  return (
    <div className={cx("table")}>
      <Header title="Đánh Giá" />
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
      </Snackbar>

      <div className={cx("table-list")}>
        <table className={cx("table", "datanew")}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Bình luận</th>
              <th>Đánh giá</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th>Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review) => (
              <tr key={review._id}>
                <td>{review.userName}</td>
                <td className={cx("comment")}>{review.comment}</td>
                <td>
                  <Rating readOnly value={review.rating} size="small" />
                </td>
                <td>{new Date(review.createAt).toLocaleDateString("vi-VN")}</td>
                <td>
                  <span
                    className={cx(
                      "badge",
                      review.public ? "badge-linesuccess" : "badge-linered"
                    )}
                    onClick={() =>
                      handleChangeStatus(review._id, review.public)
                    }
                  >
                    {review.public ? "Public" : "Unpublic"}
                  </span>
                </td>
                <td className={cx("action-table-data")}>
                  <div className={cx("edit-delete-action")}>
                    <div
                      className={cx("icon")}
                      onClick={() => handleOpenModal(review)}
                    >
                      <RemoveRedEyeOutlinedIcon />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={cx("pagination")}>
          <Pagination
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            border: "none",
          }}
        >
          {selectedReview && (
            <div className={cx("modal-content")}>
              <h2>Chỉnh sửa đánh giá</h2>
              <p>
                <strong>Khách hàng:</strong> {selectedReview.userName}
              </p>
              <p>
                <strong>Sản phẩm:</strong> {selectedReview.productName}
              </p>

              <p>
                <strong>Hình ảnh:</strong>
              </p>
              {editedImages.length ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: 10,
                  }}
                >
                  {editedImages.map((img, index) => (
                    <div key={index} className={cx("img-upload")}>
                      <img
                        src={img}
                        alt={`review-img-${index}`}
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className={cx("remove-btn")}
                      >
                        <CancelIcon
                          fontSize="inherit"
                          style={{ color: "red" }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Không có hình ảnh</div>
              )}

              <p>
                <strong>Đánh giá:</strong>
              </p>
              <Rating
                value={editedRating}
                onChange={(e, newValue) => setEditedRating(newValue)}
              />

              <TextField
                label="Bình luận"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                style={{ marginBottom: 16, marginTop: 20 }}
              />

              <div className={cx("btn-addproduct")}>
                <button
                  type="button"
                  className={cx("btn-cancel")}
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                {permissions?.includes("reviews_edit") && (
                  <button
                    type="button"
                    className={cx("btn-submit")}
                    onClick={handleEditReview}
                  >
                    Lưu đánh giá
                  </button>
                )}
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Review;
