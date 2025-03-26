import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export const PublicRoute = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(Cookies.get("token"));
  }, []);

  if (token === null) return null; // Prevent flashing

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};