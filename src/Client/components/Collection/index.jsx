import React from "react";
import classNames from "classnames/bind";
import styles from "./Collection.module.scss";
import img1 from "../../../assets/images/menu-image-brand.webp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const cx = classNames.bind(styles);

Collection.propTypes = {
  props: PropTypes.string,
};

function Collection({ props }) {
  // const [listBrand, setListBrand] = useState([]);
  const navigate = useNavigate();
  const {
    brands,
    // setBrands,
  } = useAuth();

  // useEffect(() => {
  //   const fetchBrand = async () => {
  //     try {
  //       const response = await getBrands();
  //       if (response) {
  //         setListBrand(response);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching brands:", error);
  //     }
  //   };

  //   fetchBrand();
  // }, []);

  const handleListProductBrand = (name) => {
    navigate(`/products/${name}`);
  };

  return (
    <div className={cx("collection")}>
      <div className={cx("collection-info")}>
        <div className={cx("title-collection")}>
          <div
            className={cx("title")}
            onClick={() => {
              navigate("/brands");
            }}
          >
            {props === "Thương hiệu" ? "Tất cả thương hiệu" : props}
          </div>
          <div className={cx("icon")}>
            <ChevronRightIcon />
          </div>
        </div>
        <div className={cx("infos")}>
          {brands.slice(0, 10).map((brand) => (
            <div
              key={brand._id}
              className={cx("title-info")}
              onClick={() => {
                handleListProductBrand(brand.name);
              }}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
      <div className={cx("img-collection")}>
        <div className={cx("img")}>
          <img src={img1} alt="" />
        </div>
        <div className={cx("img")}>
          <img src={img1} alt="" />
        </div>
        <div className={cx("img")}>
          <img src={img1} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Collection;
