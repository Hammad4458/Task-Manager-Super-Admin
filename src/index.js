import React from "react";
import ReactDOM from "react-dom/client";
import { Login } from "./pages/login/index";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { PublicRoute } from "./routes/publicRoutes/index";
import { PrivateRoute } from "./routes/protectedRoutes/index";
import { UserProvider } from "./components/context/index";
import { SuperAdminDashboard } from "./pages/dashboard/index";
import 'antd/dist/reset.css'; 
import { Organizations } from "./pages/organizations/index";
import { Departments } from "./pages/departments/index";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <CookiesProvider>
      <UserProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoute />}>
          <Route path="/superAdmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superAdmin/organization" element={<Organizations />} />
          <Route path="/superAdmin/department" element={<Departments />} />
          </Route>
        </Routes>
      </UserProvider>
    </CookiesProvider>
  </BrowserRouter>
);

reportWebVitals();
