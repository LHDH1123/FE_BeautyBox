import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListCategory.module.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getAllProducts } from "../../../services/product.service";
import {
  getCategorys,
  getDetailSlug,
  getNameCategory,
} from "../../../services/category.service";
import { getDetailName, getNameBrand } from "../../../services/brand.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { addToLike, removeFromLike } from "../../../services/like.service";
import { getProductFeedback } from "../../../services/review.service";
import { Rating } from "@mui/material";

const cx = classNames.bind(styles);

function ListCategory({
  slug,
  onTotalChange,
  selectedPriceRanges,
  selectedBrands,
  selectedCategories,
}) {
  const scrollableRef = useRef(null);
  const [listProduct, setListProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { user, like, setLike, setIsModalLogin } = useAuth();
  const navigate = useNavigate();

  const handleClickTym = async (productId) => {
    if (!user) {
      setIsModalLogin(true);
      return;
    }

    const isLiked = like?.products?.some((item) => item._id === productId);
    try {
      const response = isLiked
        ? await removeFromLike(user._id, productId)
        : await addToLike(user._id, productId);
      if (response) setLike(response.like);
    } catch (error) {
      console.error(
        "❌ Error adding/removing like:",
        error.response?.data || error.message
      );
    }
  };

  const fetchData = async () => {
    try {
      const [allCategories, allProducts] = await Promise.all([
        getCategorys(),
        getAllProducts(),
      ]);
      if (!allCategories || !allProducts) return;

      const categoryMap = new Map();
      allCategories.forEach((cat) => categoryMap.set(cat._id, cat.parent_id));

      const detailSlug = await getDetailSlug(slug);
      const categorySet = new Set();
      if (detailSlug?._id) {
        const findCategories = (categoryId) => {
          if (!categorySet.has(categoryId)) {
            categorySet.add(categoryId);
            allCategories.forEach((cat) => {
              if (cat.parent_id === categoryId) findCategories(cat._id);
            });
          }
        };
        findCategories(detailSlug._id);
      }

      const detailNameBrand = await getDetailName(slug);
      let filteredProducts =
        slug === "san-pham-moi"
          ? allProducts
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 30)
          : allProducts.filter((product) =>
              detailNameBrand?.id
                ? product.brand_id === detailNameBrand._id
                : categorySet.has(product.category_id)
            );

      const brandIds = [...new Set(filteredProducts.map((p) => p.brand_id))];
      const categoryIds = [
        ...new Set(filteredProducts.map((p) => p.category_id)),
      ];

      const [brandNames, categoryNames] = await Promise.all([
        Promise.all(
          brandIds.map(async (brandId) => ({
            brandId,
            nameBrand: await getNameBrand(brandId),
          }))
        ),
        Promise.all(
          categoryIds.map(async (categoryId) => ({
            categoryId,
            nameCategory: await getNameCategory(categoryId),
          }))
        ),
      ]);

      const brandMap = new Map(
        brandNames.map(({ brandId, nameBrand }) => [brandId, nameBrand])
      );
      const categoryFilterMap = new Map(
        categoryNames.map(({ categoryId, nameCategory }) => [
          categoryId,
          nameCategory,
        ])
      );

      // Lấy feedback cho từng sản phẩm
      const productsWithDetails = await Promise.all(
        filteredProducts.map(async (product) => {
          let feedback = [];
          try {
            const res = await getProductFeedback(product._id);

            feedback = res;
          } catch (err) {
            console.error(
              `Failed to fetch feedback for product ${product._id}:`,
              err
            );
          }

          return {
            ...product,
            nameBrand: brandMap.get(product.brand_id),
            categoryName: categoryFilterMap.get(product.category_id),
            feedbackList: feedback,
          };
        })
      );

      setListProduct(productsWithDetails);
      onTotalChange(productsWithDetails.length);
    } catch (error) {
      console.error("Error fetching categories or products:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    const filtered = listProduct.filter((product) => {
      const price = product.price;
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((range) => {
          switch (range) {
            case "Dưới 500.000₫":
              return price < 500000;
            case "500.000₫ - 1.000.000₫":
              return price >= 500000 && price <= 1000000;
            case "1.000.000₫ - 1.500.000₫":
              return price > 1000000 && price <= 1500000;
            case "1.500.000₫ - 2.000.000₫":
              return price > 1500000 && price <= 2000000;
            case "Trên 2.000.000₫":
              return price > 2000000;
            default:
              return true;
          }
        });

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.nameBrand);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.categoryName);

      return matchesPrice && matchesBrand && matchesCategory;
    });

    setFilteredProducts(filtered);
    onTotalChange(filtered.length);
  }, [listProduct, selectedPriceRanges, selectedBrands, selectedCategories]);

  const handleDetail = (slug) => {
    navigate(`/detailProduct/${slug}`);
  };

  return (
    <div className={cx("list")}>
      <div className={cx("scroll-list")}>
        <div className={cx("list_product")} ref={scrollableRef}>
          {filteredProducts.map((product) => (
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
                  onClick={() => handleDetail(product.slug)}
                />
                <div
                  className={cx("tym")}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClickTym(product._id);
                  }}
                >
                  {like?.products?.some((p) => p._id === product._id) ? (
                    <FavoriteIcon style={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </div>
              </div>
              <div
                className={cx("product_info")}
                onClick={() => handleDetail(product.slug)}
              >
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
                    {product.feedbackList?.avgRating ? (
                      <Rating
                        name="half-rating-read"
                        defaultValue={Number(product.feedbackList.avgRating)}
                        precision={0.5}
                        readOnly
                        sx={{
                          color: "black",
                          fontSize: "16px",
                          "& .MuiRating-icon": { marginRight: "6px" },
                        }}
                      />
                    ) : (
                      <Rating
                        name="half-rating-read"
                        defaultValue={0}
                        precision={0.5}
                        readOnly
                        sx={{
                          color: "black",
                          fontSize: "16px",
                          "& .MuiRating-icon": { marginRight: "6px" },
                        }}
                      />
                    )}
                  </div>
                  <div className={cx("amount")}>
                    ({product.feedbackList?.totalReviews || 0})
                  </div>
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
