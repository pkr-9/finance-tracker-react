import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { fetchForecast } from "../../../store/slices/analyticsSlice";
import ForecastItem from "../components/ForecastItem";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { IndianRupee } from "lucide-react";

export default function Analytics() {
  const dispatch = useAppDispatch();
  const { forecasts, loading, error } = useAppSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchForecast());
  }, [dispatch]);

  const totalForecastAmount = forecasts.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Analytics & Forecast
          </h1>
          <p className="text-slate-600 mt-1">
            Project your future expenses based on recurring payments.
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Forecasted Expenses (Next Month)
              </p>
              <p className="text-2xl font-bold text-slate-900 flex items-center">
                <IndianRupee className="w-6 h-6 mr-1" />
                {totalForecastAmount.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Across {forecasts.length} recurring items
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Forecast List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Expense Forecast
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            These are your projected expenses for the upcoming month.
          </p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="text-slate-600 ml-3">
                  Calculating your forecast...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Error Loading Forecast
              </h3>
              <p className="text-sm">{error}</p>
            </div>
          ) : forecasts.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No Forecast Available
              </h3>
              <p className="text-slate-600">
                Add some recurring expenses to see your financial forecast.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {forecasts.map((item, index) => (
                <ForecastItem key={`${item.title}-${index}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
