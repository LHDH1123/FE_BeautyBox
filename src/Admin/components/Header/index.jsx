import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, DialogActions, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Header = ({ title }) => {
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalAddBrand, setIsModalAddBrand] = useState(false);
  const navigate = useNavigate();

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const handleCloseModalAdd = () => {
    if (title === "Danh mục") {
      if (isModalAdd === true) {
        setIsModalAdd(false);
      } else {
        setIsModalAdd(true);
      }
    }

    if (title === "Thương Hiệu") {
      if (isModalAddBrand === true) {
        setIsModalAddBrand(false);
      } else {
        setIsModalAddBrand(true);
      }
    }

    if (title === "Sản Phẩm") {
      navigate("/adminbb/create-product");
    }
  };

  return (
    <div className={cx("header")}>
      <div className={cx("title-header")}>
        <div className={cx("title")}>
          <div className={cx("title-page")}>{title}</div>
          <div className={cx("title-desc")}>Quản Lý {title} Của Bạn</div>
        </div>
      </div>
      <div className={cx("btn-add")} onClick={handleCloseModalAdd}>
        <AddCircleOutlineIcon />
        <button>
          {title === "Vai Trò & Quyền" ? "Thêm Vai Trò" : `Thêm ${title}`}
        </button>
      </div>

      {/* Add Category */}
      <Dialog
        open={isModalAdd} // Ensure this is boolean
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px", // Dịch lên trên 40px
            borderRadius: "16px", // Bo góc 16px
            height: "300px",
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
            <div className={cx("title")}>Tạo danh mục</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Danh mục cha</div>
              <input type="text" className={cx("input")} />
            </div>
            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch {...label} defaultChecked />
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
              <button type="submit" className={cx("btn-submit")}>
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add brand */}
      <Dialog
        open={isModalAddBrand} // Ensure this is boolean
        onClose={handleCloseModalAdd}
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
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalAdd}>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>

          <div className={cx("modalContent")}>
            <div className={cx("title")}>Tạo thương hiệu</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Thương hiệu</div>
              <input type="text" className={cx("input")} />
            </div>
            <div
              className={cx("formGroup")}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div>
                <div className={cx("label")}>Logo</div>
                <div className={cx("input-blocks")}>
                  <AddCircleOutlineIcon
                    fontSize="inherit"
                    style={{ color: "#ff9f43" }}
                  />
                  <div className={cx("title-img")}>Thêm hình ảnh</div>
                </div>
              </div>
              <button type="submit" className={cx("btn-change")}>
                Thay đổi ảnh
              </button>
            </div>
            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch {...label} defaultChecked />
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
              <button type="submit" className={cx("btn-submit")}>
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default Header;
