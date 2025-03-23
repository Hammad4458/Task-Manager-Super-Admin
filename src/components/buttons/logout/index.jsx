// src/components/LogoutButton.js
import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "antd"; // Import Ant Design Button
import { LogoutOutlined } from "@ant-design/icons"; // Import Logout Icon
import "./logout.css"; // Import CSS file

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token"); // Remove token from cookies
    navigate("/login", { replace: true }); // Redirect to login page
  };

  return (
    <Button 
      type="primary" 
      danger 
      icon={<LogoutOutlined />} 
      className="logout-button"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};
