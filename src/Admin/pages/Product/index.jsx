import React from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import loggo from "../../../assets/images/ch1.webp";
import Header from "../../../Admin/components/Header";
import TableHeader from "../../components/TableHeader";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const cx = classNames.bind(styles);

const Product = () => {
  return (
    <div className={cx("table")}>
      <Header title="Sản Phẩm" />

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
                <th>Sản phẩm</th>
                <th>SKU</th>
                <th>Danh mục</th>
                <th>Thương hiệu</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Người tạo</th>
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
                <td>
                  <div className={cx("name-product")}>
                    <span className={cx("d-flex")}>
                      <img src={loggo} alt="" />
                    </span>
                    <div className={cx("name")}>Lenovo</div>
                  </div>
                </td>
                <td>11202111</td>
                <td>Trang điểm</td>
                <td>The face shop</td>
                <td>1.000.000đ</td>
                <td>20</td>
                <td>Đức Huy</td>
                <td>
                  <span className={cx("badge", "badge-linesuccess")}>
                    Hoạt động
                  </span>
                </td>
                <td className={cx("action-table-data")}>
                  <div className={cx("edit-delete-action")}>
                    <div className={cx("icon")}>
                      <RemoveRedEyeOutlinedIcon />
                    </div>
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
                <td>
                  <div className={cx("name-product")}>
                    <span className={cx("d-flex")}>
                      <img src={loggo} alt="" />
                    </span>
                    <div className={cx("name")}>Boat</div>
                  </div>
                </td>
                <td>11202111</td>
                <td>Kẻ mắt</td>
                <td>The face shop</td>
                <td>1.000.000đ</td>
                <td>20</td>
                <td>Đức Huy</td>
                <td>
                  <span className={cx("badge", "badge-linesuccess")}>
                    Active
                  </span>
                </td>
                <td className={cx("action-table-data")}>
                  <div className={cx("edit-delete-action")}>
                    <div className={cx("icon")}>
                      <RemoveRedEyeOutlinedIcon />
                    </div>
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

export default Product;
