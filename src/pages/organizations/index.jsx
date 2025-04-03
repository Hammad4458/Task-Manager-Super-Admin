import React, { useState, useEffect } from "react";
import { Table, Button, Spin, message } from "antd";
import { CreateOrgDepModal } from "../../components/modals/dep-org-modal/index.jsx";
import { Header } from "../../components/buttons/header/index.jsx";
import { api } from "../../common/interceptor/index.jsx";
import { AssignDepartmentModal } from "../../components/modals/assign-department-modal/index.jsx";
import { UpdateNameModal } from "../../components/modals/change-name-modal/index.jsx";
import { useTranslation } from "react-i18next";
import "./organization.css";

export const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [orgId, setOrgId] = useState(null);
  const [assignedDepartments, setAssignedDepartments] = useState([]);
  const [assignModal, setAssignModal] = useState(false);
  const [nameModal,setNameModal] = useState(false);
  const [selectItem,setSelectedItem] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organization");
      setOrganizations(response.data);
    } catch (error) {
      message.error("Failed to load organizations.");
    }
  };

  const handleAssign = (id, departments = []) => {
    setOrgId(id);
    setAssignedDepartments(departments.map((dep) => dep.id)); // Store assigned department IDs
    setAssignModal(true);
  };

  const handleOrganizationCreated = (newOrg) => {
    setOrganizations([...organizations, newOrg]);
  };

  const handleName = (depId, depName) => {
    setSelectedItem(() => {
      const newItem = { id: depId, name: depName };
      console.log(newItem, "Updated selectedItem"); // Logs the new value immediately
      return newItem;
    });
    setNameModal(true);
  };
  

  const columns = [
    {
      title: "Organization Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Department",
      dataIndex: "departments",
      key: "departments",
      render: (departments) =>
        departments?.length > 0
          ? departments.map((dep) => dep.name).join(", ")
          : "No departments assigned",
    },
    {
      title: "Users",
      dataIndex: "departments",
      key: "users",
      render: (departments) => {
        if (!departments || departments.length === 0) {
          return "No users assigned";
        }
        const users = [
          ...new Set(departments.flatMap((dep) => dep.users?.map((user) => user.name) || [])),
        ];
        return users.length > 0 ? users.join(", ") : "No users assigned";
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="org-action">
          <Button type="primary" onClick={() => handleAssign(record.id, record.departments)}>
            {t("assign")}
          </Button>
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
      <div className="organizations-page">
        <h1>{t("org")}</h1>
        <div className="create-org-button-container">
          <Button type="primary" onClick={() => setAssignModal(true)}>
            Create Organization
          </Button>
        </div>

        <CreateOrgDepModal isOpen={assignModal} onClose={() => setAssignModal(false)} type="organization" onEntityCreated={handleOrganizationCreated} />

        {organizations.length === 0 ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Table dataSource={organizations} columns={columns} rowKey="id" bordered pagination={{ pageSize: 5, position: ["bottomCenter"] }} className="org-table" />
        )}
      </div>

      {assignModal && (
        <AssignDepartmentModal
          isOpen={assignModal}
          onClose={() => setAssignModal(false)}
          organizationId={orgId}
          assignedDepartments={assignedDepartments} // Pass assigned departments
          onEntityUpdated={fetchOrganizations}
        />
      )}

      {nameModal && (
        <UpdateNameModal 
        isOpen={nameModal}
        onClose={()=>setNameModal(false)}
        entityId={selectItem?.id}
        entityType="organization"
        currentName={selectItem?.name}
        onEntityUpdated={fetchOrganizations}
        
        />
      )}
    </>
  );
};
