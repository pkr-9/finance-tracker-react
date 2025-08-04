import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import {
  updateProfile,
  deleteAccount,
  logout,
} from "../../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, Trash2, Save } from "lucide-react";
import { toast } from "react-toastify";

export default function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.auth);

  // State for the profile update form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
  });

  // Separate state for the password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Handler for updating only the username
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({ username: profileForm.name })).unwrap();
      toast.success("Username updated successfully!");
    } catch (error) {
      toast.error((error as string) || "Failed to update username");
    }
  };

  // Handler for updating only the password
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Both current and new passwords are required.");
      return;
    }
    try {
      await dispatch(updateProfile({ ...passwordForm })).unwrap();
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "" }); // Clear fields
    } catch (error) {
      toast.error((error as string) || "Failed to change password.");
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deleteAccount()).unwrap();
        dispatch(logout());
        navigate("/login");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-600 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {user?.name || "User"}
              </h3>
              <p className="text-sm text-slate-600">
                {user?.email || "user@example.com"}
              </p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Active Account
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-slate-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Email unverified
                </div>
                <div className="flex items-center text-slate-600">
                  <Lock className="w-4 h-4 mr-2" />
                  Secure account
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form 1: Update Profile */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Update Profile Information
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  New Username
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading === "pending"}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Username
              </button>
            </form>
          </div>

          {/* Form 2: Change Password */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Change Password
            </h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading === "pending"}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium disabled:opacity-50"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <button
              onClick={handleDelete}
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
