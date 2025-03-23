import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { CreateOrgDepModal } from "../../components/modals/dep-org-modal/index.jsx";
import { LogoutButton } from "../../components/buttons/logout/index.jsx";
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
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationCreated = (newOrg) => {
    setOrganizations([...organizations, newOrg]);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
    <LogoutButton />
    <div className="organizations-page">
      {/* Create Organization Button */}
      <div className="create-org-button-container">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create Organization
        </Button>
      </div>

      {/* Reusable Modal for Creating Organizations */}
      <CreateOrgDepModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type="organization" onEntityCreated={handleOrganizationCreated} />

      {/* Table for Organizations */}
      <table className="organizations-table">
        <thead>
          <tr>
            <th>Organization Name</th>
            <th>Department</th>
            <th>SuperAdmin</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org.id}>
              <td>{org.name}</td>
              <td>{org.departments?.length > 0 ? org.departments?.map((dep) => dep.name).join(", ") : "No departments assigned"}</td>
              <td>{org.superAdmins?.length > 0 ? org.superAdmins?.map((admin) => admin.name).join(", ") : "No superAdmins assigned"}</td>
              <td>{org.users?.length > 0 ? org.users.map((user)=>user.name).join(", ") : "No users assigned"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};
