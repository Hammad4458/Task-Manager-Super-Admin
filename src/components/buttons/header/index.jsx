// src/components/LogoutButton.js
import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "antd"; // Import Ant Design Button
import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons"; // Import Logout Icon
import "./header.css"; // Import CSS file

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token"); // Remove token from cookies
    navigate("/login", { replace: true }); // Redirect to login page
  };

  return (
    <div className="header-container">
      <Button
        icon={<ArrowLeftOutlined />}
        className="back-button"
        type="primary"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};
