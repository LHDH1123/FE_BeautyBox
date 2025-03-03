import React, { useEffect, useRef, useState } from "react";
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
  deleteProduct,
  getAllProducts,
} from "../../../services/product.service";
import { getBrands, getNameBrand } from "../../../services/brand.service";
import {
  getCategorys,
  getNameCategory,
} from "../../../services/category.service";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Product = () => {
  const [isSelectBrand, setIsSelectBrand] = useState(false);
  const [isSelectCategory, setIsSelectCategory] = useState(false);
  const [listProducts, setListProducts] = useState([]);
  const navigate = useNavigate();
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listBrands, setListBrands] = useState([]);
  const [listCategorys, setListCategorys] = useState([]);

  const handleSelectAll = () => {
    const newCheckedState = !isAllChecked;
    setIsAllChecked(newCheckedState);

    if (newCheckedState) {
      setSelectedProducts(listProducts.map((product) => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id)
        : [...prevSelected, id]
    );
  };

  // Cập nhật trạng thái của checkbox tổng dựa trên selectedProducts
  useEffect(() => {
    setIsAllChecked(
      selectedProducts.length === listProducts.length && listProducts.length > 0
    );
  }, [selectedProducts, listProducts]);

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

  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      if (response) {
        const filterListBrand = await Promise.all(
          response.map(async (brand) => ({
            id: brand._id,
            name: brand.name,
          }))
        );
        setListBrands(filterListBrand);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategorys = async () => {
    try {
      const response = await getCategorys();
      if (response) {
        const filterListCategory = await Promise.all(
          response.map(async (category) => ({
            id: category._id,
            name: category.title,
          }))
        );
        setListCategorys(filterListCategory);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };
  console.log(listCategorys);
  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategorys();
  }, []);

  const dropdownBrandRef = useRef(null);

  const handleSelectBrand = () => {
    setIsSelectBrand((prev) => !prev);
  };

  const handleSelectCategory = () => {
    if (isSelectCategory) {
      setIsSelectCategory(false);
    } else {
      setIsSelectCategory(true);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;

    try {
      console.log(id);
      const response = await deleteProduct(id);
      if (response) {
        const updatedProducts = listProducts.filter(
          (brand) => brand._id !== id
        );
        setListProducts(updatedProducts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleForwardEdit = (id) => {
    navigate(`/adminbb/edit-product/${id}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = listProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cx("table")}>
      <Header title="Sản Phẩm" />

      <div className={cx("table-list")}>
        <TableHeader
          selectedProducts={selectedProducts}
          fetchProducts={fetchProducts}
          handleSearchChangeProduct={handleSearchChange}
        />

        <div className={cx("card")}>
          <div className={cx("tag-filter")} onClick={handleSelectBrand}>
            <LocalOfferIcon fontSize="inherit" />
            <div className={cx("title-tag")}>Thương hiệu</div>
            <KeyboardArrowDownIcon />
          </div>
          {isSelectBrand && (
            <div className={cx("select-tag")} ref={dropdownBrandRef}>
              {listBrands.map((brand) => (
                <div className={cx("tag")} key={brand.id}>
                  {brand.name}
                </div>
              ))}
            </div>
          )}

          <div className={cx("tag-filter")} onClick={handleSelectCategory}>
            <CategoryIcon fontSize="inherit" />
            <div className={cx("title-tag")}>Danh mục</div>
            <KeyboardArrowDownIcon />
          </div>
          {isSelectCategory && (
            <div className={cx("select-tag")} style={{ marginLeft: "165px" }}>
              {listCategorys.map((category) => (
                <div className={cx("tag")} key={category.id}>
                  {category.name}
                </div>
              ))}
            </div>
          )}
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
                  <input
                    type="checkbox"
                    className={cx("cb_all")}
                    checked={isAllChecked}
                    onChange={handleSelectAll}
                  />
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
              {filteredProducts.map((product) => (
                <tr key={product.SKU} style={{ marginLeft: "4px" }}>
                  <td>
                    <label className={cx("checkboxs")}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleCheckboxChange(product._id)}
                      />
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
                      <div
                        className={cx("icon")}
                        onClick={() => handleForwardEdit(product._id)}
                      >
                        <ModeEditOutlineOutlinedIcon
                          style={{ color: "#3577f1" }}
                        />
                      </div>
                      <div className={cx("icon")}>
                        <DeleteOutlineOutlinedIcon
                          style={{ color: "red" }}
                          onClick={() => handleDelete(product._id)}
                        />
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
