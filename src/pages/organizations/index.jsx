import React, { useState, useEffect } from "react";
import { Table, Button, Spin, message } from "antd";
import { CreateOrgDepModal } from "../../components/modals/dep-org-modal/index.jsx";
import { Header } from "../../components/buttons/header/index.jsx";
import { api } from "../../common/interceptor/index.jsx";
import "./organization.css";

export const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organization");
      setOrganizations(response.data);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      message.error("Failed to load organizations.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationCreated = (newOrg) => {
    setOrganizations([...organizations, newOrg]);
  };

  const columns = [
    {
      title: "Organization Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Department",
      dataIndex: "departments",
      key: "departments",
      render: (departments) =>
        departments?.length > 0
          ? departments.map((dep) => dep.name).join(", ")
          : "No departments assigned",
    },
    {
      title: "SuperAdmin",
      dataIndex: "superAdmins",
      key: "superAdmins",
      render: (superAdmins) =>
        superAdmins?.length > 0
          ? superAdmins.map((admin) => admin.name).join(", ")
          : "No superAdmins assigned",
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
      <div className="organizations-page">
        <h1>Organizations</h1>
        <div className="create-org-button-container">
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Create Organization
          </Button>
        </div>

        {/* Reusable Modal for Creating Organizations */}
        <CreateOrgDepModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type="organization"
          onEntityCreated={handleOrganizationCreated}
        />

        {/* Ant Design Table */}
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={organizations}
            columns={columns}
            rowKey="id"
            bordered
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
            className="org-table"
          />
        )}
      </div>
    </>
  );
};
