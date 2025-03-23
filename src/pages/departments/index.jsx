import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { CreateOrgDepModal } from "../../components/modals/dep-org-modal/index.jsx";
import { AddUserModal } from "../../components/modals/add-user-modal/index.jsx";
import { api } from "../../common/interceptor/index.jsx";
import { LogoutButton } from "../../components/buttons/logout/index.jsx";
import "./departments.css";

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null); // Track selected department for user addition

 
  useEffect(() => {
    fetchDepartments();
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentCreated = (newDep) => {
    setDepartments([...departments, newDep]);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
    <LogoutButton />
    <div className="departments-page">
      {/* Create Department Button */}
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

      {/* Table for Departments */}
      <table className="departments-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Organization</th>
            <th>SuperAdmin</th>
            <th>Users</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep.id}>
              <td>{dep.name}</td>
              <td>
                {dep.organizations?.length > 0
                  ? dep.organizations.map((org) => org.name).join(", ")
                  : "No organizations assigned"}
              </td>
              <td>{dep.superAdmin?.name || "No SuperAdmin assigned"}</td>
              <td>
                {dep.users?.map((user) => user.name).join(", ") ??
                  "No users assigned"}
              </td>
              <td>
                <Button
                  type="primary"
                  onClick={() =>  {
                   
                    setSelectedDepartment(dep)
                    console.log("asdsadsaasdsad",dep) }}
                >
                  Add User
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      {selectedDepartment && (
  <AddUserModal
    key={selectedDepartment.id} // Force re-render
    isOpen={!!selectedDepartment}
    onClose={() => setSelectedDepartment(null)}
    organizations={selectedDepartment?.organizations || []}
    departmentId={selectedDepartment?.id}
    onUserAdded={(newUser) => {
      console.log("New User Added:", newUser);
      const updatedDepartments = departments.map((dep) =>
        dep.id === selectedDepartment.id
          ? { ...dep, users: [...(dep.users || []), { ...newUser, departmentId: dep.id }] }
          : dep
      );
      setDepartments(updatedDepartments);
    }}
  />
)}

    </div>
    </>
  );
};
