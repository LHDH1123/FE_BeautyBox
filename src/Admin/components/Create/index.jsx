import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Create.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import img from "../../../assets/images/product.webp";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const cx = classNames.bind(styles);

const Create = ({ title }) => {
  const [isInfo, setIsInfo] = useState(true);
  const [isImg, setIsImg] = useState(true);
  const [isPrice, setIsPrice] = useState(true);
  const [isActive, setIsActive] = useState(true); // Trạng thái ban đầu là "Hoạt động"

  const handleStatusChange = (status) => {
    setIsActive(status); // Cập nhật trạng thái khi chọn
  };

  const handleInfo = () => {
    if (!isInfo) {
      setIsInfo(true);
    } else {
      setIsInfo(false);
    }
  };

  const handleImg = () => {
    if (!isImg) {
      setIsImg(true);
    } else {
      setIsImg(false);
    }
  };

  const handlePrice = () => {
    if (!isPrice) {
      setIsPrice(true);
    } else {
      setIsPrice(false);
    }
  };

  return (
    <div className={cx("create")}>
      <div className={cx("header")}>
        <div className={cx("title-header")}>
          <div className={cx("title")}>
            {title === "Sản phẩm mới" ? (
              <div>
                <div className={cx("title-page")}>Sản phẩm mới</div>
                <div className={cx("title-desc")}>Tạo sản phẩm mới</div>
              </div>
            ) : (
              <div className={cx("title-page")}>{title}</div>
            )}
          </div>
        </div>
        <div className={cx("btn-add")}>
          <ArrowBackIcon fontSize="inherit" />
          <button>Quay lại sản phẩm</button>
        </div>
      </div>

      <div className={cx("content")}>
        <div className={cx("card-content")}>
          <div className={cx("header-content")} onClick={handleInfo}>
            <InfoIcon
              fontSize="inherit"
              style={{ color: "#ff9f43", marginTop: "3px" }}
            />
            <div className={cx("title-header")}>Thông tin sản phẩm</div>
            <div className={cx("icon")}>
              {isInfo === true ? (
                <KeyboardArrowUpIcon style={{ color: "#ff9f43" }} />
              ) : (
                <KeyboardArrowDownIcon style={{ color: "#ff9f43" }} />
              )}
            </div>
          </div>
          {isInfo && (
            <div className={cx("info-content")}>
              <div className={cx("info")}>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Tên sản phẩm</div>
                  <input type="text" className={cx("form-control")} />
                </div>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>SKU </div>
                  <input type="text" className={cx("form-control")} />
                </div>
              </div>

              <div className={cx("info")}>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Danh mục</div>
                  <select className={cx("form-control")}>
                    <option value="">Chọn</option>
                    <option value="electronics">Điện tử</option>
                    <option value="fashion">Thời trang</option>
                    <option value="grocery">Hàng tiêu dùng</option>
                  </select>
                </div>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Thương hiệu </div>
                  <select className={cx("form-control")}>
                    <option value="">Chọn</option>
                    <option value="electronics">Điện tử</option>
                    <option value="fashion">Thời trang</option>
                    <option value="grocery">Hàng tiêu dùng</option>
                  </select>
                </div>
              </div>

              <div className={cx("info")}>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Trạng thái</div>
                  <div className={cx("checkbox-input")}>
                    <div className={cx("input-status")}>
                      <input
                        type="radio"
                        className={cx("checkbox")}
                        id="active"
                        name="status"
                        checked={isActive}
                        onChange={() => handleStatusChange(true)}
                      />
                      <div className={cx("title-checkbox")}>Hoạt động</div>
                    </div>
                    <div className={cx("input-status")}>
                      <input
                        type="radio"
                        className={cx("checkbox")}
                        id="inactive"
                        name="status"
                        checked={!isActive}
                        onChange={() => handleStatusChange(false)}
                      />
                      <div className={cx("title-checkbox")}>
                        Không hoạt động
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cx("description")}>
                <div className={cx("title-item")}>Mô tả</div>
                <input
                  type="text"
                  maxLength="60"
                  className={cx("desc-input")}
                />
                <div className={cx("title-length")}>Tối đa 60 kí tự</div>
              </div>
            </div>
          )}
        </div>

        <div className={cx("card-content")}>
          <div className={cx("header-content")} onClick={handleImg}>
            <ImageIcon
              fontSize="inherit"
              style={{ color: "#ff9f43", marginTop: "3px" }}
            />
            <div className={cx("title-header")}>Hình ảnh</div>
            <div className={cx("icon")}>
              {isImg === true ? (
                <KeyboardArrowUpIcon style={{ color: "#ff9f43" }} />
              ) : (
                <KeyboardArrowDownIcon style={{ color: "#ff9f43" }} />
              )}
            </div>
          </div>
          {isImg && (
            <div className={cx("info-image")}>
              <div className={cx("input-blocks")}>
                <AddCircleOutlineIcon
                  fontSize="inherit"
                  style={{ color: "#ff9f43" }}
                />
                <div className={cx("title-img")}>Thêm hình ảnh</div>
              </div>
              <div className={cx("img-upload")}>
                <img src={img} alt="" />
                <a href="/">
                  <CancelIcon fontSize="inherit" style={{ color: "red" }} />
                </a>
              </div>
              <div className={cx("img-upload")}>
                <img src={img} alt="" />
                <a href="/">
                  <CancelIcon fontSize="inherit" style={{ color: "red" }} />
                </a>
              </div>
            </div>
          )}
        </div>

        <div className={cx("card-content")}>
          <div className={cx("header-content")} onClick={handlePrice}>
            <MonetizationOnIcon
              fontSize="inherit"
              style={{ color: "#ff9f43", marginTop: "3px" }}
            />
            <div className={cx("title-header")}>Giá cả</div>
            <div className={cx("icon")}>
              {isPrice === true ? (
                <KeyboardArrowUpIcon style={{ color: "#ff9f43" }} />
              ) : (
                <KeyboardArrowDownIcon style={{ color: "#ff9f43" }} />
              )}
            </div>
          </div>
          {isPrice && (
            <div className={cx("info-content")}>
              <div className={cx("info")}>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Giá sản phẩm</div>
                  <input type="text" className={cx("form-control")} />
                </div>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>% Giảm giá </div>
                  <input type="text" className={cx("form-control")} />
                </div>
              </div>

              <div className={cx("info")}>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Số lượng</div>
                  <input type="text" className={cx("form-control")} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={cx("btn-addproduct")}>
        <button type="button" className={cx("btn-cancel")}>
          Hủy
        </button>
        <button type="submit" className={cx("btn-submit")}>
          Lưu sản phẩm
        </button>
      </div>
    </div>
  );
};

export default Create;
