import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name:'', email:'', password:'', contact:'', address:'', latitude:'',  longitude:'' });

  useEffect(() => {

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCredentials({ ...credentials, latitude, longitude });
          },
          (error) => {
            console.error(error.message);
          }
        );
      }
      
      else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, contact, address, latitude, longitude } = credentials;

    props.setProgress(30);
    const response = await fetch(`http://localhost:1818/api/auth/createuser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, contact, address, latitude, longitude }),
    });

    props.setProgress(60);
    const json = await response.json();

    props.setProgress(100);
    if (json.success) {
      toast.success("Signup successfuly")
      localStorage.setItem('token', json.authToken);
      navigate("/login");
    }
    else {
      // alert("Invalid credentials");
      toast.error("Invalid credentials")
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="signup">

        <div className="container">
          <h1>Sign Up</h1>
          <p>Open the door to efficiency. Your personalized experience awaits within Service Hub</p>

          <form action='/' onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" onChange={onChange} placeholder="Enter Your Name" required />
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" onChange={onChange} placeholder="Example@email.com" required/>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={onChange} placeholder="At least 8 characters" minLength={8} required/>
            <label htmlFor="contact">Contact</label>
            <input type="tel" id="contact" name="contact" onChange={onChange} placeholder="10 digit mobile number" />
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name ="address" onChange={onChange} placeholder="Enter Your Address" />
            <input type="text" className='form-control' id="latitude" name="latitude" value={credentials.latitude} readOnly />
            <input type="text" className='form-control' id="longitude" name="longitude" value={credentials.latitude} readOnly />
            <input type="submit" value="Sign Up" />
          </form>
          
          <p className="footer-login">Already have an account?<Link to="../Login">Sign in</Link></p>
        </div>

        <div className="img">
          <img src="/images/art 1.png" alt="Art" />
        </div>

      </div>
    </>
  )
}

export default Signup;
