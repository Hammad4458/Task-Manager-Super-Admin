import React, { useEffect, useState } from "react";
import { LogoutButton } from "../../components/buttons/logout/index";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/index.jsx";
import { Table, Button } from "antd";
import { api } from "../../common/interceptor/index";
import { AddUserModal } from "../../components/modals/add-user-modal/index"; // Import modal

import "./dashboard.css";

export const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    fetchAllUser();
  }, []);

  const fetchAllUser = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

 

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    { 
      title: "Department", 
      dataIndex: "department", 
      key: "department", 
      render: (department) => department?.name || "N/A" 
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => openEditModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <LogoutButton />
      <div className="dashboard-container">
        <h1>Main Page</h1>
        <div className="button-container">
          <button onClick={() => navigate("/superAdmin/organization")} className="org-button">
            Organizations
          </button>
          <button onClick={() => navigate("/superAdmin/department")} className="dept-button">
            Departments
          </button>
        </div>
        <div className="add-user-button">
          <Button type="primary" onClick={openAddModal}>
            Add User
          </Button>
        </div>
        <Table 
          dataSource={users} 
          columns={columns}
          pagination={{ pageSize: 5, position: ["bottomCenter"] }} 
          rowKey={(record) => record.id} 
          className="user-table"
        />

        <AddUserModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onUserAdded={fetchAllUser} 
          onUserUpdated={fetchAllUser} 
          userToEdit={selectedUser} 
        />
      </div>
    </>
  );
};
