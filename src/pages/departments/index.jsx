import React, { useState, useEffect } from "react";
import { Table, Button, Spin, message } from "antd";
import { CreateOrgDepModal } from "../../components/modals/dep-org-modal/index.jsx";
import { api } from "../../common/interceptor/index.jsx";
import { Header } from "../../components/buttons/header/index.jsx";
import { UpdateNameModal } from "../../components/modals/change-name-modal/index.jsx";
import { useTranslation } from "react-i18next";
import "./departments.css";

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameModal,setNameModal] = useState(false);
  const [selectItem,setSelectedItem] = useState({})
  const { t } = useTranslation();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      message.error("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentCreated = (newDep) => {
    setDepartments([...departments, newDep]);
    
  };

  const handleName = (depId, depName) => {
    setSelectedItem(() => {
      const newItem = { id: depId, name: depName };
      console.log(newItem, "Updated selectedItem"); // Logs the new value immediately
      return newItem;
    });
    setNameModal(true);
    fetchDepartments();
  };

  const columns = [
    {
      title: "Department",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Organization",
      dataIndex: "organizations",
      key: "organizations",
      render: (organizations) =>
        organizations?.length > 0
          ? organizations.map((org) => org.name).join(", ")
          : "No organizations assigned",
    },

    {
      title: "Users",
      dataIndex: "users",
      key: "users",
      render: (users) =>
        users?.length > 0
          ? users.map((user) => user.name).join(", ")
          : "No users assigned",
    },
    {
          title: "Action",
          dataIndex: "action",
          render: (_, record) => (
            <div className="dep-action">
              <Button type="default" onClick={() => handleName(record.id,record.name)}>
                {t("Update")}
              </Button>
              
            </div>
          ),
        },
  ];

  return (
    <>
      <Header />
      <div className="departments-page">
        <h1>{t("dep")}</h1>
        <div className="create-dept-button-container">
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            {t("create-dep")}
          </Button>
        </div>

        {/* Reusable Modal for Creating Departments */}
        <CreateOrgDepModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type="department"
          onEntityCreated={handleDepartmentCreated}
        />

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={departments}
            columns={columns}
            rowKey="id"
            bordered
            className="dep-table"
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          />
        )}
      </div>

      {nameModal && (
        <UpdateNameModal
          isOpen={nameModal}
          onClose={() => setNameModal(false)}
          entityId={selectItem.id}
          entityType="department"
          currentName={selectItem.name}
          onEntityUpdated={fetchDepartments}
        />
      )} 
    </>
  );
};
