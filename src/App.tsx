import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./pages/AppLayout";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Placeholder from "./pages/Placeholder/Placeholder";
import AdminRole from "./pages/AdminRole/AdminRole";
import Brand from "./Brand/Brands";
import Customers from "./pages/Customers/Customers";
import Products from "./pages/Products/Products";

import AddProduct from "./pages/Products/ProductMedia/AddProduct";
import ProductMedia from "./pages/Products/AddProduct/ProductMedia";
import ProductMediaList from "./pages/Products/AddProduct/ProductMediaList";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <ThemeProvider>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* ADMIN */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* DASHBOARD */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* ORDERS */}
          <Route
            path="/orders"
            element={
              <Placeholder title="Order Management" />
            }
          />

          {/* CUSTOMERS */}
          <Route
            path="/customers"
            element={<Customers />}
          />

          {/* COUPONS */}
          <Route
            path="/coupons"
            element={
              <Placeholder title="Coupon Code" />
            }
          />

          {/* CATEGORIES */}
          <Route
            path="/categories"
            element={
              <Placeholder title="Categories" />
            }
          />

          {/* TRANSACTIONS */}
          <Route
            path="/transactions"
            element={
              <Placeholder title="Transaction" />
            }
          />

          {/* BRANDS */}
          <Route
            path="/brands"
            element={<Brand />}
          />

          {/* =========================
              PRODUCTS
          ========================= */}

          {/* ADD PRODUCT */}
          <Route
            path="/products/new"
            element={<AddProduct />}
          />

          {/* PRODUCT MEDIA - ALL */}
          <Route
            path="/products/media"
            element={<ProductMediaList />}
          />

          {/* PRODUCT MEDIA - SINGLE PRODUCT */}
          <Route
            path="/products/media/:id"
            element={<ProductMedia />}
          />

          {/* PRODUCT LIST */}
          <Route
            path="/products"
            element={<Products />}
          />

          {/* PRODUCT REVIEWS */}
          <Route
            path="/products/reviews"
            element={
              <Placeholder title="Product Reviews" />
            }
          />

          {/* ADMIN ROLE */}
          <Route
            path="/admin-role"
            element={<AdminRole />}
          />

          {/* CONTROL AUTHORITY */}
          <Route
            path="/control-authority"
            element={
              <Placeholder title="Control Authority" />
            }
          />
        </Route>

        {/* NOT FOUND */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}