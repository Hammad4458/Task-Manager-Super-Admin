import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { api } from "../../../common/interceptor/index";

const { Option } = Select;

export const AddUserModal = ({ isOpen, onClose, onUserAdded, organizations, departmentId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [role, setRole] = useState("ADMIN"); // Default role

  useEffect(() => {
    if (isOpen) {
      fetchManagers();
      form.resetFields(); // Reset form fields when modal opens
    }
  }, [isOpen]);

  const fetchManagers = async () => {
    try {
      const response = await api.get(`/users/managers/${departmentId}`);
      setManagers(response.data);
    } catch (error) {
      console.error("Failed to fetch managers:", error);
    }
  };

  const handleSubmit = async (formValues) => {
    setLoading(true);
    try {
      console.log("Department ID before merging:", departmentId);
      console.log("Form Values before merging:", formValues);

      if (!departmentId) {
        throw new Error("Department ID is missing!");
      }

      // Construct payload correctly
      const payload = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role,
        department: departmentId,
        organization: formValues.organizationId,
      };

      if (formValues.role === "USER" && formValues.managerId) {
        payload.manager = formValues.managerId;
      }

      console.log("Final Payload:", payload);

      const response = await api.post("/users/create", payload);
      message.success("User created successfully!");

      onUserAdded(response.data);
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to create user.");
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add User" open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{ required: true, message: "Enter a password" }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select onChange={(value) => setRole(value)}>
            <Option value="ADMIN">Admin</Option>
            <Option value="MANAGER">Manager</Option>
            <Option value="USER">User</Option>
          </Select>
        </Form.Item>

        {role === "USER" && (
          <Form.Item name="managerId" label="Assign Manager" rules={[{ required: true, message: "Please select a manager" }]}>
            <Select placeholder="Select Manager">
              {managers.map((mgr) => (
                <Option key={mgr.id} value={mgr.id}>
                  {mgr.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item name="organizationId" label="Organization" rules={[{ required: true, message: "Please select an organization" }]}>
          <Select placeholder="Select Organization">
            {organizations.map((org) => (
              <Option key={org.id} value={org.id}>
                {org.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: "10px" }}>
          Add User
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Form>
    </Modal>
  );
};
