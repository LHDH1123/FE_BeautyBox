import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { checkLogin, loginPost } from "../../../services/auth.service";

const cx = classNames.bind(styles);

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    const response = await loginPost(formData);

    if (response?.loggedIn) {
      console.log("✅ Login thành công");
      navigate("/adminbb");
    } else {
      console.error(
        "❌ Đăng nhập thất bại:",
        response?.error || "Không xác định"
      );
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const res = await checkLogin();
      if (res?.loggedIn) {
        navigate("/adminbb");
      }
    };
    checkAuth();
  }, []);

  return (
    <div className={cx("container")}>
      <div className={cx("left")}>
        <img
          src="https://image.hsv-tech.io/300x0/bbx/common/50a26167-9341-4be8-8aba-9682d3b4a916.webp"
          alt="Logo"
          className={cx("logo")}
        />
        <div className={cx("title")}>We are the Beauty Box</div>

        <div className={cx("form")}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className={cx("btn")} onClick={handleLogin}>
            LOG IN
          </div>
        </div>
      </div>

      <div className={cx("right")}>
        <div>
          <h2>We are more than just a company</h2>
          <p>
            We are committed to delivering true value, continuously innovating
            and growing to create better things.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
