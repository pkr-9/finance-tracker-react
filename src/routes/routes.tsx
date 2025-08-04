import { Routes, Route } from "react-router-dom";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Login from "../features/auth/pages/Login";
import Transactions from "../features/transactions/pages/Transactions";
import PrivateRoute from "./PrivateRoute";
import Budgets from "../features/budgets/pages/Budgets";
import Register from "../features/auth/pages/Register";
import Profile from "../features/auth/pages/Profile";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import Layout from "../components/layout/Layout";
import Analytics from "../features/analytics/pages/Analytics";

export default function AppRoutes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Private routes wrapped in Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          {/* Add future private routes here */}
        </Route>
      </Routes>
    </div>
  );
}
