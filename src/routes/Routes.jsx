import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import LayoutDefault from "../Layouts/LayoutDefault";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LayoutDefault />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}
