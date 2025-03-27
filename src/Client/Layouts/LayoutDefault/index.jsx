import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MainContent from "../MainContent";
import { AuthProvider } from "../../Context/AuthContext"; // Import AuthProvider

const LayoutDefault = () => {
  return (
    <AuthProvider>
      <div>
        <Header />
        <MainContent />
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default LayoutDefault;
