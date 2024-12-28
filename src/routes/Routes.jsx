import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import LayoutDefault from "../Layouts/LayoutDefault";
import Store from "../pages/Store";
import Support from "../pages/Support";
import Profile from "../pages/Profile";
import Brand from "../pages/Brand";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LayoutDefault />}>
        <Route index element={<Home />} />
        <Route path="/stores" element={<Store />} />
        <Route path="/help-center" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/brands" element={<Brand />} />
      </Route>
    </Routes>
  );
}
