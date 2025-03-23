import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../common/interceptor/index";
import { useUser } from "../../components/context/index";
import { useNavigate } from "react-router-dom";
import { Button, Radio } from "antd";
import 'antd/dist/reset.css';
import { z } from "zod";
import { useState } from "react";
import "./login.css"; 

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Login = () => {
  const [userType, setUserType] = useState("user"); // Default to "user"
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { setUser } = useUser();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Submitting Data:", data); // Debugging: Check if data is logged
    try {
     
      
      const response = await api.post("super-admin/login", data);
  
      console.log("Response:", response); // Debugging: Check the response from the server
  
      if (response.data?.user) {
        console.log("User Data:", response.data.user); // Debugging: Check user data
        setUser(response.data.user);
        localStorage.setItem("userType", userType);
       
        navigate("/superAdmin/Dashboard");
      } else {
        console.log("User not found or invalid credentials");
      }
    } catch (error) {
      console.error("Server Side Error", error); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form
          onSubmit={handleSubmit((data) => {
            console.log("Form Submitted with:", data); 
            onSubmit(data);
          })}
          className="login-form"
        >
         
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
              className="input-field"
            />
            {errors.email && (
              <p className="error-text">{errors.email.message?.toString()}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register("password")}
              className="input-field"
            />
            {errors.password && (
              <p className="error-text">
                {errors.password.message?.toString()}
              </p>
            )}
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};