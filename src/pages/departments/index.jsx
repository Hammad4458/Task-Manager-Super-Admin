import React, { useState, useEffect } from "react";
import { Table, Button, Spin, message } from "antd";
import { CreateOrgDepModal } from "../../components/modals/dep-org-modal/index.jsx";
import { api } from "../../common/interceptor/index.jsx";
import {Header } from "../../components/buttons/header/index.jsx";
import "./departments.css";

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      message.error("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentCreated = (newDep) => {
    setDepartments([...departments, newDep]);
  };

  const columns = [
    {
      title: "Department",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Organization",
      dataIndex: "organizations",
      key: "organizations",
      render: (organizations) =>
        organizations?.length > 0
          ? organizations.map((org) => org.name).join(", ")
          : "No organizations assigned",
    },
   
    {
      title: "Users",
      dataIndex: "users",
      key: "users",
      render: (users) =>
        users?.length > 0 ? users.map((user) => user.name).join(", ") : "No users assigned",
    },
  ];

  return (
    <>
      <Header />
      <div className="departments-page">
        <h1>Departments</h1>
        <div className="create-dept-button-container">
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Create Department
          </Button>
        </div>

        {/* Reusable Modal for Creating Departments */}
        <CreateOrgDepModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type="department"
          onEntityCreated={handleDepartmentCreated}
        />

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={departments}
            columns={columns}
            rowKey="id"
            bordered
            className="dep-table"
            pagination={{ pageSize: 5, position: ["bottomCenter"] }} 
          />
        )}
      </div>
    </>
  );
};
