import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { api } from "../../../common/interceptor/index";
import { useTranslation } from "react-i18next";
import "./add-user-modal.css"

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
  const {t} = useTranslation()
  

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      fetchOrganizations();
  
      if (departments.length === 0) {
        fetchDepartments();
      }
  
      if (userToEdit) {
        setTimeout(() => {
          form.setFieldsValue({
            name: userToEdit.name || "",
            email: userToEdit.email || "",
            role: userToEdit.role || "",
            organizationId: userToEdit.organization?.id || undefined,
            departmentId: userToEdit.department?.name || undefined,
            managerId: userToEdit.manager?.id || undefined,
          });
  
          setSelectedRole(userToEdit.role);
        }, 0);
  
        if (userToEdit.department?.id) {
          fetchManagers(userToEdit.department.id); // Fetch managers for the selected department in edit mode
        }
      } else {
        setSelectedRole(null);
        setFilteredDepartments([]);
        setManagers([]);
      }
    }
  }, [isOpen, userToEdit]);
  

  
  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organization");
      setOrganizations(response.data);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      
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

  const handleOrganizationChange = (organizationId) => {
    

    const relatedDepartments = departments.filter((dep) =>
      dep.organizations.some((org) => org.id === organizationId)
    );

    
    setFilteredDepartments(relatedDepartments);
    form.setFieldsValue({ departmentId: undefined, managerId: undefined });
    setManagers([]);
  };

  const handleDepartmentChange = (departmentId) => {
    form.setFieldsValue({ managerId: undefined });
    fetchManagers(departmentId);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role !== "USER") {
      form.setFieldsValue({ managerId: undefined });
    }
  };

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
    className="add-user-modal"
    title={userToEdit ? "Edit User" : "Add User"}
    open={isOpen}
    onCancel={onClose}
    footer={null}
    modalRender={(modal) => (
      <div className="modal-wrapper">
        {modal}
      </div>
    )}
  >
    <div className="modal-content">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Scrollable Body */}
        <div className="modal-body">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item
            name="email"
            label={t("email")}
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input />
          </Form.Item>
  
          {!userToEdit && (
            <Form.Item
              name="password"
              label={t("password")}
              rules={[{ required: true, message: "Please enter a password" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
  
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select onChange={handleRoleChange}>
              <Option value="ADMIN">{t("admin")}</Option>
              <Option value="MANAGER">{t("manager")}</Option>
              <Option value="USER">{t("user")}</Option>
            </Select>
          </Form.Item>
  
          <Form.Item
            name="organizationId"
            label={t("org")}
            rules={[{ required: true, message: "Select an organization" }]}
          >
            <Select onChange={handleOrganizationChange} placeholder="Select Organization">
              {organizations.map((org) => (
                <Option key={org.id} value={org.id}>
                  {org.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
  
          <Form.Item
            name="departmentId"
            label={t("dep")}
            rules={[{ required: true, message: "Select a department" }]}
          >
            <Select onChange={handleDepartmentChange} placeholder="Select Department">
              {filteredDepartments.map((dep) => (
                <Option key={dep.id} value={dep.id}>
                  {dep.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
  
          {selectedRole === "USER" && (
            <Form.Item
              name="managerId"
              label={t("manager")}
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
        </div>
  
        {/* Fixed Footer */}
        <div className="modal-footer">
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: "10px" }}>
            {userToEdit ? "Update User" : "Add User"}
          </Button>
          <Button onClick={onClose}>{t("cancel")}</Button>
        </div>
      </Form>
    </div>
  </Modal>
  
  );
};
