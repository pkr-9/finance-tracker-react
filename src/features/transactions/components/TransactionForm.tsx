import { useState, useEffect } from "react";
import type { Transaction } from "../types";
import {
  X,
  Save,
  IndianRupee,
  Calendar,
  FileText,
  Tag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface Props {
  onSubmit: (tx: Omit<Transaction, "id"> | Transaction) => void;
  initialData?: Transaction;
  onClose: () => void;
}

export default function TransactionForm({
  onSubmit,
  initialData,
  onClose,
}: Props) {
  const [form, setForm] = useState<Omit<Transaction, "id">>({
    title: "",
    amount: 0,
    category: "",
    type: "expense",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setForm({
        title: rest.title,
        amount: rest.amount,
        category: rest.category,
        type: rest.type.toLowerCase() as "income" | "expense",
        date: new Date(rest.date).toISOString().slice(0, 10),
        notes: rest.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (form.amount <= 0) {
      newErrors.amount = "Amount must be greater than zero";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(initialData ? { ...form, id: initialData.id } : form);
    onClose();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            {form.type === "income" ? (
              <TrendingUp className="w-5 h-5 text-emerald-600 mr-2" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
            )}
            {initialData ? "Edit Transaction" : "Add New Transaction"}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {form.type === "income"
              ? "Record your income"
              : "Track your expenses"}
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
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "expense" })}
              className={`flex items-center justify-center p-3 border-2 rounded-lg transition-all duration-200 ${
                form.type === "expense"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <TrendingDown className="w-5 h-5 mr-2" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "income" })}
              className={`flex items-center justify-center p-3 border-2 rounded-lg transition-all duration-200 ${
                form.type === "income"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Income
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Title
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.title ? "border-red-300" : "border-slate-300"
              }`}
              placeholder="Transaction title"
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-5 w-5 text-slate-400" />
            </div>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={form.amount || ""}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.amount ? "border-red-300" : "border-slate-300"
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Category Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-slate-400" />
            </div>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.category ? "border-red-300" : "border-slate-300"
              }`}
              placeholder="e.g., Groceries, Salary, Transportation"
            />
          </div>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Notes Textarea */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
            placeholder="Add any additional details..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            {initialData ? "Update Transaction" : "Add Transaction"}
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
