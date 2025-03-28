import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Form, Select, message } from "antd";
import { useUser } from "../../context/index";
import { api } from "../../../common/interceptor/index";
import { useTranslation } from "react-i18next";

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
  const superAdminId = user?.id;
  const {t} =useTranslation();
  



  useEffect(() => {
    if (type === "department") {
      fetchOrganizations();
    }
  }, [type]);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organization");
      setOrganizations(response.data);
      
    } catch (error) {
      message.error("Failed to fetch organizations!");
    }
  };

  const handleCreateEntity = async (values) => {
    try {
      let data = { name: values.name ,superAdmin: superAdminId };

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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("create")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
