import type { Transaction } from "../types";
import {
  Edit2,
  Trash2,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface Props {
  tx: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TransactionItem({ tx, onEdit, onDelete }: Props) {
  // FIX: Use toLowerCase() for case-insensitive comparison
  const isIncome = tx.type.toLowerCase() === "income";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with type indicator */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isIncome
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isIncome ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 text-lg">
                {tx.title || tx.category}
              </h4>
              <p className="text-sm text-slate-500 capitalize">
                {tx.type} • {tx.category}
              </p>
            </div>
          </div>

          {/* Notes */}
          {tx.notes && (
            <div className="flex items-start gap-2 mb-3 text-sm text-slate-600">
              <FileText className="w-4 h-4 mt-0.5 text-slate-400" />
              <p className="flex-1">{tx.notes}</p>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(tx.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Amount and Actions */}
        <div className="flex flex-col items-end gap-3 ml-4">
          <div
            className={`text-2xl font-bold ${
              isIncome ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {isIncome ? "+" : "-"}₹{tx.amount.toLocaleString()}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={onEdit}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit transaction"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
