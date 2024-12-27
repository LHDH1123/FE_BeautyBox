import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Store.module.scss";
import HeaderLink from "../../components/HeaderLink";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const provinces = [
  { id: 1, name: "Hồ Chí Minh" },
  { id: 2, name: "Hà Nội" },
  { id: 3, name: "Đà Nẵng" },
];

const districts = {
  1: ["Quận 1", "Quận 3", "Quận 5", "Quận 7"],
  2: ["Hoàn Kiếm", "Ba Đình", "Cầu Giấy"],
  3: ["Hải Châu", "Sơn Trà", "Ngũ Hành Sơn"],
};

const cx = classNames.bind(styles);

const Store = () => {
  const position = [10.762622, 106.660172]; // Tọa độ TP.HCM
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedStore, setSelectedStore] = useState(1); // Trạng thái lưu cửa hàng được chọn

  const handleSelectStore = (storeId) => {
    setSelectedStore(storeId); // Lưu ID cửa hàng được chọn
  };
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict(""); // Reset district khi chọn tỉnh/thành phố mới
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };
  return (
    <div className={cx("store")}>
      <div className={cx("info")}>
        <HeaderLink title="Cửa hàng" />
        <div className={cx("total")}>25 Cửa hàng</div>
        <div className={cx("adress")}>
          {/* Dropdown tỉnh/thành phố */}
          <div className={cx("adress-info")}>
            <select
              className={cx("dropdown")}
              value={selectedProvince}
              onChange={handleProvinceChange}
            >
              <option value="">Tỉnh/Thành phố</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          {/* Dropdown quận/huyện */}
          <div className={cx("adress-info")}>
            <select
              className={cx("dropdown")}
              value={selectedDistrict}
              onChange={handleDistrictChange}
            >
              <option value="">Quận/Huyện</option>
              {districts[selectedProvince]?.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Danh sách cửa hàng */}
        <div className={cx("list-store")}>
          {[
            {
              id: 1,
              city: "Hồ Chí Minh",
              name: "BEAUTYBOX VÕ VĂN NGÂN",
              address: "102 Võ Văn Ngân, Phường Bình Thọ, Thành Phố Thủ Đức",
              phone: "02873003765",
            },
            {
              id: 2,
              city: "Hải Phòng",
              name: "BEAUTYBOX IMPERIAL HẢI PHÒNG",
              address:
                "L1-K3-K5 TTTM Vincom Center Imperia Hải Phòng, Khu đô thị Vinhomes Imperia Hải Phòng, Phường Thượng Lý, Quận Hồng Bàng",
              phone: "02257300579",
            },
          ].map((store) => (
            <div
              key={store.id}
              className={cx("detail-store", {
                selected: selectedStore === store.id, // Thêm class "selected" nếu cửa hàng được chọn
              })}
              onClick={() => handleSelectStore(store.id)} // Bắt sự kiện click
            >
              <div className={cx("city")}>{store.city}</div>
              <div className={cx("name-store")}>{store.name}</div>
              <div className={cx("address-store")}>{store.address}</div>
              <div className={cx("phone")}>{store.phone}</div>
              <a href="/" className={cx("timeOpen")}>
                Giờ mở cửa
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className={cx("map")}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "700px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>Đây là vị trí cửa hàng của bạn</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};
export default Store;
