// // src/components/auth/AuthHandler.tsx
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useGetProfileQuery } from "../../api/apiSlice";
// import {
//   setCredentials,
//   logout,
//   selectCurrentToken,
// } from "../../store/slices/authSlice";
// import AppRoutes from "../../routes/routes";
// import { TrendingUp } from "lucide-react";

// const AuthHandler = () => {
//   const dispatch = useDispatch();
//   const token = useSelector(selectCurrentToken);

//   // Use the getProfile query, but skip it if there's no token.
//   const {
//     data: userProfile,
//     isSuccess,
//     isError,
//     isLoading,
//   } = useGetProfileQuery(undefined, {
//     skip: !token,
//   });

//   useEffect(() => {
//     if (isSuccess && userProfile) {
//       // If the profile fetch is successful, set the credentials in the store.
//       // The backend returns 'username', so we map it to 'name'.
//       const user = {
//         id: userProfile.id,
//         name: userProfile.username,
//         email: userProfile.email,
//       };
//       dispatch(setCredentials({ user, token: token! }));
//     } else if (isError) {
//       // If the token is invalid or the API call fails, log the user out.
//       dispatch(logout());
//     }
//   }, [isSuccess, isError, userProfile, token, dispatch]);

//   // Show a loading screen while checking authentication status
//   if (isLoading && token) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//         <div className="flex items-center space-x-3 mb-4">
//           <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center animate-spin">
//             <TrendingUp className="w-6 h-6 text-white" />
//           </div>
//           <span className="text-xl font-semibold text-slate-700">
//             FinanceTracker
//           </span>
//         </div>
//         <p className="text-slate-600">Verifying your session...</p>
//       </div>
//     );
//   }

//   // Once authentication check is complete, render the main application routes.
//   return <AppRoutes />;
// };

// export default AuthHandler;
