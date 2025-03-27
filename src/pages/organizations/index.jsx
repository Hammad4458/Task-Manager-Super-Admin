import React, { useState, useEffect } from "react";
import { Table, Button, Spin, message } from "antd";
import { CreateOrgDepModal } from "../../components/modals/dep-org-modal/index.jsx";
import { Header } from "../../components/buttons/header/index.jsx";
import { api } from "../../common/interceptor/index.jsx";
import { AssignDepartmentModal } from "../../components/modals/assign-department-modal/index.jsx";
import "./organization.css";

export const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [orgId, setOrgId] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]); 
  const [isUpdateMode, setIsUpdateMode] = useState(false); 


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

  const handleAssign = (id) => {
    setOrgId(id); // Ensure only the ID is stored
    setAssignModal(true);
  };

  const handleUpdate = (id, assignedDepartments) => {
    setOrgId(id);
    setSelectedDepartments(assignedDepartments.map(dep => dep.id)); // Preload selected departments
    setAssignModal(true);
    setIsUpdateMode(true);
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
    title: "Users",
    dataIndex: "departments",  // Fetching users from departments
    key: "users",
    render: (departments) => {
      if (!departments || departments.length === 0) {
        return "No users assigned";
      }

      // Extract users from all departments and remove duplicates
      const users = [
        ...new Set(departments.flatMap((dep) => dep.users?.map(user => user.name) || []))
      ];

      return users.length > 0 ? users.join(", ") : "No users assigned";
    },
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (_, record) => (
      <div className="org-action" >
        <Button type="primary" onClick={() => handleAssign(record.id)}>
          Assign
        </Button>
        <Button
          type="default"
          onClick={() => handleUpdate(record.id, record.departments)}
        >
          Update
        </Button>
      </div>
    ),
  }
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

      {assignModal && (
      <AssignDepartmentModal
        isOpen={assignModal}
        onClose={() => setAssignModal(false)}
        organizationId={orgId}
        selectedDepartments={selectedDepartments}
        isUpdateMode={isUpdateMode}
        onEntityUpdated={fetchOrganizations}
      />
    )}
    </>
  );
};
