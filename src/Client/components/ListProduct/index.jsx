import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListProduct.module.scss";
import PropTypes from "prop-types";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import { getAllProducts } from "../../../services/product.service";
import { getNameBrand } from "../../../services/brand.service";
import { getNameCategory } from "../../../services/category.service";

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
  const [favoritedItems, setFavoritedItems] = useState([]);
  const [listProducts, setListProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response) {
          const productsWithBrand = await Promise.all(
            response.map(async (product) => ({
              ...product,
              nameBrand: await getNameBrand(product.brand_id),
              nameCategory: await getNameCategory(product.category_id),
              newPrice:
                product.price -
                (product.price * product.discountPercentage) / 100,
            }))
          );
          setListProducts(productsWithBrand);
          setFavoritedItems(Array(productsWithBrand.length).fill(false));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Thêm [] để tránh gọi API liên tục

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
      handleScroll(); // Gọi ngay để cập nhật trạng thái nút
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [listProducts]); // Gọi lại khi danh sách sản phẩm thay đổi

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

  const handleClickTym = (index) => {
    setFavoritedItems((prev) =>
      prev.map((item, idx) => (idx === index ? !item : item))
    );
  };

  return (
    <div className={cx("list")}>
      <h2>{title}</h2>
      <div className={cx("scroll-list")}>
        {isLeftVisible && (
          <button className={cx("scroll-button", "left")} onClick={scrollLeft}>
            <ArrowLeftIcon />
          </button>
        )}
        <div className={cx("list_product")} ref={scrollableRef}>
          {listProducts.map((product, index) => (
            <div key={product._id} className={cx("product")}>
              <div className={cx("tym")} onClick={() => handleClickTym(index)}>
                {favoritedItems[index] ? (
                  <FavoriteIcon style={{ color: "red" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </div>
              <div className={cx("productList-img")}>
                <img src={product.thumbnail} alt="Product" />
              </div>
              <div className={cx("product_info")}>
                <a href="/">{product.nameBrand}</a>
                <div className={cx("description")}>{product.title}</div>
                <div className={cx("price_product")}>
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
                  <span className={cx("discount-tag")}>
                    <div className={cx("tag")}>
                      -{product.discountPercentage}%
                    </div>
                  </span>
                </div>
                <div className={cx("review")}>
                  <div className={cx("rate")}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} fontSize="inherit" />
                    ))}
                  </div>
                  <div className={cx("amount")}>(0)</div>
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
