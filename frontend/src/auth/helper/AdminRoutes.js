import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./index";

const AdminRoutes = ({ component: Component, ...rest }) => {
  return isAuthenticated() && isAuthenticated().prosumer.role === 1 ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default AdminRoutes;
