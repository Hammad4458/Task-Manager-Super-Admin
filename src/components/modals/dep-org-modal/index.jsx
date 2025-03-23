import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Form, Select, message } from "antd";
import { useUser } from "../../context/index";
import { api } from "../../../common/interceptor/index";

const { Option } = Select;

export const CreateOrgDepModal = ({
  isOpen,
  onClose,
  type,
  onEntityCreated,
}) => {
  const [form] = Form.useForm();
  const [organizations, setOrganizations] = useState([]);
  const {user}=useUser();
  const superAdminId = user.id;
  console.log(superAdminId);

  console.log("Modal:",user);

  useEffect(() => {
    if (type === "department") {
      fetchOrganizations();
    }
  }, [type]);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organization");
      setOrganizations(response.data);
      console.log(organizations);
    } catch (error) {
      message.error("Failed to fetch organizations!");
    }
  };

  const handleCreateEntity = async (values) => {
    try {
      let data = { name: values.name ,superAdmin: superAdminId };

      if (type === "department") {
        data.organizations = values.organizations; // Include assigned organizations
      }
      console.log(data);

      const endpoint =
        type === "organization" ? "/organization/create" : "/department/create";
      const response = await api.post(endpoint, data);

      message.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`
      );
      onEntityCreated(response.data);
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(`Failed to create ${type}!`);
    }
  };

  return (
    <Modal
      title={`Create ${type.charAt(0).toUpperCase() + type.slice(1)}`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleCreateEntity}>
        {/* Name Field */}
        <Form.Item
          label={`${type.charAt(0).toUpperCase() + type.slice(1)} Name`}
          name="name"
          rules={[{ required: true, message: `Please enter ${type} name` }]}
        >
          <Input placeholder={`Enter ${type} name`} />
        </Form.Item>

        {/* Assign Organization - Only for Departments */}
        {type === "department" && (
          <Form.Item
            label="Assign Organization"
            name="organizations"
            rules={[
              {
                required: true,
                message: "Please select at least one organization",
              },
            ]}
          >
            <Select mode="multiple" placeholder="Select organizations">
              {organizations.map((org) => (
                <Option key={org.id} value={org.id}>
                  {org.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
