// src/contexts/BrandContext.js
import React, { createContext, useState, useContext } from "react";

const BrandContext = createContext();

export const useSelectedBrands = () => useContext(BrandContext);

export const BrandProvider = ({ children }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);

  const toggleSelectedBrand = (id) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((brandId) => brandId !== id)
        : [...prevSelected, id]
    );
  };

  const selectAllBrands = (brands) => {
    setSelectedBrands(brands.map((brand) => brand._id)); // Chọn tất cả
  };

  const deselectAllBrands = () => {
    setSelectedBrands([]); // Bỏ chọn tất cả
  };

  return (
    <BrandContext.Provider
      value={{
        selectedBrands,
        toggleSelectedBrand,
        selectAllBrands,
        deselectAllBrands,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};
