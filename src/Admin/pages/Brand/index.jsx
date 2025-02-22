import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Brand.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";
import TableHeader from "../../components/TableHeader";
import {
  changeStatus,
  deletebrand,
  getBrands,
} from "../../../services/brand.service";
import { Box, Dialog, DialogActions, Switch } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const cx = classNames.bind(styles);

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // State for "Select All" checkbox
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isModalEditBrand, setIsModalEditBrand] = useState(false);

  const handleCloseModalEdit = () => {
    setIsModalEditBrand(false);
  };

  const handleOpenModal = () => {
    setIsModalEditBrand(true);
  };

  const fetchBrands = async () => {
    const response = await getBrands();
    if (response) {
      setBrands(response);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này không?")) return;

    try {
      await deletebrand(id);
      setBrands((prevBrands) => prevBrands.filter((brand) => brand._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa thương hiệu:", error);
    }
  };

  const handleChangeStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      setBrands((prevBrands) =>
        prevBrands.map((brand) =>
          brand._id === id ? { ...brand, status: newStatus } : brand
        )
      );
      await changeStatus(id, newStatus);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      setSelectedBrands(brands.map((brand) => brand._id)); // Select all
    } else {
      setSelectedBrands([]); // Deselect all
    }
  };

  const handleSelectOne = (id) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((brandId) => brandId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    setSelectAll(selectedBrands.length === brands.length && brands.length > 0);
  }, [selectedBrands, brands]);

  return (
    <div className={cx("table")}>
      <Header title="Thương Hiệu" />
      <div className={cx("table-list")}>
        <TableHeader
          selectedBrands={selectedBrands}
          fetchBrands={fetchBrands}
        />
        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th className={cx("cb-all")}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Thương hiệu</th>
                <th>Logo</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th className={cx("no-sort")}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand._id}>
                  <td>
                    <label className={cx("checkboxs")}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand._id)}
                        onChange={() => handleSelectOne(brand._id)}
                      />
                      <span className={cx("checkmarks")}></span>
                    </label>
                  </td>
                  <td style={{ fontWeight: "600" }}>{brand.name}</td>
                  <td>
                    <span className={cx("d-flex")}>
                      <img src={brand.thumbnail} alt={brand.name} />
                    </span>
                  </td>
                  <td>
                    {new Date(brand.createdBy.createAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td>
                    <span
                      className={cx(
                        "badge",
                        brand.status ? "badge-linesuccess" : "badge-linered"
                      )}
                      onClick={() =>
                        handleChangeStatus(brand._id, brand.status)
                      }
                    >
                      {brand.status ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className={cx("action-table-data")}>
                    <div className={cx("edit-delete-action")}>
                      <div
                        className={cx("icon")}
                        onClick={() => handleOpenModal()}
                      >
                        <ModeEditOutlineOutlinedIcon
                          style={{ color: "#3577f1" }}
                        />
                      </div>
                      <div
                        className={cx("icon")}
                        onClick={() => handleDelete(brand._id)}
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
        open={isModalEditBrand} // Ensure this is boolean
        onClose={handleCloseModalEdit}
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
            <div
              className={cx("btn_exit")}
              onClick={() => handleCloseModalEdit()}
            >
              <button>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>

          <div className={cx("modalContent")}>
            <div className={cx("title")}>Chỉnh sửa thương hiệu</div>

            <div className={cx("formGroup")}>
              <div className={cx("label")}>Thương hiệu</div>
              <input type="text" name="name" className={cx("input")} />
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
                    accept="thumbnail/*"
                    style={{ display: "none" }}
                  />
                  <AddCircleOutlineIcon
                    fontSize="inherit"
                    style={{ color: "#ff9f43" }}
                  />
                  <div className={cx("title-img")}>Thêm hình ảnh</div>
                </label>
              </div>
              <button type="button" className={cx("btn-change")}>
                Xóa ảnh
              </button>
            </div>

            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch name="status" />
              </div>
            </div>

            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={() => handleCloseModalEdit()}
              >
                Hủy
              </button>
              <button type="submit" className={cx("btn-submit")}>
                Cập nhật
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default Brand;
