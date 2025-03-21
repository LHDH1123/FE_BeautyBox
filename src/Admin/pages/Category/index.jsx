import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Category.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../../Admin/components/Header";
import TableHeader from "../../components/TableHeader";
import {
  changeStatus,
  deleteCategory,
  getCategorys,
  getDetail,
  updateCategory,
} from "../../../services/category.service";
import { Box, Dialog, DialogActions, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createCategorySelect } from "../../../helper/select-tree";

const cx = classNames.bind(styles);

const Category = () => {
  const [getAllCategory, setGetAllCategory] = useState([]);
  const [selectCategory, setSelectAllCategory] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCategorys, setSelectedCategorys] = useState([]);

  const [isModalAdd, setIsModalAdd] = useState(false);
  const [editCategory, setEditCategory] = useState({
    title: "",
    parent_id: "",
    status: false,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategorys = async () => {
    const response = await getCategorys();
    if (response) {
      setGetAllCategory(buildCategoryHierarchy(response));
      setSelectAllCategory(response);
    }
  };

  useEffect(() => {
    fetchCategorys();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCategoryStatus = (categories, id, newStatus) => {
    return categories.map((category) => {
      // Nếu đây là danh mục cần cập nhật, thay đổi trạng thái
      if (category._id === id) {
        return {
          ...category,
          status: newStatus,
          children: category.children
            ? updateCategoryStatus(category.children, id, newStatus)
            : [],
        };
      }

      // Nếu không, tìm trong danh mục con
      return {
        ...category,
        children: category.children
          ? updateCategoryStatus(category.children, id, newStatus)
          : [],
      };
    });
  };

  const handleChangeStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await changeStatus(id, newStatus);
      if (response) {
        setGetAllCategory((prevCategories) =>
          updateCategoryStatus(prevCategories, id, newStatus)
        );
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này không?")) return;
    try {
      await deleteCategory(id);
      await fetchCategorys();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  const getAllCategoryIds = (categories) => {
    let ids = [];
    categories.forEach((category) => {
      ids.push(category._id);
      if (category.children && category.children.length > 0) {
        ids = ids.concat(getAllCategoryIds(category.children)); // Lấy ID danh mục con
      }
    });
    return ids;
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const allIds = getAllCategoryIds(getAllCategory); // Lấy tất cả ID danh mục (bao gồm con)
      setSelectedCategorys(allIds);
    } else {
      setSelectedCategorys([]); // Bỏ chọn tất cả
    }
  };

  const handleSelectOne = (id) => {
    setSelectedCategorys((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((brandId) => brandId !== id)
        : [...prevSelected, id]
    );
  };

  const handleCloseModal = () => {
    setIsModalAdd(!isModalAdd);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEditCategory((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      return newState;
    });
  };

  const handleSwitchChange = () => {
    setEditCategory((prev) => ({
      ...prev,
      status: !prev.status, // Đảo trạng thái thay vì lấy trực tiếp từ sự kiện
    }));
  };

  const handleOpenModal = async (id) => {
    setIsModalAdd(true);
    const getCategory = await getDetail(id);
    setEditCategory(getCategory);
  };

  const handleUpdate = async () => {
    if (editCategory) {
      try {
        await updateCategory(editCategory._id, editCategory);
        fetchCategorys();
        setIsModalAdd(false);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  const filteredCategorys = getAllCategory.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchCategory = (event) => {
    setSearchQuery(event.target.value);
  };

  const buildCategoryHierarchy = (categories) => {
    const categoryMap = {};
    const tree = [];

    // Khởi tạo mỗi danh mục trong categoryMap
    categories.forEach((category) => {
      categoryMap[category._id] = { ...category, children: [] };
    });

    // Xây dựng cấu trúc cây
    categories.forEach((category) => {
      if (category.parent_id && categoryMap[category.parent_id]) {
        categoryMap[category.parent_id].children.push(
          categoryMap[category._id]
        );
      } else {
        tree.push(categoryMap[category._id]);
      }
    });

    return tree;
  };

  const renderCategoryRows = (categories, level = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category._id}>
        <tr>
          <td>
            <label className={cx("checkboxs")}>
              <input
                type="checkbox"
                checked={selectedCategorys.includes(category._id)}
                onChange={() => handleSelectOne(category._id)}
              />
              <span className={cx("checkmarks")}></span>
            </label>
          </td>
          <td style={{ color: "#495057", fontWeight: "600" }}>
            {"--".repeat(level)} {category.title}
          </td>
          <td>{new Date(category.createdAt).toLocaleDateString("vi-VN")}</td>
          <td>
            <span
              className={cx(
                "badge",
                category.status ? "badge-linesuccess" : "badge-linered"
              )}
              onClick={() => handleChangeStatus(category._id, category.status)}
            >
              {category.status ? "Hoạt động" : "Không hoạt động"}
            </span>
          </td>
          <td className={cx("action-table-data")}>
            <div className={cx("edit-delete-action")}>
              <div
                className={cx("icon")}
                onClick={() => handleOpenModal(category._id)}
              >
                <ModeEditOutlineOutlinedIcon style={{ color: "#3577f1" }} />
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
        {category.children.length > 0 &&
          renderCategoryRows(category.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className={cx("table")}>
      <Header title="Danh mục" fetchCategorys={fetchCategorys} />
      <div className={cx("table-list")}>
        <TableHeader
          selectedCategorys={selectedCategorys}
          fetchCategorys={fetchCategorys}
          handleSearchCategory={handleSearchCategory}
        />
        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th className={cx("no-sort")}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Danh mục</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th className={cx("no-sort")}>Hành động</th>
              </tr>
            </thead>
            <tbody>{renderCategoryRows(filteredCategorys)}</tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={isModalAdd}
        onClose={handleCloseModal}
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
              <button onClick={handleCloseModal}>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>
          <div className={cx("modalContent")}>
            <div className={cx("title")}>Chỉnh sửa danh mục</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Tên danh mục</div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={editCategory.title}
                onChange={handleInputChange}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Danh mục cha</div>
              <select
                id="parent_id"
                name="parent_id"
                className={cx("input")}
                value={editCategory.parent_id} // Thêm dòng này để hiển thị giá trị đã chọn
                onChange={handleInputChange}
              >
                <option value="">Chọn danh mục cha</option>
                {createCategorySelect(selectCategory)}
              </select>
            </div>
            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  name="status"
                  color="warning"
                  checked={editCategory.status}
                  onClick={handleSwitchChange}
                />
              </div>
            </div>
            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleUpdate}
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

export default Category;
