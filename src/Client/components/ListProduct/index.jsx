import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListProduct.module.scss";
import PropTypes from "prop-types";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getAllProducts } from "../../../services/product.service";
import { getNameBrand } from "../../../services/brand.service";
import {
  getCategorys,
  getDetailSlug,
  getNameCategory,
} from "../../../services/category.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { addToLike, removeFromLike } from "../../../services/like.service";
import { Rating } from "@mui/material";
import { getProductFeedback } from "../../../services/review.service";

const cx = classNames.bind(styles);

ListProduct.propTypes = {
  title: PropTypes.string,
};

ListProduct.defaultProps = {
  title: "",
};

function ListProduct({ title }) {
  const scrollableRef = useRef(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [listProducts, setListProducts] = useState([]);
  const navigate = useNavigate();
  const { user, like, setLike, setIsModalLogin } = useAuth();
  const [activeTab, setActiveTab] = useState("trang-diem");

  const fetchProductDetails = async (products) => {
    return Promise.all(
      products.map(async (product) => {
        const [nameBrand, nameCategory, feedbacks] = await Promise.all([
          getNameBrand(product.brand_id),
          getNameCategory(product.category_id),
          getProductFeedback(product._id),
        ]);

        return {
          ...product,
          nameBrand,
          nameCategory,
          feedbacks,
          newPrice:
            product.price - (product.price * product.discountPercentage) / 100,
        };
      })
    );
  };

  const fetchInitialProducts = async () => {
    try {
      const products = await getAllProducts();
      if (!products) return;

      const enriched = await fetchProductDetails(products);
      const sorted = enriched.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setListProducts(sorted.slice(0, 20));
    } catch (error) {
      console.error("Error fetching initial products:", error);
    }
  };

  const fetchCategoryProducts = async (slug) => {
    try {
      const [allCategories, products] = await Promise.all([
        getCategorys(),
        getAllProducts(),
      ]);
      const detail = await getDetailSlug(slug);

      if (!detail?._id) return;

      const categorySet = new Set();
      const findChildren = (id) => {
        const strId = id.toString();
        categorySet.add(strId);
        allCategories.forEach((cat) => {
          if (cat.parent_id === strId && !categorySet.has(cat._id.toString())) {
            findChildren(cat._id);
          }
        });
      };
      findChildren(detail._id);

      const filtered = products.filter((p) =>
        categorySet.has(p.category_id?.toString())
      );

      const enriched = await fetchProductDetails(filtered);
      const sorted = enriched.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setListProducts(sorted.slice(0, 20));
    } catch (error) {
      console.error("❌ Lỗi khi lấy sản phẩm theo category slug:", error);
    }
  };

  useEffect(() => {
    if (title !== "Xu hướng làm đẹp") {
      fetchInitialProducts();
    } else {
      fetchCategoryProducts(activeTab);
    }
  }, []);

  const handleScroll = () => {
    const container = scrollableRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setIsLeftVisible(container.scrollLeft > 0);
      setIsRightVisible(container.scrollLeft < maxScrollLeft);
    }
  };

  useEffect(() => {
    const container = scrollableRef.current;
    if (container) {
      handleScroll();
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [listProducts]);

  const scrollLeft = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: -scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const handleAddLike = async (productId) => {
    if (!user._id || !productId) {
      console.warn("⚠️ Không thể thêm vào yêu thích vì thiếu thông tin!");
      return;
    }

    try {
      const response = await addToLike(user._id, productId);
      if (response) {
        setLike(response.like);
      }
    } catch (error) {
      console.error(
        "❌ Lỗi khi gọi API:",
        error.response?.data || error.message
      );
    }
  };

  const handleRemoveLike = async (id) => {
    const response = await removeFromLike(like.user_id, id);
    if (response) {
      setLike(response.like);
    }
  };

  const handleClickTym = (productId) => {
    if (user === null) {
      setIsModalLogin(true);
      return;
    }

    const isLiked = (like?.products ?? []).some(
      (item) => item._id === productId
    );

    if (isLiked) {
      handleRemoveLike(productId);
    } else {
      handleAddLike(productId);
    }
  };

  const handleDetail = (slug) => {
    navigate(`/detailProduct/${slug}`);
  };

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    if (title === "Xu hướng làm đẹp") {
      fetchCategoryProducts(tab);
    }
  };

  return (
    <div className={cx("list")}>
      <div className={cx("list")}>
        <h2>{title}</h2>
        {title === "Xu hướng làm đẹp" && (
          <div className={cx("listTitle-category")}>
            <div
              className={cx("title", activeTab === "cham-soc-da" && "active")}
              onClick={() => handleChangeTab("cham-soc-da")}
            >
              Chăm sóc da
            </div>
            <div
              className={cx("title", activeTab === "trang-diem" && "active")}
              onClick={() => handleChangeTab("trang-diem")}
            >
              Trang điểm
            </div>
            <div
              className={cx(
                "title",
                activeTab === "cham-soc-co-the" && "active"
              )}
              onClick={() => handleChangeTab("cham-soc-co-the")}
            >
              Chăm sóc cơ thể
            </div>
          </div>
        )}
      </div>

      <div className={cx("scroll-list")}>
        {isLeftVisible && (
          <button className={cx("scroll-button", "left")} onClick={scrollLeft}>
            <ArrowLeftIcon />
          </button>
        )}
        <div className={cx("list_product")} ref={scrollableRef}>
          {listProducts?.map((product) => (
            <div key={product._id} className={cx("product")}>
              <div
                className={cx("tym")}
                onClick={() => handleClickTym(product._id)}
              >
                {(like?.products ?? []).some(
                  (likedProduct) => likedProduct._id === product._id
                ) ? (
                  <FavoriteIcon style={{ color: "red" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </div>

              <div
                className={cx("productList-img")}
                onClick={() => handleDetail(product.slug)}
              >
                <img src={product.thumbnail[0]} alt="Product" />
              </div>
              <div
                className={cx("product_info")}
                onClick={() => handleDetail(product.slug)}
              >
                <a href={`/products/${product.nameBrand}`}>
                  {product.nameBrand}
                </a>
                <div className={cx("description")}>{product.title}</div>
                <div className={cx("price_product")}>
                  {product.discountPercentage === 0 ? (
                    <div className={cx("new_price")}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.newPrice)}
                    </div>
                  ) : (
                    <div style={{ display: "flex" }}>
                      <div className={cx("new_price")}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.newPrice)}
                      </div>
                      <div className={cx("price")}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </div>
                    </div>
                  )}
                  {product.discountPercentage !== 0 && (
                    <span className={cx("discount-tag")}>
                      <div className={cx("tag")}>
                        -{product.discountPercentage}%
                      </div>
                    </span>
                  )}
                </div>
                <div className={cx("review")}>
                  <div className={cx("rate")}>
                    <Rating
                      name="half-rating-read"
                      defaultValue={Number(product.feedbacks?.avgRating || 0)}
                      precision={0.5}
                      readOnly
                      sx={{
                        color: "black",
                        fontSize: "16px",
                        "& .MuiRating-icon": { marginRight: "6px" },
                      }}
                    />
                  </div>
                  <div className={cx("amount")}>
                    ({product.feedbacks?.totalReviews || 0})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isRightVisible && (
          <button
            className={cx("scroll-button", "right")}
            onClick={scrollRight}
          >
            <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
}

export default ListProduct;
