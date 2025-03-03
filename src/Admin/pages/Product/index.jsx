import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../../Admin/components/Header";
import TableHeader from "../../components/TableHeader";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  changeStatusProduct,
  getAllProducts,
} from "../../../services/product.service";
import { getNameBrand } from "../../../services/brand.service";
import { getNameCategory } from "../../../services/category.service";

const cx = classNames.bind(styles);

const Product = () => {
  const [isSelectBrand, setIsSelectBrand] = useState(false);
  const [listProducts, setListProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response) {
        const productsWithBrand = await Promise.all(
          response.map(async (product) => ({
            ...product,
            nameBrand: await getNameBrand(product.brand_id),
            nameCategory: await getNameCategory(product.category_id),
          }))
        );
        setListProducts(productsWithBrand);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectBrand = () => {
    if (isSelectBrand) {
      setIsSelectBrand(false);
    } else {
      setIsSelectBrand(true);
    }
  };

  const handleChangeStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      // Cập nhật trực tiếp danh sách sản phẩm
      setListProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, status: newStatus } : product
        )
      );

      // Gọi API để cập nhật trạng thái trên server
      await changeStatusProduct(id, newStatus);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  return (
    <div className={cx("table")}>
      <Header title="Sản Phẩm" />

      <div className={cx("table-list")}>
        <TableHeader />

        <div className={cx("card")}>
          <div className={cx("tag-filter")} onClick={handleSelectBrand}>
            <LocalOfferIcon fontSize="inherit" />
            <div className={cx("title-tag")}>Thương hiệu</div>
            <KeyboardArrowDownIcon />
          </div>
          {isSelectBrand && (
            <div className={cx("select-tag")}>
              <div className={cx("tag")}>THE FACE SHOP</div>
              <div className={cx("tag")}>THE FACE SHOP</div>
            </div>
          )}

          <div className={cx("tag-filter")}>
            <CategoryIcon fontSize="inherit" />
            <div className={cx("title-tag")}>Danh mục</div>
            <KeyboardArrowDownIcon />
          </div>
          {/* <div className={cx("select-category")}>
            <div className={cx("tag")}>THE FACE SHOP</div>
            <div className={cx("tag")}>THE FACE SHOP</div>
          </div> */}
          <div className={cx("btn-search")}>
            <SearchIcon fontSize="small" />
            Tìm kiếm
          </div>
        </div>
        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th className={cx("no-sort")}>
                  <input type="checkbox" name="" id="" />
                </th>
                <th>Sản phẩm</th>
                <th>Thương hiệu</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Người tạo</th>
                <th>Trạng thái</th>
                <th className={cx("no-sort")}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {listProducts.map((product) => (
                <tr key={product.SKU}>
                  <td>
                    <label className={cx("checkboxs")}>
                      <input type="checkbox" />
                      <span className={cx("checkmarks")}></span>
                    </label>
                  </td>
                  <td>
                    <div className={cx("name-product")}>
                      <span className={cx("d-flex")}>
                        <img src={product.thumbnail[0]} alt={product.name} />
                      </span>
                      <div
                        className={cx("name")}
                        style={{ fontWeight: "600", color: "#495057" }}
                      >
                        {product.title}
                      </div>
                    </div>
                  </td>
                  <td>{product.nameBrand}</td>
                  <td>{product.nameCategory}</td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </td>
                  <td>{product.stock}</td>
                  <td>Đức Huy</td>
                  <td>
                    <span
                      className={cx(
                        "badge",
                        product.status ? "badge-linesuccess" : "badge-linered"
                      )}
                      onClick={() =>
                        handleChangeStatus(product._id, product.status)
                      }
                    >
                      {product.status ? "Hoạt động" : "Không hoạt động"}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Product;
