import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../common/interceptor/index";
import Cookies from "js-cookie";

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return;
  
        if (!userType) {
          console.warn("No userType found, cannot determine API endpoint");
          setLoading(false);
          return;
        }
  
        const response = await api.get("/super-admin/me", { withCredentials: true });
  
        if (response?.data) {
         
          setUser(response.data);
        } else {
          console.error("Received empty user data, setting user to null");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [userType]);
  

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {loading ? <p>Loading user data...</p> : children}
    </UserContext.Provider>
  );
};
