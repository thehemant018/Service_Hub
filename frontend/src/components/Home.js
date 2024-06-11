//8 march
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom';

const Home = () => {
  const [professionals, setProfessionals] = useState([]);
  const [category, setCategory] = useState('');
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [userLatitude, setUserLatitude] = useState();
  const [userLongtitude, setuserLongtitude] = useState();
  const [user, setUser] = useState({});
  const [city, setCity] = useState(''); // New state for selected city

  const navigate = useNavigate();


  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      let apiUrl = 'http://localhost:1818/api/prof/fetchallprofessionals';

      if (category) {
        apiUrl += `?category=${category}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProfessionals(data);
      setFilteredProfessionals(data); // Reset the filter when new data is fetched
    }
    
    catch (error) {
      console.error('Error fetching professionals:', error.message);
    }
  };

  const bookService = async (professionalId) => {
    try {
      const authToken = localStorage.getItem('token');

      if (!authToken) {
        console.error('Authentication token not found');
        return;
      }

      const response = await fetch(`http://localhost:1818/api/prof/bookservice/${professionalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'auth-token': authToken }
      });


      console.log('Service booked successfully');
      alert('Service is Booked');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    
    catch (error) {
      console.error('Error booking service:', error.message);
    }
  };

  const fetchProfessionalsByCategory = async () => {
    try {
      const response = await fetch(`http://localhost:1818/api/prof/fetchprofessionalsbycategory/${category}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Calculate distance for each professional based on user's location
      const professionalsWithDistance = data.map(professional => {
        const profLatitude = professional.location && professional.location.coordinates ? professional.location.coordinates[1] : null;
        const profLongitude = professional.location && professional.location.coordinates ? professional.location.coordinates[0] : null;

        if (profLatitude && profLongitude) {
          const distance = calculateDistance(userLatitude, userLongtitude, profLatitude, profLongitude);
          return { ...professional, distance };
        }
        else {
          return professional;
        }
      });

      // Sort professionals by distance
      const sortedProfessionals = professionalsWithDistance.sort((a, b) => a.distance - b.distance);
      setFilteredProfessionals(sortedProfessionals); // Update the filter based on the sorted professionals
    }
    
    catch (error) {
      console.error('Error fetching professionals by category:', error.message);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
  };

  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const fetchProfessionalsByCity = async () => {
    try {
      const response = await fetch(`http://localhost:1818/api/prof/fetchprofessionalsbycity/${city}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setFilteredProfessionals(data); // Update the filter based on the selected city
    }
    
    catch (error) {
      console.error('Error fetching professionals by city:', error.message);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = localStorage.getItem('token');
        const response = await fetch('http://localhost:1818/api/auth/getuser', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'auth-token': authToken }
        });

        // If the first API request fails, try the second one
        if (!response.ok) {
          // console.log('Error fetching user profile. Trying the second API endpoint.');
          const responseSecond = await fetch('http://localhost:1818/api/prof/getprofs', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'auth-token': authToken }
          });

          if (!responseSecond.ok) {
            throw new Error(`HTTP error! Status: ${responseSecond.status}`);
          }

          console.log('Successful');
          const userData = await responseSecond.json();

          setUser(userData);
          setUserLatitude(userData.location.coordinates[1]);
          setuserLongtitude(userData.location.coordinates[0]);
        }
        else {
          const userData = await response.json();

          setUser(userData);
          setUserLatitude(userData.location.coordinates[1]);
          setuserLongtitude(userData.location.coordinates[0]);
        }
      }
      
      catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleBookService = (professionalId) => {
    navigate(`/service/${professionalId}`);
  };

  return (
    <>
      <div className="home-hero">
        <div className="backframe">

          <div>
            <h1 className="nav-title">Connecting <span className="inner">Needs</span> with <span className="inner">Expertise</span> : Your Gateway to Seamless Services</h1>
            <p className="nav-desc">Service Hub is an web-app that connects users with local service professionals for various home services including home repairs, grooming and wellness.</p>
            <Link to="/login" className="nav-btn-2"> <i className="fa-solid fa-circle-right" style={{ color: "#000000" }}></i> Start Journey</Link>
          </div>

          <div className="background">
            <div className="background-circle-1"><div className="background-circle-2"><img className="nav-img" src="/images/Ellipse 10.png" alt="" /></div></div>
          </div>

        </div>
      </div>

      {/* Body  */}
      <div className="Body">
        <h1 className="body-title">Why Service Hub?</h1>

        <div className="services">

          <div className="box">
            <p className="body-logo "><i className="fa-solid fa-pen" style={{color: "black"}}></i></p>
            <h3 className="body-content">100% Quality Assurance</h3>
            <p className="body-desc">If you don't like our services ,we will make it right.</p>
          </div>
          <div className="box">
            <p className="body-logo "><i className="fa-solid fa-pen-nib" style={{color:"white"}}></i></p>
            <h3 className="body-content"> Transparent Pricing </h3>
            <p className="body-desc">See actual prices before you book. No hidden charge.</p>
          </div>
          <div className="box">
            <p className="body-logo"><i className="fa-solid fa-volume-high" style={{color: "#000000"}}></i></p>
            <h3 className="body-content">Expert Only</h3>
            <p className="body-desc">Our professionals are well trained and have on-job expertise.</p>
          </div>
          <div className="box">
            <p className="body-logo"><i className="fa-solid fa-palette" style={{color: "white"}}></i></p>
            <h3 className="body-content">Fully Equipped</h3>
            <p className="body-desc">We bring everything needed to get the job done well.</p>
          </div>
          <div className="box">
            <p className="body-logo"><i className="fa-solid fa-user" style={{color:" #000000"}}></i></p>
            <h3 className="body-content">24 x 7 Support</h3>
            <p className="body-desc">Unwavering support, day or night . Your reliable 24x7 service partner .</p>
          </div>
          <div className="box">
            <p className="body-logo"><i className="fa-regular fa-gem" style={{color: "white"}}></i></p>
            <h3 className="body-content">Brand Identity </h3>
            <p className="body-desc">It involves creating a unique and recognizable identity that sets the brand apart from competitors and resonates with the target audience. </p>
          </div>
          
        </div>
      </div>

    </>
  )
};

export default Home;
