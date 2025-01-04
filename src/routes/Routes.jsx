import { Route, Routes } from "react-router-dom";
import Home from "../Client/pages/Home";
import LayoutDefault from "../Client/Layouts/LayoutDefault";
import Store from "../Client/pages/Store";
import Support from "../Client/pages/Support";
import Profile from "../Client/pages/Profile";
import Brand from "../Client/pages/Brand";
import Product from "../Client/pages/Product";
import Error404 from "../Client/pages/Error404";
import Detail from "../Client/pages/Detail";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LayoutDefault />}>
        <Route index element={<Home />} />
        <Route path="/stores" element={<Store />} />
        <Route path="/help-center" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/brands" element={<Brand />} />
        <Route path="/product" element={<Product />} />
        <Route path="/detail" element={<Detail />} />

        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
