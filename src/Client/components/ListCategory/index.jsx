import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListCategory.module.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import { getAllProducts } from "../../../services/product.service";
import {
  getCategorys,
  getDetailSlug,
  getNameCategory,
} from "../../../services/category.service";
import { getDetailName, getNameBrand } from "../../../services/brand.service";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function ListCategory({
  slug,
  onTotalChange,
  selectedPriceRanges,
  selectedBrands,
  selectedCategories,
}) {
  const scrollableRef = useRef(null);
  const [favoritedItems, setFavoritedItems] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigate = useNavigate();

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
        const [allCategories, allProducts] = await Promise.all([
          getCategorys(),
          getAllProducts(),
        ]);

        if (!allCategories || !allProducts) return;

        const categoryMap = new Map();
        allCategories.forEach((cat) => {
          categoryMap.set(cat._id, cat.parent_id);
        });

        const detailSlug = await getDetailSlug(slug);

        const categorySet = new Set();
        if (detailSlug && detailSlug._id) {
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
          findCategories(detailSlug._id);
        }

        const detailNameBrand = await getDetailName(slug);

        let filteredProducts = [];

        if (slug === "san-pham-moi") {
          filteredProducts = allProducts
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 30);
        } else {
          if (detailNameBrand && detailNameBrand._id) {
            filteredProducts = allProducts.filter(
              (product) => product.brand_id === detailNameBrand._id
            );
          } else {
            filteredProducts = allProducts.filter((product) =>
              categorySet.has(product.category_id)
            );
          }
        }

        const brandIds = [...new Set(filteredProducts.map((p) => p.brand_id))];
        const categoryIds = [
          ...new Set(filteredProducts.map((p) => p.category_id)),
        ];

        const brandNames = await Promise.all(
          brandIds.map(async (brandId) => ({
            brandId,
            nameBrand: await getNameBrand(brandId),
          }))
        );
        const categoryNames = await Promise.all(
          categoryIds.map(async (categoryId) => ({
            categoryId,
            nameCategory: await getNameCategory(categoryId),
          }))
        );

        const brandMap = new Map();
        brandNames.forEach(({ brandId, nameBrand }) => {
          brandMap.set(brandId, nameBrand);
        });

        const categoryFilterMap = new Map();
        categoryNames.forEach(({ categoryId, nameCategory }) => {
          categoryFilterMap.set(categoryId, nameCategory); // ✅ đúng map
        });

        const productsWithBrandNames = filteredProducts.map((product) => ({
          ...product,
          nameBrand: brandMap.get(product.brand_id),
          categoryName: categoryFilterMap.get(product.category_id),
        }));

        setListProduct(productsWithBrandNames);
        onTotalChange(productsWithBrandNames.length);
        setFavoritedItems(Array(productsWithBrandNames.length).fill(false));
      } catch (error) {
        console.error("Error fetching categories or products:", error);
      }
    };

    fetchData();
  }, [slug, onTotalChange]);

  console.log(listProduct);

  const handleDetail = (slug) => {
    navigate(`/detailProduct/${slug}`);
  };

  useEffect(() => {
    const filtered = listProduct.filter((product) => {
      const price = product.price;

      const matchesPrice =
        (selectedPriceRanges || []).length === 0
          ? true
          : selectedPriceRanges.some((range) => {
              if (range === "Dưới 500.000₫") return price < 500000;
              if (range === "500.000₫ - 1.000.000₫")
                return price >= 500000 && price <= 1000000;
              if (range === "1.000.000₫ - 1.500.000₫")
                return price > 1000000 && price <= 1500000;
              if (range === "1.500.000₫ - 2.000.000₫")
                return price > 1500000 && price <= 2000000;
              if (range === "Trên 2.000.000₫") return price > 2000000;
              return true;
            });

      const matchesBrand =
        (selectedBrands || []).length === 0
          ? true
          : selectedBrands.includes(product.nameBrand);

      const matchesCategory =
        (selectedCategories || []).length === 0
          ? true
          : selectedCategories.includes(product.categoryName);

      return matchesPrice && matchesBrand && matchesCategory;
    });

    setFilteredProducts(filtered);
    onTotalChange(filtered.length);
  }, [listProduct, selectedPriceRanges, selectedBrands, selectedCategories]); // <-- sửa chỗ này

  return (
    <div className={cx("list")}>
      <div className={cx("scroll-list")}>
        <div className={cx("list_product")} ref={scrollableRef}>
          {filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className={cx("product")}
              onClick={() => handleDetail(product.slug)}
            >
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
                <a
                  href={`/products/${product.nameBrand}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.nameBrand}
                </a>
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
