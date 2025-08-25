import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminVendorApproval from "./components/AdminVendorApproval";
import AdminDashboard from "./pages/AdminDashboard";
import VendorApprovalDetails from "./VendorApprovalDetails";
import VendorProfile from "./vendorProfile";
import Authform from "./components/Authform";
import DemoGreen from "./components/demoGreen";
import Popup from "./components/PopUp";
import VendorDashboard from "./VendorDashboard";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./components/CustomerProfile";
import ProtectedRoute from "./components/ProtectedRoute";

export const handleLogout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/"); // redirect to login page
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<DemoGreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/popup" element={<Popup />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vendor-approvals"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminVendorApproval />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vendor-approvals/:vendorId"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <VendorApprovalDetails />
            </ProtectedRoute>
          }
        />

        {/* Vendor Routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute roles={["VENDOR"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/profile"
          element={
            <ProtectedRoute roles={["VENDOR"]}>
              <VendorProfile />
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>

  );
}