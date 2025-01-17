import React from "react";
import MainContent from "../MainContent";
import Sidebar from "../../../Admin/components/Sidebar";

const LayoutDefault = () => {
  return (
    <div>
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default LayoutDefault;
