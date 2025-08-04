import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { authCheckCompleted, verifyAuth } from "./store/slices/authSlice";
import AppRoutes from "./routes/routes";
import { TrendingUp } from "lucide-react";

/**
 * The main App component, responsible for orchestrating the initial authentication check before rendering the rest of the application.
 */
export default function App() {
  const dispatch = useAppDispatch();
  const { token, initLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // This effect runs only once when the application first loads.
    if (token) {
      // If a token was found in localStorage (and is now in our initial state),
      // we dispatch `verifyAuth` to validate it and fetch user data.
      dispatch(verifyAuth());
    } else {
      // If no token was found, the authentication check is considered complete.
      dispatch(authCheckCompleted());
    }
  }, [dispatch]); // The empty dependency array ensures this runs only once on mount.

  /**
   * While the initial authentication check is in progress (`initLoading` is true),
   * we render a full-screen loading indicator. This prevents UI flicker and ensures
   * that protected routes are not prematurely rendered.
   */
  if (initLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center animate-spin">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-slate-700">
            FinanceTracker
          </span>
        </div>
        <p className="text-slate-600">Verifying your session...</p>
      </div>
    );
  }

  // Once the initial authentication check is complete, render the main application routes.
  return <AppRoutes />;
}
