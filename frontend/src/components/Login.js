import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    props.setProgress(20);
    const response = await fetch( `http://localhost:1818/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });

    props.setProgress(60);
    const json = await response.json();
    props.setProgress(100);

    if (json.success) {
      toast.success("Login successfuly")
      localStorage.setItem("token", json.authToken);
      navigate("/bookservice");
    }
    else {
      toast.error("Invalid cedetials")
    }
  };
  
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value }); //... is spread operator
  };

  return (
    <>
      <div className="login">
        
        <div className="container">
          <h1>Welcome Back👋</h1>
          <p>Open the door to efficiency. Your personalized experience awaits within Service Hub</p>

          <form action="/" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={credentials.email} name='email' onChange={onChange} placeholder="Example@email.com" required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={credentials.password} name='password' onChange={onChange} placeholder="At least 8 characters" required />
            <Link to="/">Forgot Password</Link>
            <input type="submit" value="Sign In" />
          </form>

          <p className="footer-login">Don't have an account? <Link to="../Signup">Sign up</Link> </p>
        </div>

        <div className="img">
          <img src="/images/art 1.png" alt="Art" />
        </div>

      </div>
    </>
  );
};

export default Login;
