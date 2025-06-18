import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListCategory.module.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  getAllProductName,
  getAllProducts,
  getAllProductSlug,
} from "../../../services/product.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { addToLike, removeFromLike } from "../../../services/like.service";
import { Skeleton, Rating, useMediaQuery, Pagination } from "@mui/material";

const cx = classNames.bind(styles);

function ListCategory({
  slug,
  onTotalChange,
  selectedPriceRanges,
  selectedBrands,
  selectedCategories,
  filteredProducts,
  setFilteredProducts,
  setAllProducts,
}) {
  const scrollableRef = useRef(null);
  const [listProduct, setListProduct] = useState([]);
  const { user, like, setLike, setIsModalLogin } = useAuth();
  const navigate = useNavigate();
  const isTabletOrMobile = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(true);
  // console.log(title);
  console.log(slug);
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

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
    setLoading(true);
    try {
      let products = [];

      if (slug === "san-pham-moi") {
        products = await getAllProducts(1, 50);
      } else if (slug.includes("-")) {
        products = await getAllProductSlug(1, 1000, slug);
      } else {
        products = await getAllProductName(1, 1000, slug);
      }

      if (products) {
        setListProduct(products);
        setAllProducts(products);
        onTotalChange(products.length);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
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
        selectedCategories.includes(product.nameCategory);

      return matchesPrice && matchesBrand && matchesCategory;
    });

    setFilteredProducts(filtered);
    onTotalChange(filtered.length);
  }, [listProduct, selectedPriceRanges, selectedBrands, selectedCategories]);

  // Reset trang khi lọc hoặc slug thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [slug, selectedPriceRanges, selectedBrands, selectedCategories]);

  const handleDetail = (slug) => {
    navigate(`/detailProduct/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    scrollableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPage = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className={cx("list")}>
      <div className={cx("scroll-list")}>
        <div className={cx("list_product")} ref={scrollableRef}>
          {loading
            ? [...Array(8)].map((_, index) => (
                <div key={index} className={cx("product")}>
                  <div className={cx("productList-img")}>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  </div>
                  <div className={cx("product_info")}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="30%" height={20} />
                  </div>
                </div>
              ))
            : currentItems.map((product) => (
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
                        <Rating
                          name="half-rating-read"
                          defaultValue={Number(product?.avgRating || 0)}
                          precision={0.5}
                          readOnly
                          sx={{
                            color: "black",
                            fontSize: isTabletOrMobile ? "14px" : "16px",
                            "& .MuiRating-icon": { marginRight: "6px" },
                          }}
                        />
                      </div>
                      <div className={cx("amount")}>
                        ({product?.totalReviews || 0})
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {!loading && totalPage > 1 && (
          <Pagination
            className={cx("pagnigation")}
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
          />
        )}
      </div>
    </div>
  );
}

export default ListCategory;
