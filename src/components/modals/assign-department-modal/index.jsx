import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Select, message } from "antd";
import { useTranslation } from "react-i18next";
import { api } from "../../../common/interceptor/index";

const { Option } = Select;

export const AssignDepartmentModal = ({ isOpen, onClose, organizationId, assignedDepartments, onEntityUpdated }) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ departments: assignedDepartments });
    }
  }, [isOpen, assignedDepartments, form]);

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
      if (!organizationId) {
        message.error("Please select an organization first!");
        return;
      }

      await api.put(`/organization/${organizationId}/update-departments`, { departmentIds: values.departments });

      message.success("Departments assigned/updated successfully!");
      onEntityUpdated();
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to update departments!");
    }
  };

  return (
    <Modal title="Assign Departments" open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={t("dep")} name="departments">
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
            Assign
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
