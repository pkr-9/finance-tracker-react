import { useEffect, useState } from "react";
import type { Budget } from "../types";
import { X, Save, IndianRupee } from "lucide-react";

interface Props {
  onSubmit: (budget: Budget | Omit<Budget, "id" | "spent">) => void;
  onClose: () => void;
  initialData?: Budget;
}

export default function BudgetForm({ onSubmit, onClose, initialData }: Props) {
  const [form, setForm] = useState<Omit<Budget, "id" | "spent">>({
    category: "",
    limitAmount: 0,
    month: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category,
        limitAmount: initialData.limitAmount,
        month: initialData.month,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "limitAmount" ? Number(value) : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (form.limitAmount <= 0) {
      newErrors.limitAmount = "Budget amount must be greater than 0";
    }

    if (!form.month) {
      newErrors.month = "Month is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (initialData) {
      onSubmit({ ...initialData, ...form });
    } else {
      onSubmit(form);
    }
    onClose();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {initialData ? "Edit Budget" : "Create New Budget"}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Set spending limits for different categories
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              errors.category ? "border-red-300" : "border-slate-300"
            }`}
            placeholder="e.g., Food, Transportation, Entertainment"
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* Budget Amount Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Budget Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-5 w-5 text-slate-400" />
            </div>
            <input
              name="limitAmount"
              type="number"
              min="0"
              step="0.01"
              value={form.limitAmount || ""}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.limitAmount ? "border-red-300" : "border-slate-300"
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.limitAmount && (
            <p className="text-red-500 text-xs mt-1">{errors.limitAmount}</p>
          )}
        </div>

        {/* Month Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Month
          </label>
          <input
            name="month"
            type="month"
            value={form.month}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              errors.month ? "border-red-300" : "border-slate-300"
            }`}
          />
          {errors.month && (
            <p className="text-red-500 text-xs mt-1">{errors.month}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            {initialData ? "Update Budget" : "Create Budget"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
