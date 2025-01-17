import React from "react";
import classNames from "classnames/bind";
import styles from "./Category.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../../Admin/components/Header";
import TableHeader from "../../components/TableHeader";

const cx = classNames.bind(styles);

const Category = () => {
  return (
    <div className={cx("table")}>
      <Header title="Danh mục" />

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
              <tr>
                <td>
                  <label className={cx("checkboxs")}>
                    <input type="checkbox" />
                    <span className={cx("checkmarks")}></span>
                  </label>
                </td>
                <td>Trang điểm</td>
                <td>12/04/2022</td>
                <td>
                  <span className={cx("badge", "badge-linesuccess")}>
                    Hoạt động
                  </span>
                </td>
                <td className={cx("action-table-data")}>
                  <div className={cx("edit-delete-action")}>
                    <div className={cx("icon")}>
                      <ModeEditOutlineOutlinedIcon
                        style={{ color: "#3577f1" }}
                      />
                    </div>
                    <div className={cx("icon")}>
                      <DeleteOutlineOutlinedIcon style={{ color: "red" }} />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className={cx("checkboxs")}>
                    <input type="checkbox" />
                    <span className={cx("checkmarks")}></span>
                  </label>
                </td>
                <td>Trang điểm</td>
                <td>12/04/2022</td>
                <td>
                  <span className={cx("badge", "badge-linesuccess")}>
                    Hoạt động
                  </span>
                </td>
                <td className={cx("action-table-data")}>
                  <div className={cx("edit-delete-action")}>
                    <div className={cx("icon")}>
                      <ModeEditOutlineOutlinedIcon
                        style={{ color: "#3577f1" }}
                      />
                    </div>
                    <div className={cx("icon")}>
                      <DeleteOutlineOutlinedIcon style={{ color: "red" }} />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Category;
