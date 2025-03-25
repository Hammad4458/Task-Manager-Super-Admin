import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { api } from "../../../common/interceptor/index";

const { Option } = Select;

export const AddUserModal = ({
  isOpen,
  onClose,
  onUserAdded,
  onUserUpdated,
  userToEdit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (isOpen) {
      form.resetFields();

      fetchOrganizations();

      if (departments.length === 0) {
        // Fetch only if not already loaded
        fetchDepartments();
      }

      if (userToEdit) {
        setTimeout(() => {
          form.setFieldsValue({
            name: userToEdit.name || "",
            email: userToEdit.email || "",
            role: userToEdit.role || "",
            organizationId: userToEdit.organization?.name || undefined,
            departmentId: userToEdit.department?.name || undefined,
            managerId: userToEdit.manager?.name || undefined,
          });
        }, 0);

        setSelectedRole(userToEdit.role);
      } else {
        setSelectedRole(null);
        setFilteredDepartments([]);
        setManagers([]);
      }
    }
  }, [isOpen, userToEdit]); // Removed `departments` to prevent infinite re-fetching

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organization");
      setOrganizations(response.data);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      console.log("Fetched departments:", response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  // Fetch managers for a specific department
  const fetchManagers = async (depId) => {
    try {
      if (!depId) return;
      const response = await api.get(`/users/managers/${depId}`);
      setManagers(response.data);
    } catch (error) {
      console.error("Failed to fetch managers:", error);
    }
  };

  // Handle Organization Selection
  const handleOrganizationChange = (organizationId) => {
    console.log("Organization ID selected:", organizationId);

    const relatedDepartments = departments.filter((dep) =>
      dep.organizations.some((org) => org.id === organizationId)
    );

    console.log("Filtered departments:", relatedDepartments);
    setFilteredDepartments(relatedDepartments);
    form.setFieldsValue({ departmentId: undefined, managerId: undefined });
    setManagers([]);
  };

  // Handle Department Selection
  const handleDepartmentChange = (departmentId) => {
    form.setFieldsValue({ managerId: undefined });
    fetchManagers(departmentId);
  };

  // Handle Role Change
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role !== "USER") {
      form.setFieldsValue({ managerId: undefined });
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values };

      if (userToEdit) {
        await api.patch(`/users/${userToEdit.id}`, payload);
        message.success("User updated successfully!");
        onUserUpdated();
      } else {
        await api.post("/users/create", payload);
        message.success("User created successfully!");
        onUserAdded();
      }

      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to save user.");
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={userToEdit ? "Edit User" : "Add User"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        {!userToEdit && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select onChange={handleRoleChange}>
            <Option value="ADMIN">Admin</Option>
            <Option value="MANAGER">Manager</Option>
            <Option value="USER">User</Option>
          </Select>
        </Form.Item>

        {/* Organization Select */}
        <Form.Item
          name="organizationId"
          label="Organization"
          rules={[{ required: true, message: "Select an organization" }]}
        >
          <Select
            onChange={handleOrganizationChange}
            placeholder="Select Organization"
          >
            {organizations.map((org) => (
              <Option key={org.id} value={org.id}>
                {org.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Department Select */}
        <Form.Item
          name="departmentId"
          label="Department"
          rules={[{ required: true, message: "Select a department" }]}
        >
          <Select
            onChange={handleDepartmentChange}
            placeholder="Select Department"
          >
            {filteredDepartments.map((dep) => (
              <Option key={dep.id} value={dep.id}>
                {dep.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Show Manager Field Only If Role is "USER" */}
        {selectedRole === "USER" && (
          
          <Form.Item
            name="managerId"
            label="Manager"
            rules={[{ required: true, message: "Select a manager" }]}
          >
            <Select placeholder="Select Manager">
              {managers.map((manager) => (
                <Option key={manager.id} value={manager.id}>
                  {manager.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ marginRight: "10px" }}
        >
          {userToEdit ? "Update User" : "Add User"}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Form>
    </Modal>
  );
};
