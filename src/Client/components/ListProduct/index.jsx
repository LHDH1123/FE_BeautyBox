import React, { useEffect, useRef, useState, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./ListProduct.module.scss";
import PropTypes from "prop-types";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  getAllProducts,
  getAllProductSlug,
} from "../../../services/product.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { addToLike, removeFromLike } from "../../../services/like.service";
import { Rating } from "@mui/material";
import { debounce } from "lodash";

const cx = classNames.bind(styles);

ListProduct.propTypes = {
  title: PropTypes.string,
};

ListProduct.defaultProps = {
  title: "",
};

function ListProduct({ title, activeTab, setActiveTab }) {
  const scrollableRef = useRef(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [listProducts, setListProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // state loading
  const navigate = useNavigate();
  const { user, like, setLike, setIsModalLogin } = useAuth();

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true); // Bắt đầu loading
      let products;
      if (title === "Xu hướng làm đẹp") {
        products = await getAllProductSlug(1, 20, activeTab);
      } else if (title === "Sản phẩm mới") {
        products = await getAllProducts(1, 20, "new");
      }
      setListProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  }, [title, activeTab]);

  useEffect(() => {
    fetchProducts();
  }, [title, activeTab]);

  const handleScroll = debounce(() => {
    const container = scrollableRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setIsLeftVisible(container.scrollLeft > 0);
      setIsRightVisible(container.scrollLeft < maxScrollLeft);
    }
  }, 100);

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

  const scrollLeft = useCallback(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: -scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, []);

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
    // if (title === "Xu hướng làm đẹp") {
    //   fetchProducts(tab);
    // }
  };

  const renderSkeletons = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className={cx("product")}>
        <div className={cx("productList-img")}>
          <div className={cx("skeleton-img")} />
        </div>
        <div className={cx("product_info")}>
          <div className={cx("skeleton-text", "brand")} />
          <div className={cx("skeleton-text", "title")} />
          <div className={cx("skeleton-text", "price")} />
          <div className={cx("skeleton-text", "rating")} />
        </div>
      </div>
    ));
  };

  return (
    <div className={cx("list")}>
      <div className={cx("list")}>
        <h2>{title}</h2>
        {title === "Xu hướng làm đẹp" && (
          <div className={cx("listTitle-category")}>
            <div
              className={cx(
                "title",
                activeTab === "cham-soc-co-the" && "active"
              )}
              onClick={() => handleChangeTab("cham-soc-co-the")}
            >
              Chăm sóc cơ thể
            </div>
            <div
              className={cx("title", activeTab === "trang-diem" && "active")}
              onClick={() => handleChangeTab("trang-diem")}
            >
              Trang điểm
            </div>
            <div
              className={cx("title", activeTab === "cham-soc-da" && "active")}
              onClick={() => handleChangeTab("cham-soc-da")}
            >
              Chăm sóc da
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
          {isLoading
            ? renderSkeletons()
            : listProducts?.map((product) => (
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
                          }).format(product.price)}
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
                          defaultValue={Number(product?.avgRating || 0)}
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
                        ({product?.totalReviews || 0})
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
