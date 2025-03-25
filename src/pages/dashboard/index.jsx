import React, { useEffect, useState } from "react";
import { Header} from "../../components/buttons/header/index";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/index.jsx";
import { Table, Button , Input , Cascader } from "antd";
import { api } from "../../common/interceptor/index";
import { AddUserModal } from "../../components/modals/add-user-modal/index"; // Import modal

import "./dashboard.css";

export const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizations,setOrganizations] = useState([]);
  const [departments,setDepartments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ role: null, organization: null, department: null });

  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    fetchAllUser();
  }, [filters, searchTerm]);

  const fetchAllUser = async () => {
    const params = {
      role: filters.role,
      organization: filters.organization,
      department: filters.department,
      search: searchTerm || undefined, 
    };

    try {
      const response = await api.get("/users",{params});
      setUsers(response.data);
      const org = await api.get("/organization");
      setOrganizations(org.data);
      console.log("org",organizations);
      const dep = await api.get("/department");
      setDepartments(dep.data);
      console.log("org",departments);
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
      render: (department) => department?.name || "N/A" 
    },
    { 
      title: "Organization", 
      dataIndex: "organization", 
      key: "organization", 
      render: (organization) => organization?.name || "N/A" 
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

  const handleFilterChange = (value, selectedOptions) => {
    console.log(value[0],value[1],value[2],"edededede");
    setFilters({
      role: value[0] || null,
      organization: value[1] || null,
      department: value[2] || null,
    });
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
      children:
        departments.map((dep)=>({
        value:dep.id,
        label:dep.name,
      })),
    },
    {
      value: "organization",
      label: "Organization",
      children:
         organizations.map((org)=>({
        value:org.id,
        label:org.name,
         
      })),
    
    }
  ];

  return (
    <>
      <Header />
      
      <div className="dashboard-container">
        <h1>Main Page</h1>
        <div className="button-container">
          <button onClick={() => navigate("/superAdmin/organization")} className="org-button">
            Organizations
          </button>
          <button onClick={() => navigate("/superAdmin/department")} className="dept-button">
            Departments
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
