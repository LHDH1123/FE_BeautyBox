import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./DetailProduct.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Rating from "@mui/material/Rating";
import { useLocation } from "react-router-dom";
import { getDetailProduct } from "../../../services/product.service";
import { getNameBrand } from "../../../services/brand.service";

const cx = classNames.bind(styles);

const DetailProduct = () => {
  const [mainImage, setMainImage] = useState([]); // State to track the main image
  const [selectedImage, setSelectedImage] = useState([]); // State to track the selected thumbnail
  const sliderRef = useRef(null);
  const [like, setLike] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const { id } = location.state;

  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getDetailProduct(id);
        if (response) {
          const nameBrand = await getNameBrand(response[0].brand_id);
          const updatedProduct = { ...response[0], nameBrand };

          setProduct(updatedProduct);
          if (updatedProduct.thumbnail.length > 1) {
            setMainImage(updatedProduct.thumbnail[0]);
          } else {
            setMainImage(updatedProduct.thumbnail);
          }
          setSelectedImage(updatedProduct.thumbnail);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleUpQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDownQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleLike = () => {
    if (like === false) {
      setLike(true);
    } else {
      setLike(false);
    }
  };

  const scrollUp = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ top: -100, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ top: 100, behavior: "smooth" });
    }
  };

  const handleThumbnailClick = (img) => {
    setMainImage(img); // Update the main image when a thumbnail is clicked
    setSelectedImage(img); // Update the selected image
  };

  return (
    <div className={cx("detail")}>
      <div className={cx("img__content")}>
        <div className={cx("img_slider_wrapper")}>
          <div className={cx("btn")} onClick={scrollUp}>
            <button>
              <KeyboardArrowUpIcon />
            </button>
          </div>
          <div className={cx("img_slider")} ref={sliderRef}>
            {product?.thumbnail?.length > 0 &&
              product.thumbnail.map((img, i) => (
                <div
                  className={cx("list-img")}
                  key={img}
                  onClick={() => handleThumbnailClick(img)}
                  style={{
                    border: img === selectedImage ? "2px solid black" : "none",
                  }}
                >
                  <img src={img} alt={`Product thumbnail ${i + 1}`} />
                </div>
              ))}
          </div>
          <div className={cx("btn")} onClick={scrollDown}>
            <button>
              <KeyboardArrowDownIcon />
            </button>
          </div>
        </div>

        <div className={cx("img-main")}>
          <img src={mainImage} alt="Main product" />
        </div>
      </div>

      <div className={cx("detail__content")}>
        <div className={cx("info-product")}>
          <div className={cx("brand")}>{product.nameBrand}</div>
          <h1>{product.title}</h1>
          <div className={cx("review")}>
            <div className={cx("evaluate")}>
              <div className={cx("evaluate__star")}>
                <Rating
                  name="half-rating-read"
                  defaultValue={2.5}
                  precision={0.5}
                  readOnly
                  sx={{
                    color: "black",
                    fontSize: "16px",
                    "& .MuiRating-icon": { marginRight: "6px" }, // Điều chỉnh khoảng cách giữa các ngôi sao
                  }}
                />
                <div className={cx("amount")}>(41)</div>
              </div>
              <div className={cx("total-like")}></div>
            </div>
            <div className={cx("SKU")}>
              <span style={{ fontWeight: "bold" }}>SKU: </span>
              {product.SKU}
            </div>
          </div>
          <div className={cx("price_product")}>
            <div className={cx("new_price")}>711.000đ</div>
            <div className={cx("price")}>{product.price}</div>
            <span className={cx("discount-tag")}>
              <div className={cx("tag")}>-{product.discountPercentage}%</div>
            </span>
          </div>
        </div>
        <div className={cx("shopping-options")}>
          <div className={cx("title-shopping")}>
            <h4>Hình thức mua hàng</h4>
          </div>
          <ul>
            <li>
              <input type="radio" id="option1" name="gift" />
              <label htmlFor="option1">Giao hàng</label>
            </li>
            <li>
              <input type="radio" id="option2" name="gift" />
              <label htmlFor="option2">Click & Collect</label>
            </li>
          </ul>
          <div className={cx("note")}>
            <span className={cx("soldOut")}>Hết hàng</span> tại{" "}
            <span className={cx("storeName")}>BEAUTY BOX NGUYÊN GIA TRÍ</span>.
            <span className={cx("suggestion")}>Chọn cửa hàng khác</span>
          </div>
          <div className={cx("store")}>
            <a href="/stores"> Xem tất cả các cửa hàng</a>
          </div>
        </div>
        <div className={cx("checkout")}>
          <div className={cx("div-quantity")}>
            <button onClick={handleDownQuantity}>
              <RemoveIcon
                style={{
                  fontSize: "22px",
                }}
              />
            </button>
            <div className={cx("quantity")}>{quantity}</div>
            <button onClick={handleUpQuantity}>
              <AddIcon
                style={{
                  fontSize: "22px",
                }}
              />
            </button>
          </div>
          <div className={cx("add-cart")}>
            <button>
              <AddShoppingCartIcon />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
          <div className={cx("buy")}>
            <button>Mua ngay</button>
          </div>
          <div className={cx("like")} onClick={handleLike}>
            <button>
              {like === true ? (
                <FavoriteIcon style={{ color: "red" }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
