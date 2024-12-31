import React, { createContext, useState, useContext } from "react";

// Tạo Context
const FilterContext = createContext();

// Tạo Provider để cung cấp giá trị cho các component
export const FilterProvider = ({ children }) => {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  const handleClearAll = () => {
    setSelectedPriceRanges([]); // Xóa tất cả các tag
  };

  const handleClearTag = (tag) => {
    setSelectedPriceRanges((prevState) =>
      prevState.filter((range) => range !== tag)
    );
  };

  return (
    <FilterContext.Provider
      value={{
        selectedPriceRanges,
        setSelectedPriceRanges,
        handleClearAll,
        handleClearTag,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Hook để sử dụng context dễ dàng
export const useFilterContext = () => useContext(FilterContext);
