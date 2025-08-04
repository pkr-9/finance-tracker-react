import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import {
  fetchBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from "../../../store/slices/budgetSlice";
import BudgetItem from "../components/BudgetItem";
import BudgetForm from "../components/BudgetForm";
import type { Budget } from "../types";
import { Plus, Wallet, Target } from "lucide-react";

export default function Budgets() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.budgets);

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Budget | null>(null);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  const handleSubmit = (budget: Budget | Omit<Budget, "id" | "spent">) => {
    if ("id" in budget) {
      dispatch(updateBudget(budget));
    } else {
      dispatch(addBudget(budget));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      dispatch(deleteBudget(id));
    }
  };

  const totalBudget = list.reduce((sum, budget) => sum + budget.limitAmount, 0);
  const totalSpent = list.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Budget Management
          </h1>
          <p className="text-slate-600 mt-1">
            Track and manage your spending limits
          </p>
        </div>
        <button
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Budget</p>
              <p className="text-2xl font-bold text-slate-900">
                ₹{totalBudget.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Across all categories
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900">
                ₹{totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {totalBudget > 0
                  ? `${((totalSpent / totalBudget) * 100).toFixed(
                      1
                    )}% of budget`
                  : "No budget set"}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Your Budgets</h2>
          <p className="text-sm text-slate-600 mt-1">
            Monitor your spending across different categories
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"></div>
                <div
                  className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="text-slate-600 ml-3">
                  Loading your budgets...
                </span>
              </div>
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No budgets yet
              </h3>
              <p className="text-slate-600 mb-6">
                Create your first budget to start tracking your expenses
              </p>
              <button
                onClick={() => {
                  setEditData(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Budget
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((b) => (
                <BudgetItem
                  key={b.id}
                  data={b}
                  onEdit={() => {
                    setEditData(b);
                    setShowForm(true);
                  }}
                  onDelete={() => handleDelete(b.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <BudgetForm
              initialData={editData || undefined}
              onSubmit={handleSubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
