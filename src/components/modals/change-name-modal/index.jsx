import React, { useEffect } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { api } from "../../../common/interceptor/index";
import { useTranslation } from "react-i18next";

export const UpdateNameModal = ({ isOpen, onClose, entityId, entityType, currentName, onEntityUpdated }) => {
  const [form] = Form.useForm();
  const {t} = useTranslation()

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ name: currentName }); 
    }
  }, [isOpen, currentName, form]);

  const handleSubmit = async (values) => {
    try {
      if (!entityId) {
        message.error("Invalid entity selected!");
        return;
      }

      const endpoint =
        entityType === "organization"
          ? `/organization/${entityId}/update-name`
          : `/department/${entityId}/update-name`;

      await api.put(endpoint, { name: values.name });

      message.success(`${entityType} updated successfully!`);
      onEntityUpdated(); 
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(`Failed to update ${entityType}!`);
    }
  };

  return (
    <Modal title={`Update ${entityType}`} open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required!" }]}>
          <Input placeholder={`Enter new ${entityType} name`} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("update")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
