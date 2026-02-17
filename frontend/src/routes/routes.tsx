import { Routes, Route, Navigate } from "react-router-dom";
import { AccountOpt } from "../components/accountOpt/accountOpt.page";
import { BlogDetails } from "../components/blogDetails/blogDetails.page";
import { BlogPage } from "../components/blogs/blogs.page";
import { CheckoutPage } from "../components/checkout/checkout.page";
import { Dashboard } from "../components/dashboard/dashboard.page";
import { OrderConformation } from "../components/orderConformation/orderConformation.page";
import RouteLoaderWrapper from "../utils/RouteLoaderWrapper";
import { Tnc } from "../components/tnc/tnc.page";

const AppRoutes = () => {
  return (
    <RouteLoaderWrapper>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/conformationPage" element={<OrderConformation />} />
        <Route path="/AccountSetting" element={<AccountOpt />} />
        <Route path="/recipe" element={<BlogPage />} />
        <Route path="/recipe/:id" element={<BlogDetails />} />

        <Route path="/product/:name" element={<Dashboard />} />
        <Route path="/shop" element={<Dashboard />} />
        <Route path="/about" element={<Dashboard />} />
        <Route path="/privacy" element={<Tnc />} />
        <Route path="/tnc" element={<Tnc />} />
        <Route path="/shipping" element={<Tnc />} />
        <Route path="/refund" element={<Tnc />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RouteLoaderWrapper>
  );
};

export default AppRoutes;
