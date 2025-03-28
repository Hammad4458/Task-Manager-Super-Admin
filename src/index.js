import React from "react";
import ReactDOM from "react-dom/client";
import { Login } from "./pages/login/index";
import reportWebVitals from "./reportWebVitals";
import { Navigate} from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { PublicRoute } from "./routes/publicRoutes/index";
import { PrivateRoute } from "./routes/protectedRoutes/index";
import { UserProvider } from "./components/context/index";
import { SuperAdminDashboard } from "./pages/dashboard/index";
import 'antd/dist/reset.css'; 
import { Organizations } from "./pages/organizations/index";
import { Departments } from "./pages/departments/index";
import "./locales/il8n"
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <CookiesProvider>
      <UserProvider>
        <Routes>
          <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/organization" element={<Organizations />} />
          <Route path="/dashboard/department" element={<Departments />} />
          </Route>
        </Routes>
      </UserProvider>
    </CookiesProvider>
  </BrowserRouter>
);

reportWebVitals();
