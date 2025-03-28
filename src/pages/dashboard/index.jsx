import React, { useEffect, useState } from "react";
import { Header } from "../../components/buttons/header/index";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/index.jsx";
import { Table, Button, Input, Cascader } from "antd";
import { api } from "../../common/interceptor/index";
import { AddUserModal } from "../../components/modals/add-user-modal/index"; // Import modal
import { useTranslation } from "react-i18next";
import "./dashboard.css";

export const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: null,
    organization: null,
    department: null,
  });

  const navigate = useNavigate();
  const { user } = useUser();
  const {t} = useTranslation();

  useEffect(() => {
    fetchAllUser();
  }, [filters, searchTerm]);

  const fetchAllUser = async () => {
    let params = Object.fromEntries(
      Object.entries({
        role: filters.role,
        organization: filters.organization,
        department: filters.department,
        name: searchTerm || undefined,
      }).filter(([_, v]) => v != null) 
    );

    try {
      const response = await api.get("/users?", { params });
      setUsers(response.data);
      const org = await api.get("/organization");
      setOrganizations(org.data);
      const dep = await api.get("/department");
      setDepartments(dep.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (department) => department?.name || "N/A",
    },
    {
      title: "Organization",
      dataIndex: "organization",
      key: "organization",
      render: (organization) => organization?.name || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => openEditModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (values) => {
    const filterObj = {
      role: null,
      organization: null,
      department: null,
    };
  
    values.forEach(([category, selectedValue]) => {
      if (category in filterObj) {
        filterObj[category] = selectedValue;
      }
    });
  
    setFilters(filterObj);
  };
  
  const cascaderOptions = [
    {
      value: "role",
      label: "Role",
      children: [
        { value: "ADMIN", label: "Admin" },
        { value: "MANAGER", label: "Manager" },
        { value: "USER", label: "User" },
      ],
    },
    {
      value: "department",
      label: "Department",
      children: departments.map((dep) => ({
        value: dep.name,
        label: dep.name,
      })),
    },
    {
      value: "organization",
      label: "Organization",
      children: organizations.map((org) => ({
        value: org.name,
        label: org.name,
      })),
    },
  ];

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <h1>{t("mainPage")}</h1>
        <div className="button-container">
          <button
            onClick={() => navigate("/dashboard/organization")}
            className="org-button"
          >
            {t("org")}
          </button>
          <button
            onClick={() => navigate("/dashboard/department")}
            className="dept-button"
          >
            {t("dep")}
          </button>
        </div>

        <div className="filter-container">
          <Input
            placeholder="Search by Name"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 200, marginRight: 10 }}
          />

          <Cascader
            options={cascaderOptions}
            onChange={handleFilterChange}
            placeholder="Filter by Role, Organization, Department"
            style={{ width: 300 }}
            multiple // Enable selecting multiple categories
            maxTagCount="responsive"
          />
        </div>

        <div className="add-user-button">
          <Button type="primary" onClick={openAddModal}>
            Add User
          </Button>
        </div>
        <Table
          dataSource={users}
          columns={columns}
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          rowKey={(record) => record.id}
          className="user-table"
        />

        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUserAdded={fetchAllUser}
          onUserUpdated={fetchAllUser}
          userToEdit={selectedUser}
        />
      </div>
    </>
  );
};
