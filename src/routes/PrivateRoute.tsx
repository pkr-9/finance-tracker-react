import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const user = useAppSelector((state) => state.auth.user);

  return user ? children : <Navigate to="/login" replace />;
}
