import type { Forecast } from "../../../store/slices/analyticsSlice";
import { Calendar, Tag } from "lucide-react";
import { IndianRupee } from "lucide-react";

interface Props {
  item: Forecast;
}

export default function ForecastItem({ item }: Props) {
  const projectedDate = new Date(item.projectedDate);

  // Determine if the date is in the past, today, or future for styling
  const getStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
    projectedDate.setHours(0, 0, 0, 0); // Normalize projected date

    if (projectedDate < today) {
      return { text: "Overdue", color: "text-red-600", bg: "bg-red-100" };
    }
    if (projectedDate.getTime() === today.getTime()) {
      return { text: "Due Today", color: "text-amber-600", bg: "bg-amber-100" };
    }
    return { text: "Upcoming", color: "text-slate-600", bg: "bg-slate-100" };
  };

  const status = getStatus();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.bg}`}
            >
              <Calendar className={`w-5 h-5 ${status.color}`} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-lg">
                {item.title}
              </h4>
              <p className="text-sm text-slate-500 capitalize flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> {item.category}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>
              {projectedDate.toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}
            >
              {status.text}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 ml-4">
          <div className="text-2xl font-bold text-slate-800 flex items-center">
            <IndianRupee className="w-6 h-6 mr-1" />
            {item.amount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
