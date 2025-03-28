
import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "antd"; 
import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons"; 
import { useTranslation } from "react-i18next";
import "./header.css"; 

export const Header = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const handleLogout = () => {
    Cookies.remove("token"); 
    navigate("/login", { replace: true }); 
  };

  return (
    <div className="header-container">
      <Button
        icon={<ArrowLeftOutlined />}
        className="back-button"
        type="primary"
        onClick={() => navigate(-1)}
      >
        {t("back")}
      </Button>
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        className="logout-button"
        onClick={handleLogout}
      >
        {t("logout")}
      </Button>
    </div>
  );
};
