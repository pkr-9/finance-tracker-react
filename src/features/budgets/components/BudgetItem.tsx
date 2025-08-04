import type { Budget } from "../types";
import { Edit2, Trash2, AlertTriangle, CheckCircle } from "lucide-react";

interface Props {
  data: Budget;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BudgetItem({ data, onEdit, onDelete }: Props) {
  const percent =
    data.limitAmount > 0
      ? Math.min((data.spent / data.limitAmount) * 100, 100)
      : 0;
  const remaining = data.limitAmount - data.spent;

  const getStatusColor = () => {
    if (percent >= 100) return "text-red-600";
    if (percent >= 80) return "text-amber-600";
    return "text-emerald-600";
  };

  const getProgressColor = () => {
    if (percent >= 100) return "bg-red-500";
    if (percent >= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStatusIcon = () => {
    if (percent >= 100) return <AlertTriangle className="w-4 h-4" />;
    if (percent >= 80) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-semibold text-slate-900">
              {data.category}
            </h4>
            <div className={`flex items-center gap-1 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-xs font-medium">
                {percent >= 100
                  ? "Over Budget"
                  : percent >= 80
                  ? "Near Limit"
                  : "On Track"}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">
                ₹{data.spent.toLocaleString()}
              </span>{" "}
              spent of{" "}
              <span className="font-medium text-slate-900">
                ₹{data.limitAmount.toLocaleString()}
              </span>
            </p>
            <p className="text-xs text-slate-500">
              {remaining >= 0 ? (
                <>₹{remaining.toLocaleString()} remaining</>
              ) : (
                <>₹{Math.abs(remaining).toLocaleString()} over budget</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit budget"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete budget"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-slate-600">Progress</span>
          <span className={`text-xs font-bold ${getStatusColor()}`}>
            {percent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>

      {/* Month indicator */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
          {/* FIX: Use data.month directly as it's a valid date string */}
          {new Date(data.month).toLocaleDateString("en-US", {
            timeZone: "UTC", // Use UTC to avoid off-by-one day errors from timezone conversion
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
