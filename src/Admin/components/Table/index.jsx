import React from "react";
import classNames from "classnames/bind";
import styles from "./Table.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import loggo from "../../../assets/images/ch1.webp";
import Header from "../Header";
import TableHeader from "../TableHeader";
const cx = classNames.bind(styles);

const Table = () => {
  return (
    <div className={cx("table")}>
      <Header title="Thương hiệu" />

      <div className={cx("table-list")}>
        <TableHeader /> 

        <div className={cx("card")}>
          <h1>card</h1>
        </div>
        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th className={cx("no-sort")}>
                  <input type="checkbox" name="" id="" />
                </th>
                <th>Thương hiệu</th>
                <th>Logo</th>
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
                <td>Lenevo</td>
                <td>
                  <span className={cx("d-flex")}>
                    <img src={loggo} alt="" />
                  </span>
                </td>
                <td>25 May 2023</td>
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
                <td>Boat</td>
                <td>
                  <span className={cx("d-flex")}>
                    <img src={loggo} alt="" />
                  </span>
                </td>
                <td>24 Jun 2023</td>
                <td>
                  <span className={cx("badge", "badge-linesuccess")}>
                    Active
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

export default Table;
