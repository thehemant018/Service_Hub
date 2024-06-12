import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminSignup = () => {
    const [formData, setFormData] = useState({ email:'', password:'' });
    const { email, password } = formData;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:1818/api/admin/createadmin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // alert('signup successfuly')
            toast.success('Signup successfuly');
            const data = await response.json();
            // console.log(data);
            navigate("/adminlogin");
        }
        
        catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className='admin-signup'>
            <form onSubmit={handleSubmit}>
                <h1>Admin Signup</h1>

                <label htmlFor='email'>Email</label>
                <input type="email" id='email' name="email" value={email} onChange={handleChange} placeholder="Example@email.com" required />

                <label htmlFor='password'>Password</label>
                <input type="password" id='password' name="password" value={password} onChange={handleChange} placeholder="At least 8 characters" required />
            
                <button type="submit" className='admin-buttons admin-buttons-signup'>Signup</button>
                {/* <p className="admin-signup-login">Already have an account?<Link to="../adminlogin">Sign in</Link></p> */}
            </form>
        </div>
    );
};

export default AdminSignup;
