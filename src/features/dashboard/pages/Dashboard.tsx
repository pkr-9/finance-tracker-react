import { IndianRupee } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { fetchReports, clearReports } from "../../../store/slices/reportSlice";
import { fetchTransactions } from "../../../store/slices/transactionSlice";
import ExpensePieChart from "../components/ExpensePieChart";
import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { data: reports, loading: reportsLoading } = useAppSelector(
    (state) => state.reports
  );
  const { list: transactions, loading: transactionsLoading } = useAppSelector(
    (state) => state.transactions
  );

  // This ref helps us ensure the initial data fetch only happens once.
  const isInitialMount = useRef(true);

  // This effect now correctly handles both the initial data load
  // and subsequent refreshes when the transaction list changes.
  useEffect(() => {
    if (isInitialMount.current) {
      // On the very first load, fetch everything.
      dispatch(fetchTransactions());
      isInitialMount.current = false;
    }

    // This part runs on the first load AND any time 'transactions' changes.
    // It ensures the bar chart data is always in sync with the latest transactions.
    dispatch(clearReports());
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toISOString().slice(0, 7);
      dispatch(fetchReports(month));
    }
  }, [transactions, dispatch]); // The key change: this effect now depends on the transactions list.

  // Memoized calculation for the expense pie chart data.
  // This will now automatically recalculate when 'transactions' changes.
  const expenseData = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    transactions.forEach((tx) => {
      // Added toLowerCase() for robustness
      if (tx.type.toLowerCase() === "expense") {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      }
    });
    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [transactions]);

  // Memoized calculation for the summary cards.
  // This will also automatically recalculate.
  const totals = useMemo(() => {
    const totalIncome = transactions
      .filter((tx) => tx.type.toLowerCase() === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = transactions
      .filter((tx) => tx.type.toLowerCase() === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const netWorth = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netWorth };
  }, [transactions]);

  const isLoading = reportsLoading || transactionsLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600 flex items-center">
                <IndianRupee className="w-6 h-6 mr-1" />
                {totals.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-red-600 flex items-center">
                <IndianRupee className="w-6 h-6 mr-1" />
                {totals.totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Net Balance</p>
              <p
                className={`text-2xl font-bold flex items-center ${
                  totals.netWorth >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                <IndianRupee className="w-6 h-6 mr-1" />
                {totals.netWorth.toLocaleString()}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                totals.netWorth >= 0 ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              <IndianRupee
                className={`w-6 h-6 ${
                  totals.netWorth >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {isLoading && reports.length < 1 ? (
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
              Loading your financial data...
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ExpensePieChart data={expenseData} />
          <IncomeExpenseBarChart data={reports} />
        </div>
      )}
    </div>
  );
}

// import { useEffect, useMemo } from "react";
// import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
// import { fetchReports, clearReports } from "../../../store/slices/reportSlice";
// import { fetchTransactions } from "../../../store/slices/transactionSlice";
// import ExpensePieChart from "../components/ExpensePieChart";
// import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";
// import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

// export default function Dashboard() {
//   const dispatch = useAppDispatch();
//   const { data: reports, loading } = useAppSelector((state) => state.reports);
//   const { list: transactions } = useAppSelector((state) => state.transactions);

//   useEffect(() => {
//     // Clear previous reports before fetching new ones
//     dispatch(clearReports());

//     // Fetch reports for the last 6 months
//     for (let i = 5; i >= 0; i--) {
//       const date = new Date();
//       date.setMonth(date.getMonth() - i);
//       const month = date.toISOString().slice(0, 7); // Format as YYYY-MM
//       dispatch(fetchReports(month));
//     }

//     dispatch(fetchTransactions());
//   }, [dispatch]);

//   const expenseData = useMemo(() => {
//     const categoryMap: { [key: string]: number } = {};
//     transactions.forEach((tx) => {
//       if (tx.type === "expense") {
//         categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
//       }
//     });
//     return Object.entries(categoryMap).map(([category, amount]) => ({
//       category,
//       amount,
//     }));
//   }, [transactions]);

//   const totals = useMemo(() => {
//     const totalIncome = transactions
//       .filter((tx) => tx.type === "income")
//       .reduce((sum, tx) => sum + tx.amount, 0);

//     const totalExpense = transactions
//       .filter((tx) => tx.type === "expense")
//       .reduce((sum, tx) => sum + tx.amount, 0);

//     const netWorth = totalIncome - totalExpense;

//     return { totalIncome, totalExpense, netWorth };
//   }, [transactions]);

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
//           <p className="text-slate-600 mt-1">
//             Welcome back! Here's your financial overview.
//           </p>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-600">Total Income</p>
//               <p className="text-2xl font-bold text-emerald-600">
//                 ₹{totals.totalIncome.toLocaleString()}
//               </p>
//               <p className="text-xs text-emerald-600 flex items-center mt-1">
//                 <TrendingUp className="w-3 h-3 mr-1" />
//                 +2.5% from last month
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
//               <TrendingUp className="w-6 h-6 text-emerald-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-600">
//                 Total Expenses
//               </p>
//               <p className="text-2xl font-bold text-red-600">
//                 ₹{totals.totalExpense.toLocaleString()}
//               </p>
//               <p className="text-xs text-red-600 flex items-center mt-1">
//                 <TrendingDown className="w-3 h-3 mr-1" />
//                 +1.2% from last month
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
//               <TrendingDown className="w-6 h-6 text-red-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-600">Net Worth</p>
//               <p
//                 className={`text-2xl font-bold ${
//                   totals.netWorth >= 0 ? "text-emerald-600" : "text-red-600"
//                 }`}
//               >
//                 ₹{totals.netWorth.toLocaleString()}
//               </p>
//               <p
//                 className={`text-xs flex items-center mt-1 ${
//                   totals.netWorth >= 0 ? "text-emerald-600" : "text-red-600"
//                 }`}
//               >
//                 <DollarSign className="w-3 h-3 mr-1" />
//                 {totals.netWorth >= 0 ? "Positive" : "Negative"} balance
//               </p>
//             </div>
//             <div
//               className={`w-12 h-12 rounded-lg flex items-center justify-center ${
//                 totals.netWorth >= 0 ? "bg-emerald-100" : "bg-red-100"
//               }`}
//             >
//               <DollarSign
//                 className={`w-6 h-6 ${
//                   totals.netWorth >= 0 ? "text-emerald-600" : "text-red-600"
//                 }`}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       {loading && reports.length < 6 ? (
//         <div className="flex items-center justify-center py-12">
//           <div className="flex items-center space-x-3">
//             <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"></div>
//             <div
//               className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"
//               style={{ animationDelay: "0.1s" }}
//             ></div>
//             <div
//               className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"
//               style={{ animationDelay: "0.2s" }}
//             ></div>
//             <span className="text-slate-600 ml-3">
//               Loading your financial data...
//             </span>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <ExpensePieChart data={expenseData} />
//           <IncomeExpenseBarChart data={reports} />
//         </div>
//       )}
//     </div>
//   );
// }
