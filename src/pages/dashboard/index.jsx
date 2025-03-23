import React from 'react';
import {LogoutButton} from "../../components/buttons/logout/index"
import { useNavigate } from "react-router-dom";
import './dashboard.css'; 

export const SuperAdminDashboard = () => {
    const navigate = useNavigate();

    const handleOrg=()=>{
        navigate("/superAdmin/organization");
    }

    const handleDep=()=>{
        navigate("/superAdmin/department");
    }


  return (
    <>
    <LogoutButton />
    <div className="dashboard-container">
      <h1>Main Page</h1>
      <div className="button-container">
        
          <button onClick={handleOrg} className="org-button">Organizations</button>
        
        
          <button onClick={handleDep} className="dept-button">Departments</button>
        
      </div>
    </div>
    </>
  );
};