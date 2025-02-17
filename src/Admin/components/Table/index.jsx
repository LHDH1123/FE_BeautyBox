import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Table.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../Header";
import TableHeader from "../TableHeader";
import {
  changeStatus,
  deletebrand,
  getBrands,
} from "../../../services/brand.service";
const cx = classNames.bind(styles);

const Table = () => {
  const [brands, setBrands] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // Thêm state cho checkbox "cb-all"
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await getBrands();
      if (response) {
        setBrands(response);
      }
    };

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
      setSelectedBrands(brands.map((brand) => brand._id)); // Chọn tất cả
    } else {
      setSelectedBrands([]); // Bỏ chọn tất cả
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
        <TableHeader selectedBrands={selectedBrands} />

        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th className={cx("cb-all")}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
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
              {brands.map((brand, index) => (
                <tr key={index}>
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
                      <div className={cx("icon")}>
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
    </div>
  );
};

export default Table;
