import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Create.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { createCategorySelect } from "../../../helper/select-tree";
import { getCategorys } from "../../../services/category.service";
import { getBrands } from "../../../services/brand.service";
import { TextField } from "@mui/material";
import {
  addProduct,
  getDetailProduct,
  updateProduct,
} from "../../../services/product.service";

const cx = classNames.bind(styles);

const Create = ({ title, productId }) => {
  const [isInfo, setIsInfo] = useState(true);
  const [isImg, setIsImg] = useState(true);
  const [isPrice, setIsPrice] = useState(true);
  const [isActive, setIsActive] = useState(true); // Trạng thái ban đầu là "Hoạt động"
  const navigate = useNavigate();
  const [getAllCategory, setGetAllCategory] = useState([]);
  const [getAllBrand, setGetAllBrand] = useState([]);
  const [product, setProduct] = useState({
    title: "",
    SKU: "",
    category_id: "",
    brand_id: "",
    status: true,
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    thumbnail: [],
    position: "",
  });
  const [images, setImages] = useState([]);
  const [divImages, setDivImages] = useState([]);
  const [divEditImages, setDivEditImages] = useState([]);

  const [editProduct, setEditProduct] = useState({
    title: "",
    SKU: "",
    category_id: "",
    brand_id: "",
    status: true,
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    thumbnail: [],
    position: "",
  });

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

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

  const handleProduct = () => {
    navigate("/adminbb/product-list");
  };

  const fetchBrands = async () => {
    const response = await getBrands();
    if (response) {
      setGetAllBrand(response);
    }
  };

  const fetchCategorys = async () => {
    const response = await getCategorys();
    if (response) {
      setGetAllCategory(response);
    }
  };

  useEffect(() => {
    fetchCategorys();
    fetchBrands();
    if (title === "Chỉnh sửa sản phẩm") {
      fetchProducts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (title === "Chỉnh sửa sản phẩm") {
      setEditProduct((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? String(value) || 0
            : files
            ? Array.from(files)
            : value,
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? String(value) || 0
            : files
            ? Array.from(files)
            : value,
      }));
    }
  };

  const handleAdd = async () => {
    if (title === "Chỉnh sửa sản phẩm") {
      const formData = new FormData();
      formData.append("title", editProduct.title);
      formData.append("category_id", editProduct.category_id);
      formData.append("brand_id", editProduct.brand_id);
      formData.append("status", editProduct.status);
      formData.append("description", editProduct.description);
      formData.append("price", editProduct.price);
      formData.append("discountPercentage", editProduct.discountPercentage);
      formData.append("stock", editProduct.stock);
      formData.append("position", editProduct.position);

      // Thêm ảnh mới (File)
      divEditImages.forEach((file) => {
        formData.append("thumbnail", file);
      });

      try {
        const response = await updateProduct(editProduct._id, formData);
        if (response) {
          console.log("Chỉnh sửa sản phẩm thành công!", response);
          navigate("/adminbb/product-list");

          setProduct({
            title: "",
            SKU: "",
            category_id: "",
            brand_id: "",
            status: true,
            description: "",
            price: "",
            discountPercentage: "",
            stock: "",
            thumbnail: [],
            position: "",
          });
        }
      } catch (error) {
        console.error("❌ Lỗi:", error);
      }
    } else {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("SKU", product.SKU);
      formData.append("category_id", product.category_id);
      formData.append("brand_id", product.brand_id);
      formData.append("status", isActive);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("discountPercentage", product.discountPercentage);
      formData.append("stock", product.stock);
      formData.append("position", product.position);

      // **Thêm tất cả file ảnh vào FormData**
      if (images.length === 1) {
        formData.append("thumbnail", images[0]); // Nếu chỉ có 1 ảnh, upload trực tiếp
      } else {
        images.forEach((file) => {
          formData.append("thumbnail", file); // Nếu có nhiều ảnh, duyệt và thêm từng ảnh vào
        });
      }

      console.log(images[0]);

      try {
        const response = await addProduct(formData);
        if (response) {
          console.log("✅ Thêm sản phẩm thành công!", response);
          navigate("/adminbb/product-list");

          setProduct({
            title: "",
            SKU: "",
            category_id: "",
            brand_id: "",
            status: true,
            description: "",
            price: "",
            discountPercentage: "",
            stock: "",
            thumbnail: [],
            position: "",
          });
        }
      } catch (error) {
        console.error("❌ Lỗi:", error);
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setImages(selectedFiles);
    const fileURLs = selectedFiles.map((file) => URL.createObjectURL(file)); // Tạo URL tạm
    setDivImages((prev) => [...prev, ...fileURLs]);
    setDivEditImages((prev) => [...prev, ...selectedFiles]);
  };

  // Xoá ảnh khỏi danh sách
  const handleRemoveImage = (index) => {
    setDivImages((prev) => prev.filter((_, i) => i !== index));
    setDivEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchProducts = async () => {
    const response = await getDetailProduct(productId);
    if (response) {
      setEditProduct(response[0]);
      setDivImages(response[0].thumbnail);
      setDivEditImages(response[0].thumbnail);
    }
  };

  useEffect(() => {
    if (editProduct?.status !== undefined) {
      setIsActive(editProduct.status);
    }
  }, [editProduct]);

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
        <div className={cx("btn-add")} onClick={handleProduct}>
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
                  <input
                    type="text"
                    name="title"
                    className={cx("form-control")}
                    value={
                      title === "Chỉnh sửa sản phẩm"
                        ? editProduct?.title || ""
                        : product?.title || ""
                    }
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>SKU </div>
                  <input
                    type="text"
                    name="SKU"
                    className={cx("form-control")}
                    value={
                      title === "Chỉnh sửa sản phẩm"
                        ? editProduct?.SKU || ""
                        : product?.SKU || ""
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={cx("info")}>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Thương hiệu </div>
                  <select
                    name="brand_id"
                    className={cx("form-select")}
                    value={
                      title === "Chỉnh sửa sản phẩm"
                        ? editProduct?.brand_id || ""
                        : product?.brand_id || ""
                    }
                    onChange={handleChange}
                  >
                    <option value="">Chọn thương hiệu</option>
                    {getAllBrand.map((brand) => (
                      <option key={brand.name} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Danh mục</div>
                  <select
                    name="category_id"
                    className={cx("form-select")}
                    value={
                      title === "Chỉnh sửa sản phẩm"
                        ? editProduct?.category_id || ""
                        : product?.category_id || ""
                    }
                    onChange={handleChange}
                  >
                    <option value="">Chọn danh mục</option>
                    {createCategorySelect(getAllCategory)}
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
                        value={editProduct.status}
                        // value={
                        //   title === "Chỉnh sửa sản phẩm"
                        //     ? editProduct?.SKU || ""
                        //     : product?.SKU || ""
                        // }
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
                        value={editProduct.status}
                        onChange={() => handleStatusChange(false)}
                      />
                      <div className={cx("title-checkbox")}>
                        Không hoạt động
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Vị trí</div>
                  <div>
                    <TextField
                      type="number"
                      name="position"
                      className={cx("quantity-control")}
                      variant="outlined"
                      size="small"
                      sx={{ width: 80, height: 32 }} // Giảm chiều cao và padding
                      value={
                        title === "Chỉnh sửa sản phẩm"
                          ? editProduct?.position || ""
                          : product?.position || ""
                      }
                      onChange={handleChange}
                      InputProps={{
                        inputProps: {
                          min: 0,
                          style: {
                            textAlign: "left",
                            height: "24px",
                            padding: "4px",
                            paddingLeft: "16px",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={cx("description")}>
                <div className={cx("title-item")}>Mô tả</div>
                <input
                  type="text"
                  maxLength="60"
                  name="description"
                  value={
                    title === "Chỉnh sửa sản phẩm"
                      ? editProduct?.description || ""
                      : product?.description || ""
                  }
                  onChange={handleChange}
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
              <div
                className={cx("input-blocks")}
                onClick={handleClick}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AddCircleOutlineIcon
                  fontSize="inherit"
                  style={{ color: "#ff9f43" }}
                />
                <div className={cx("title-img")}>Thêm hình ảnh</div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              {divImages.map((img, index) => (
                <div key={index} className={cx("img-upload")}>
                  <img src={img} alt={`upload-${index}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)} // Truyền index vào hàm
                    className={cx("remove-btn")}
                  >
                    <CancelIcon fontSize="inherit" style={{ color: "red" }} />
                  </button>
                </div>
              ))}
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
                  <input
                    type="text"
                    name="price"
                    className={cx("form-control")}
                    value={
                      title === "Chỉnh sửa sản phẩm"
                        ? editProduct?.price || ""
                        : product?.price || ""
                    }
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>% Giảm giá </div>
                  <input
                    type="text"
                    name="discountPercentage"
                    className={cx("form-control")}
                    value={
                      title === "Chỉnh sửa sản phẩm"
                        ? editProduct?.discountPercentage || ""
                        : product?.discountPercentage || ""
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={cx("info")}>
                <div className={cx("info-item")}>
                  <div className={cx("title-item")}>Số lượng</div>
                  <input
                    type="text"
                    name="stock"
                    className={cx("form-control")}
                    value={
                      title === "Chỉnh sửa sản phẩm"
                        ? editProduct?.stock || ""
                        : product?.stock || ""
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={cx("btn-addproduct")}>
        <button
          type="button"
          className={cx("btn-cancel")}
          onClick={handleProduct}
        >
          Hủy
        </button>
        <button type="submit" className={cx("btn-submit")} onClick={handleAdd}>
          Lưu sản phẩm
        </button>
      </div>
    </div>
  );
};

export default Create;
