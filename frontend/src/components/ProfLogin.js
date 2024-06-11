import React,{useState} from 'react'
import {useNavigate, Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfLogin = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ aadhar:"", password:"" });

  const handleSubmit=async (e)=>{
      e.preventDefault();

      props.setProgress(30);
      const response = await fetch(`http://localhost:1818/api/prof/proflogin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({aadhar:credentials.aadhar,password:credentials.password }),
        });

        props.setProgress(70);
        const json = await response.json();
        props.setProgress(100);

        if(json.success) {
          toast.success("Login Successfuly!")
          localStorage.setItem('token',json.authToken);
          navigate("/bookservice");
        }
        else {
          // alert("Invalid cedetials");
          toast.error("Invalid cedetials")
        }
  }
  
  const onChange=(e)=>{
      setCredentials({...credentials,[e.target.name]:e.target.value})      //... is spread operator
  }

  return (
    <>
      <div className='profLogin-container'>
        <h2>Login to continue to Servicehub</h2>

        <form className='container' onSubmit={handleSubmit}>
          <label htmlFor="aadhar">Aadhar Card Number</label>
          <input type="text" id="aadhar" value={credentials.aadhar} name='aadhar' onChange={onChange} placeholder="Aadhar Number" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={credentials.password} name='password' onChange={onChange} placeholder="At least 8 characters" required />
          <input type="submit" value="Sign In" />
          <p className="professional-footer-login">Don't have an account?<Link to="../profsignup">Sign up</Link></p>
        </form>
        
      </div>
    </>
  )
}

export default ProfLogin
