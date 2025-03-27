import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Form, Select, message } from "antd";
import { useUser } from "../../context/index";
import { api } from "../../../common/interceptor/index";

const { Option } = Select;

export const AssignDepartmentModal = ({
  isOpen,
  onClose,
  organizationId,
  selectedDepartments = [],
  isUpdateMode = false,
  onEntityUpdated,
}) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
    if (isUpdateMode) {
      form.setFieldsValue({ departments: selectedDepartments });
    }
  }, [isUpdateMode, selectedDepartments]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      setDepartments(response.data);
    } catch (error) {
      message.error("Failed to fetch departments!");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const { departments } = values;
      const orgId = organizationId;

      if (!orgId) {
        message.error("Please select an organization first!");
        return;
      }

      console.log(orgId,departments,"---")

      const url = isUpdateMode
        ? `/organization/${orgId}/update-departments`
        : `/organization/${orgId}/assign-departments`;

      const method = isUpdateMode ? "put" : "post";

      await api[method](url, { departmentIds: departments });

      message.success(
        isUpdateMode ? "Departments updated successfully!" : "Departments assigned successfully!"
      );
      
      onEntityUpdated(); // Refresh data
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(isUpdateMode ? "Failed to update departments!" : "Failed to assign departments!");
    }
  };

  return (
    <Modal
      title={isUpdateMode ? "Update Departments" : "Assign Departments"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Departments" name="departments">
          <Select mode="multiple" placeholder="Select Departments">
            {departments.map((dep) => (
              <Option key={dep.id} value={dep.id}>
                {dep.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isUpdateMode ? "Update" : "Assign"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

