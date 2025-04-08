import { createContext, useContext, useEffect, useState } from "react";
import { getUser, refreshTokenUser } from "../../services/user.service";
import { getCart } from "../../services/cart.service";
import { getLike } from "../../services/like.service";
import { getAllAddress } from "../../services/address.service";
import { jwtDecode } from "jwt-decode";
import { AxiosInstance } from "../../configs/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [selectCart, setSelectCart] = useState(null);
  const [like, setLike] = useState(null);
  const [address, setAddress] = useState(null);
  const [updateUser, setUpdateUser] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const [nameUser, setNameUser] = useState("");

  const fetchAddress = async (userId) => {
    if (!userId) return;
    try {
      const response = await getAllAddress(userId);
      if (response) {
        setAddress(response);
        // handleModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCart = async (userId) => {
    if (!userId) return; // Tránh gọi API nếu userId không tồn tại
    try {
      const response = await getCart(userId);
      if (response) {
        setCart(response);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải giỏ hàng:", error);
    }
  };

  const fetchLike = async (userId) => {
    if (!userId) return;
    try {
      const response = await getLike(userId);
      if (response) {
        setLike(response);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải giỏ thích:", error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const token = await refreshTokenUser();
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          const userData = await getUser(decodedUser.userId);

          setUser(userData.user);
          setNameUser(userData.user.fullName);
          setUpdateUser({
            id: userData.user._id,
            fullName: userData.user.fullName,
            email: userData.user.email,
            phone: userData.user.phone,
          });

          AxiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;

          // Gọi API để lấy thông tin cần thiết
          fetchCart(userData.user._id);
          fetchLike(userData.user._id);
          fetchAddress(userData.user._id);
        } catch (error) {
          console.error("❌ Lỗi giải mã token:", error);
          setUser(null);
        }
      } else {
        console.warn("🚪 Người dùng chưa đăng nhập hoặc token hết hạn");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        updateUser,
        setUpdateUser,
        user,
        setUser,
        nameUser,
        setNameUser,
        cart,
        setCart,
        selectCart,
        setSelectCart,
        like,
        setLike,
        address,
        setAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
