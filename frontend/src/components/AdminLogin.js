import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:1818/api/admin/loginadmin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data && data.authToken) {
          toast.success('Login successfuly');
          localStorage.setItem("token", data.authToken);
          navigate("/admin");
        }
        else {
          console.error("Token not found in response:", data);
        }
      }
      else {
        toast.error('Invalid Credentials!');
        console.error("Login failed:", data);
      }

    }
    
    catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        
        <label htmlFor='email'>Email</label>
        <input type="email" id='email' name="email" value={email} onChange={handleChange} placeholder="Example@email.com" required />

        <label htmlFor='password'>Password</label>
        <input type="password" id='password' name="password" value={password} onChange={handleChange} placeholder="At least 8 characters" required />
        
        <button type="submit" className='admin-buttons admin-buttons-login'>Login</button>
        <p className="admin-login-signup">Don't have an account?<Link to="../adminsignup">Sign up</Link></p>
      </form>
    </div>
  );
};

export default AdminLogin;
