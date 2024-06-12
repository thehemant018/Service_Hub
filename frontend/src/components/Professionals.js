import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ProfLogin from './ProfLogin';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Professionals = (props) => {
    let navigate = useNavigate();

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", aadhar: "", category: "", city: "", address: "", latitude: "", longitude: "",image:"" });

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
                )
            }

            else {
                console.error("Geolocation is not supported by this browser.");
            }
        };

        getUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', credentials.name);
        formData.append('email', credentials.email);
        formData.append('password', credentials.password);
        formData.append('aadhar', credentials.aadhar);
        formData.append('category', credentials.category);
        formData.append('city', credentials.city);
        formData.append('address', credentials.address);
        formData.append('latitude', credentials.latitude);
        formData.append('longitude', credentials.longitude);
        formData.append('image', credentials.image);

        try {
            const response = await fetch('http://localhost:1818/api/prof/profcreateuser', {
                method: 'POST',
                body: formData,
            });
            const json = await response.json();
            if (json.success) {
                toast.success('Signup Successfuly!')
                navigate("/proflogin");
            } else {
                toast.error('Invalid cedetials!')
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onRadio = (e) => {
        if (e.target.name === 'category')
            setCredentials({ ...credentials, category: e.target.id });
        else
            setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setCredentials(prevState => ({
            ...prevState,
            image: file,
        }));
    };

    return (
        <>
            <div className="professional-container">
                <h1 className='professional-title'>Create an account to use ServiceHub</h1>

                <form action="#" method="post" onSubmit={handleSubmit} encType="multipart/form-data" >
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input type="text" className="professional-name" placeholder="Enter Name" name="name" onChange={onChange} required />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="professional-email" placeholder="Example@email.com" name="email" onChange={onChange} required />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="professional-password" placeholder="At least 8 character" minLength="8" name="password" onChange={onChange} required />
                    </div>
                    <div>
                        <label htmlFor="contact">Contact:</label>
                        <input type="tel" className="professional-contact" placeholder="10 Digit number" name="contact" onChange={onChange} required />
                    </div>
                    <div>
                        <label htmlFor="aadhar">Aadhar Card No:</label>
                        <input type="tel" className="professional-aadhar" placeholder="eneter your aadhar card number" name="aadhar" onChange={onChange} required />
                    </div>
                    <div>
                        <label htmlFor='category'>Category:</label><br></br>
                        <div className="professional-options">
                            <input type="radio" className="professional-radio" name="category" id="carpenter" onChange={onRadio} />
                            <label htmlFor="carpenter">Carpenter</label>
                            <input type="radio" className="professional-radio" name="category" id="pest" onChange={onRadio} />
                            <label htmlFor="pest">Pest</label>
                            <input type="radio" className="professional-radio" name="category" id="electrician" onChange={onRadio} />
                            <label htmlFor="electrician">Electrician</label>
                            <input type="radio" className="professional-radio" name="category" id="acRepair" onChange={onRadio} />
                            <label htmlFor="acRepair">AC repair</label>
                            <input type="radio" className="professional-radio" name="category" id="plumber" onChange={onRadio} />
                            <label htmlFor="plumber">Plumber</label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="city">City:</label>
                        <input type="text" className="professional-city" placeholder="Enter city" name="city" onChange={onChange} required />
                    </div>
                    <div>
                        <label htmlFor="address">Address:</label>
                        <input type="text" className="professional-address" placeholder="Enter your address" name="address" onChange={onChange} required />
                    </div>
                    <div>
                        <label htmlFor="image">Image:</label>
                        <input type="file" className="professional-address" placeholder="Enter your address" name="image" onChange={handleImageChange} accept="image/*" required />
                    </div>

                    <div >
                        <input type="text" className='professional-latitude' id="latitude" name="latitude" value={credentials.latitude} readOnly />
                    </div>
                    <div>
                        <input type="text" className='professional-longitude' id="longitude" name="longitude" value={credentials.longitude} readOnly />
                    </div>

                    <button type='submit' className="professional-button professional-register-button">Register</button>
                </form>

            </div>
        </>
    )
}

export default Professionals
