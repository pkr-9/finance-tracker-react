import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, TrendingUp, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { loginUser } from "../../../store/slices/authSlice";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const [error, setError] = useState("");
  const [error] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resultAction = await dispatch(loginUser({ username, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        if (resultAction.payload) {
          toast.error(resultAction.payload as string);
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-cyan-400/20 animate-pulse"></div>

        {/* Floating shapes */}
        <div
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-32 right-20 w-16 h-16 bg-white/20 rounded-lg rotate-45 animate-spin"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-12 h-12 bg-white/15 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/25 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-40 w-24 h-24 bg-white/10 rounded-2xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-20 right-1/3 w-6 h-6 bg-white/30 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Animated lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        <div
          className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 relative z-10">
        <div className="text-white">
          <div className="flex items-center space-x-3 mb-8 animate-fade-in">
            <div className="w-12 h-12 bg-teal-500 bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold">FinanceTracker</span>
          </div>
          <h1
            className="text-4xl font-bold mb-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Take Control of Your Financial Future
          </h1>
          <p
            className="text-xl text-emerald-100 mb-8 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Track expenses, manage budgets, and visualize your financial journey
            with our comprehensive dashboard.
          </p>
          <div className="space-y-4 text-emerald-100">
            <div
              className="flex items-center space-x-3 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
              <span>Real-time expense tracking</span>
            </div>
            <div
              className="flex items-center space-x-3 animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <div
                className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <span>Smart budget management</span>
            </div>
            <div
              className="flex items-center space-x-3 animate-fade-in"
              style={{ animationDelay: "1s" }}
            >
              <div
                className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <span>Detailed financial reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-white relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8 animate-fade-in">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              FinanceTracker
            </span>
          </div>

          <h2
            className="text-3xl font-bold text-center text-slate-900 mb-2 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Welcome back
          </h2>
          <p
            className="text-center text-slate-600 mb-8 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Sign in to your account to continue
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-slate-400"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-slate-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Links */}
            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-600 hover:text-emerald-500 font-medium transition-colors hover:underline"
              >
                Forgot your password?
              </Link>
              <Link
                to="/register"
                className="text-sm text-emerald-600 hover:text-emerald-500 font-medium transition-colors hover:underline"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
