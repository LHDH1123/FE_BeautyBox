import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Category.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../../Admin/components/Header";
import TableHeader from "../../components/TableHeader";
import {
  deleteCategory,
  getCategorys,
} from "../../../services/category.service";

const cx = classNames.bind(styles);

const Category = () => {
  const [getAllCategory, setGetAllCategory] = useState([]);

  const fetchCategorys = async () => {
    const response = await getCategorys();
    if (response) {
      setGetAllCategory(response);
    }
  };

  useEffect(() => {
    fetchCategorys();
  }, []);

  const handleChangeStatus = async (id, currentStatus) => {
    try {
      console.log(id);
      console.log(currentStatus);
      // const newStatus = !currentStatus;
      // setBrands((prevBrands) =>
      //   prevBrands.map((brand) =>
      //     brand._id === id ? { ...brand, status: newStatus } : brand
      //   )
      // );
      // await changeStatus(id, newStatus);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này không?")) return;
    try {
      await deleteCategory(id);
      setGetAllCategory((prevBrands) =>
        prevBrands.filter((brand) => brand._id !== id)
      );
    } catch (error) {
      console.error("Lỗi khi xóa thương hiệu:", error);
    }
  };

  return (
    <div className={cx("table")}>
      <Header title="Danh mục" fetchCategorys={fetchCategorys} />

      <div className={cx("table-list")}>
        <TableHeader />

        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th className={cx("no-sort")}>
                  <input type="checkbox" name="" id="" />
                </th>
                <th>Danh mục</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th className={cx("no-sort")}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {getAllCategory.map((category) => (
                <tr key={category._id}>
                  <td>
                    <label className={cx("checkboxs")}>
                      <input type="checkbox" />
                      <span className={cx("checkmarks")}></span>
                    </label>
                  </td>
                  <td style={{ fontWeight: "600" }}>{category.title}</td>
                  <td>
                    {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <span
                      className={cx(
                        "badge",
                        category.status ? "badge-linesuccess" : "badge-linered"
                      )}
                      onClick={() =>
                        handleChangeStatus(category._id, category.status)
                      }
                    >
                      {category.status ? "Hoạt động" : "Không hoạt động"}
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
                        onClick={() => handleDeleteCategory(category._id)}
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

export default Category;
