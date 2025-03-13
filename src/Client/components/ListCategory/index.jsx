import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListCategory.module.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import { getAllProducts } from "../../../services/product.service";
import { getCategorys } from "../../../services/category.service";
import { getNameBrand } from "../../../services/brand.service";

const cx = classNames.bind(styles);

function ListCategory({ id, brandId, onTotalChange }) {
  const scrollableRef = useRef(null);
  const [favoritedItems, setFavoritedItems] = useState([]);
  const [listProduct, setListProduct] = useState([]);

  const handleClickTym = (index) => {
    setFavoritedItems((prev) => {
      const updatedFavoritedItems = [...prev];
      updatedFavoritedItems[index] = !updatedFavoritedItems[index];
      return updatedFavoritedItems;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API song song
        const [allCategories, allProducts] = await Promise.all([
          getCategorys(),
          getAllProducts(),
        ]);

        if (!allCategories || !allProducts) return;

        // Dùng Map để truy vấn danh mục con nhanh hơn
        const categoryMap = new Map();
        allCategories.forEach((cat) => {
          categoryMap.set(cat._id, cat.parent_id);
        });

        // Lấy tất cả danh mục con của `id`
        const categorySet = new Set();
        const findCategories = (categoryId) => {
          if (!categorySet.has(categoryId)) {
            categorySet.add(categoryId);
            allCategories.forEach((cat) => {
              if (cat.parent_id === categoryId) {
                findCategories(cat._id);
              }
            });
          }
        };
        findCategories(id);

        // Lọc sản phẩm theo danh mục trước
        // let filteredProducts = allProducts.filter((product) =>
        //   categorySet.has(product.category_id)
        // );
        let filteredProducts = [];
        // Nếu có brandId, lọc theo thương hiệu
        if (brandId) {
          filteredProducts = allProducts.filter(
            (product) => product.brand_id === brandId
          );
        } else {
          filteredProducts = allProducts.filter((product) =>
            categorySet.has(product.category_id)
          );
        }

        // Tạo danh sách brand_id duy nhất
        const brandIds = [...new Set(filteredProducts.map((p) => p.brand_id))];

        // Gọi API lấy tên thương hiệu một lần cho tất cả brand_id
        const brandNames = await Promise.all(
          brandIds.map(async (brandId) => ({
            brandId,
            nameBrand: await getNameBrand(brandId),
          }))
        );

        // Tạo Map để tra cứu nhanh
        const brandMap = new Map();
        brandNames.forEach(({ brandId, nameBrand }) => {
          brandMap.set(brandId, nameBrand);
        });

        // Gán tên thương hiệu vào sản phẩm
        const productsWithBrandNames = filteredProducts.map((product) => ({
          ...product,
          nameBrand: brandMap.get(product.brand_id),
        }));

        setListProduct(productsWithBrandNames);
        onTotalChange(productsWithBrandNames.length);
        setFavoritedItems(Array(productsWithBrandNames.length).fill(false));
      } catch (error) {
        console.error("Error fetching categories or products:", error);
      }
    };

    fetchData();
  }, [id, brandId, onTotalChange]);

  return (
    <div className={cx("list")}>
      <div className={cx("scroll-list")}>
        <div className={cx("list_product")} ref={scrollableRef}>
          {listProduct.map((product, index) => (
            <div key={product._id} className={cx("product")}>
              <div className={cx("productList-img")}>
                <img
                  src={
                    Array.isArray(product.thumbnail) &&
                    product.thumbnail.length > 0
                      ? product.thumbnail[0]
                      : product.thumbnail
                  }
                  alt="Product"
                />
                <div
                  className={cx("tym")}
                  onClick={() => handleClickTym(index)}
                >
                  {favoritedItems[index] ? (
                    <FavoriteIcon style={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </div>
              </div>
              <div className={cx("product_info")}>
                <a href="/">{product.nameBrand}</a>
                <div className={cx("description")}>{product.title}</div>
                <div className={cx("price_product")}>
                  <div className={cx("new_price")}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      product.price -
                        (product.price * product.discountPercentage) / 100
                    )}
                  </div>
                  {product.discountPercentage !== 0 && (
                    <div className={cx("discount")}>
                      <div className={cx("price")}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </div>
                      <span className={cx("discount-tag")}>
                        <div className={cx("tag")}>
                          -{product.discountPercentage}%
                        </div>
                      </span>
                    </div>
                  )}
                </div>
                <div className={cx("review")}>
                  <div className={cx("rate")}>
                    <StarIcon fontSize="inherit" />
                    <StarIcon fontSize="inherit" />
                    <StarIcon fontSize="inherit" />
                    <StarIcon fontSize="inherit" />
                    <StarIcon fontSize="inherit" />
                  </div>
                  <div className={cx("amount")}>(0)</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListCategory;
