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
import { useNavigate, useParams } from "react-router-dom";
import { getDetailProductSlug } from "../../../services/product.service";
import { getNameBrand } from "../../../services/brand.service";
import { getUser, refreshTokenUser } from "../../../services/user.service";
import { jwtDecode } from "jwt-decode";
import { AxiosInstance } from "../../../configs/axios";
import { addToCart } from "../../../services/cart.service";
import { addToLike } from "../../../services/like.service";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  FormControl,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import {
  creatReview,
  getProductFeedback,
} from "../../../services/review.service";
import { useAuth } from "../../Context/AuthContext";

const cx = classNames.bind(styles);

const DetailProduct = ({ setLike, setCart }) => {
  const [mainImage, setMainImage] = useState([]); // State to track the main image
  const [selectedImage, setSelectedImage] = useState([]); // State to track the selected thumbnail
  const sliderRef = useRef(null);
  const [isLike, setIsLike] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { slug } = useParams();
  const [userId, setUserId] = useState(1);

  const [product, setProduct] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [uploadImages, setUploadImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  const [commentText, setCommentText] = useState("");
  const [feedback, setFeedback] = useState([]);

  const { user, setIsModalLogin } = useAuth();

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    // Thêm ảnh mới vào danh sách cũ
    setUploadImages((prev) => [...prev, ...validImages]);

    const newUrls = validImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const fetchReviewProduct = async () => {
    try {
      if (product._id) {
        const response = await getProductFeedback(product._id);
        if (response) {
          // Gọi API lấy thông tin user cho từng review
          const interactionsWithUser = await Promise.all(
            response.interactions.map(async (review) => {
              const userData = await getUser(review.user_id);
              return {
                ...review,
                userName: userData?.user?.fullName || "Người dùng ẩn danh", // fallback nếu không có tên
              };
            })
          );

          setFeedback({
            ...response,
            interactions: interactionsWithUser,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviewProduct();
  }, [product?._id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getDetailProductSlug(slug);
        if (response) {
          const nameBrand = await getNameBrand(response.brand_id);
          const updatedProduct = { ...response, nameBrand };

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

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleUpQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDownQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleLike = () => {
    if (user === null) {
      setIsModalLogin(true);
      return;
    }
    if (isLike === false) {
      handleAddLike();
      setIsLike(true);
    } else {
      setIsLike(false);
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

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await refreshTokenUser();
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          setUserId(decodedUser.userId);

          AxiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
        } catch (error) {
          console.error("❌ Lỗi giải mã token:", error);
        }
      } else {
        console.warn("🚪 Người dùng chưa đăng nhập hoặc token hết hạn");
      }
    };

    fetchUserId();
  }, []);

  const handleAddToGuestCart = () => {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

    const existingProductIndex = guestCart.findIndex(
      (item) => item.product_id === product._id
    );

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
      guestCart[existingProductIndex].quantity += quantity;
    } else {
      // Nếu sản phẩm chưa có, thêm mới
      guestCart.push({
        product_id: product._id,
        quantity,
        title: product.title,
        thumbnail: Array.isArray(product.thumbnail)
          ? product.thumbnail[0]
          : product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
      });
    }

    // ✅ Lưu lại localStorage
    localStorage.setItem("guest_cart", JSON.stringify(guestCart));

    // ✅ Đồng bộ lại với context để UI re-render
    setCart({
      user_id: null,
      products: guestCart.map((item) => ({
        product_id: item.product_id,
        title: item.title,
        SKU: item.SKU,
        price: item.price,
        discountPercentage: item.discountPercentage,
        quantity: item.quantity,
      })),
    });

    console.log("🛒 Đã thêm sản phẩm vào giỏ hàng (guest)", guestCart);
  };

  const handleAddCart = async () => {
    if (!product._id) {
      console.warn(
        "⚠️ Không thể thêm vào giỏ hàng vì thiếu thông tin sản phẩm!"
      );
      return;
    }

    if (!user) {
      // Nếu chưa đăng nhập thì thêm vào localStorage
      handleAddToGuestCart();
      return;
    }

    try {
      const response = await addToCart(userId, product._id, quantity);

      if (response) {
        console.log(response);
        setCart(response.cart);
      }
    } catch (error) {
      console.error(
        "❌ Lỗi khi gọi API:",
        error.response?.data || error.message
      );
    }
  };

  const handleAddLike = async () => {
    if (!userId || !product._id) {
      console.warn("⚠️ Không thể thêm vào giỏ hàng vì thiếu thông tin!");
      return;
    }

    try {
      const response = await addToLike(userId, product._id);

      if (response) {
        console.log(response);
        setLike(response.like);
      }
    } catch (error) {
      console.error(
        "❌ Lỗi khi gọi API:",
        error.response?.data || error.message
      );
    }
  };

  const handleCheckOut = async () => {
    const selectCart = {
      products: [
        {
          product_id: product._id,
          quantity: quantity,
        },
      ],
      user_id: userId,
    };
    navigate("/check-out", { state: selectCart });
  };

  const handleOpenCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreateReview = async () => {
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("productId", product._id);
    formData.append("rating", rating.toString());
    formData.append("comment", commentText);

    // Thêm từng file ảnh vào formData
    uploadImages.forEach((file) => {
      formData.append("thumbnail", file); // backend xử lý kiểu mảng thumbnail[]
    });

    const response = await creatReview(user._id, product._id, formData);
    if (response) {
      console.log(response);
      handleOpenCloseModal();
    }
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cx("detail")}>
      <div className={cx("detail-content")}>
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
                      border:
                        img === selectedImage ? "2px solid black" : "none",
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
            <a href={`/products/${product.nameBrand}`} className={cx("brand")}>
              {product.nameBrand}
            </a>
            <h1>{product.title}</h1>
            <div className={cx("review")}>
              <div className={cx("evaluate")}>
                <div className={cx("evaluate__star")}>
                  {feedback?.avgRating && (
                    <Rating
                      name="half-rating-read"
                      defaultValue={Number(feedback.avgRating)}
                      precision={0.5}
                      readOnly
                      sx={{
                        color: "black",
                        fontSize: "16px",
                        "& .MuiRating-icon": { marginRight: "6px" },
                      }}
                    />
                  )}

                  <div className={cx("amount")}>({feedback.totalReviews})</div>
                </div>
                <div className={cx("total-like")}></div>
              </div>
              <div className={cx("SKU")}>
                <span style={{ fontWeight: "bold" }}>SKU: </span>
                {product.SKU}
              </div>
            </div>
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
                <div className={cx("price")}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
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
              <span className={cx("storeName")}>BEAUTY BOX NGUYÊN GIA TRÍ</span>
              .<span className={cx("suggestion")}>Chọn cửa hàng khác</span>
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
              <button
                onClick={() => {
                  handleAddCart();
                }}
              >
                <AddShoppingCartIcon />
                <span>Thêm vào giỏ hàng</span>
              </button>
            </div>
            <div className={cx("buy")} onClick={handleCheckOut}>
              <button>Mua ngay</button>
            </div>
            <div className={cx("like")} onClick={handleLike}>
              <button>
                {isLike === true ? (
                  <FavoriteIcon style={{ color: "red" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("reviewsSection")}>
        <div className={cx("rating")}>
          <div className={cx("header-rating")}>
            <div className={cx("title-rating")}>
              {feedback.totalReviews} đánh giá
            </div>
            <div className={cx("writeReview")} onClick={handleOpenCloseModal}>
              VIẾT ĐÁNH GIÁ
            </div>
          </div>

          <div className={cx("rating-content")}>
            {feedback?.avgRating && (
              <Rating
                name="half-rating-read"
                defaultValue={Number(feedback?.avgRating)}
                precision={0.5}
                readOnly
                sx={{
                  color: "black",
                  fontSize: "32px",
                  "& .MuiRating-icon": { marginRight: "6px" }, // Điều chỉnh khoảng cách giữa các ngôi sao
                }}
              />
            )}
            <div className={cx("starMount")}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = feedback?.ratingsBreakdown?.[star] || 0;
                const total = feedback?.totalReviews || 1;
                const percentage = (count / total) * 100;

                return (
                  <div
                    key={star}
                    className={cx("starRow")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 15,
                    }}
                  >
                    <span style={{ width: 20, fontWeight: "bold" }}>
                      {star}
                    </span>
                    <div
                      className={cx("ratingBar")}
                      style={{
                        flexGrow: 1,
                        backgroundColor: "#e0e0e0",
                        height: 6,
                        borderRadius: 5,
                        margin: "0 8px",
                        position: "relative",
                      }}
                    >
                      <div
                        className={cx("filled")}
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          backgroundColor: "#000",
                          borderRadius: 5,
                        }}
                      ></div>
                    </div>
                    <span style={{ width: 30, fontWeight: "500" }}>
                      ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={cx("comment")}>
          {feedback?.interactions?.length === 0 ? (
            <div className={cx("noReviews")}>Chưa có đánh giá nào</div>
          ) : (
            feedback?.interactions?.map((review) => (
              <div className={cx("reviewItem")} key={review._id}>
                <div className={cx("reviewHeader")}>
                  <span>{review.userName}</span>
                  <div className={cx("star-day")}>
                    <Rating
                      name="half-rating-read"
                      defaultValue={review.rating}
                      precision={0.5}
                      readOnly
                      sx={{
                        color: "black",
                        fontSize: "16px",
                        "& .MuiRating-icon": { marginRight: "6px" },
                      }}
                    />
                    <span>
                      {new Date(review.createAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className={cx("cmt")}>{review.comment}</div>

                {review.thumbnail?.length > 0 && (
                  <div className={cx("review-images")}>
                    {review.thumbnail.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Review ${i}`}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginTop: 8,
                          marginRight: 8,
                          border: "1px solid #ddd",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={handleOpenCloseModal}
        // fullWidth={true} // phải có nếu bạn muốn dialog to ra
        maxWidth={false}
        PaperProps={{
          style: {
            // marginTop: "-30px",
            borderRadius: "16px",
            height: "auto",
            width: "1000px",
          },
        }}
      >
        <Box p={3}>
          <Box position="relative" px={2} pt={2} pb={2}>
            {/* Tiêu đề căn giữa */}
            <Typography variant="h6" fontWeight={600} align="center">
              Viết đánh giá
            </Typography>

            {/* Nút đóng ở góc phải */}
            <Box position="absolute" top={16} right={16}>
              <button
                onClick={handleOpenCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" mt={2} mb={2}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                backgroundColor: "#efefef", // màu da
                borderRadius: 2,
                padding: 2,
              }}
            >
              <Avatar
                src={
                  Array.isArray(product.thumbnail)
                    ? product.thumbnail[0]
                    : product.thumbnail
                }
                alt="avatar"
                variant="rounded"
                sx={{ width: 64, height: 64 }}
              />
              <Box>
                <Typography fontWeight="bold">{product.nameBrand}</Typography>
                <Typography variant="body2">{product.title}</Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
            {/* Row 2 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel shrink>Đánh giá chung</InputLabel>

                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="medium"
                  sx={{
                    mt: 2.5, // đẩy xuống giống các input khác
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel shrink>Hình ảnh</InputLabel>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{
                    mt: 2.5,
                    color: "rgba(0, 0, 0, 0.87)",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    textTransform: "none",
                  }}
                  onClick={triggerFileInput}
                >
                  Tải ảnh lên
                </Button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                <Box display="flex" flexWrap="wrap" mt={2} gap={2}>
                  {previewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`upload preview ${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                      }}
                    />
                  ))}
                </Box>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Đánh giá chi tiết"
            placeholder="Viết đánh giá chi tiết"
            multiline
            rows={3}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="contained"
              sx={{
                background:
                  "linear-gradient(90deg, rgb(255, 212, 0) 0%, rgb(199, 49, 48) 50.52%, rgb(102, 54, 149) 99.61%)",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "999px",
                px: 4,
              }}
              onClick={handleCreateReview}
            >
              GỬI CHO CHÚNG TÔI
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default DetailProduct;
