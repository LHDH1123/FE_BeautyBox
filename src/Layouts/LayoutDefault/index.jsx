import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MainContent from "../MainContent";

const LayoutDefault = () => {
  return (
    <div>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default LayoutDefault;
