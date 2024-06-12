import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

function Bookservice(props) {
    const [professionals, setProfessionals] = useState([]);
    const [category, setCategory] = useState('');
    const [filteredProfessionals, setFilteredProfessionals] = useState([]);
    const [userLatitude, setUserLatitude] = useState();
    const [userLongtitude, setuserLongtitude] = useState();
    const [user, setUser] = useState({});
    const [city, setCity] = useState(''); // New state for selected city
    const [searchOption, setSearchOption] = useState('service');
    const [service, setService] = useState('service');
    const navigate = useNavigate();
    const [showService, setShowService] = useState(false);
    const [showCity, setShowCity] = useState(false);

    useEffect(() => {
        fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [category]);

    const fetchData = async () => {
        try {
          props.setProgress(30);
          let apiUrl = 'http://localhost:1818/api/prof/fetchallprofessionals';
    
          // If a category is specified, append it to the API URL
          if (category)
            apiUrl += `?category=${category}`;
    
          const response = await fetch(apiUrl);
          props.setProgress(70);
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
    
          const data = await response.json();
          props.setProgress(100);
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
            // Handle the case where the authentication token is missing
            return;
          }

          const response = await fetch(`http://localhost:1818/api/prof/bookservice/${professionalId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'auth-token': authToken }
          });
    
          console.log('Service booked successfully');
          alert('Service is Booked');
    
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        catch (error) {
          console.error('Error booking service:', error.message);
        }
    };

    const fetchProfessionalsByCategory = async () => {
        try {
          props.setProgress(30);
          const response = await fetch(`http://localhost:1818/api/prof/fetchprofessionalsbycategory/${category}`);
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
    
          const data = await response.json();
          props.setProgress(70);
    
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
          props.setProgress(100);
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
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
      };
    
      const handleSearchOptionChange = (option) => {
        setService(option);
      };
    
      //14 March
    const fetchProfessionalsByCity = async () => {
        try {
          props.setProgress(30);
          const response = await fetch(`http://localhost:1818/api/prof/fetchprofessionalsbycity/${city}`);
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
          props.setProgress(70);
          const data = await response.json();
          props.setProgress(100);
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
            props.setProgress(30);
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
              props.setProgress(70);
              if (!responseSecond.ok)
                throw new Error(`HTTP error! Status: ${responseSecond.status}`);
              
              console.log('Successful');
              const userData = await responseSecond.json();
              props.setProgress(100);
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
        // Instead of executing bookService, navigate to service detail page
        navigate(`/service/${professionalId}`);
    };

    const handleServiceClick = () => {
        setShowService(true);
        setShowCity(false);
    };

    const handleCityClick = () => {
        setShowCity(true);
        setShowService(false);
    };

    const Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className="service-container" style={{ 'background': 'url("/images/homeservices.png")' }}>
            <div className="service-details">
                <button onClick={handleServiceClick}>Service Base</button>
                <button onClick={handleCityClick}>City Base</button>
            </div>

            <div style={{ display: showService ? 'block' : 'none' }}>
                <p className="service-text">Select Service:</p>
                <select name="serv" className="selection" width="90%" value={category} onChange={handleCategoryChange}>
                    <option value="" selected>Select Service</option>
                    <option value="pest">Pest</option>
                    <option value="carpenter">Carpenter</option>
                    <option value="electrician">Electrician</option>
                    <option value="ac repair">AC reapir</option>
                    <option value="plumber">Plumber</option>
                </select>
                <button className='' onClick={fetchProfessionalsByCategory}>Search</button>
            </div>

            <div style={{ display: showCity ? 'block' : 'none' }}>
                <p className="service-text">Select City:</p>
                <select name="city" className="selection" width="90%" value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="" selected>Select City</option>
                    <option value="Anand">Anand</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Gandhinagar">Gandhinagar</option>
                </select>
                <button className='' onClick={fetchProfessionalsByCity}>Search</button>
            </div>

            <div className="grid">
              <div className="row">
                {filteredProfessionals.map((professional) => (
                  <div key={professional._id} className="row">
                    <div className="card col">
                    {/* <img src={`http://localhost:1818${professional.image}`} alt="Professional" style={{ width: '100px', height: '100px' }}/> */}
                      <h3 className="card-text">{Capitalize(professional.category)}</h3>
                      <p className="card-title">Name: {professional.name}</p>
                      <p className="card-text">ID: {professional._id}</p>
                      <p className="card-text">Contact: {professional.contact}</p>
                      <p className="card-text">Email: {professional.email}</p>
                      <button className='book' onClick={() => handleBookService(professional._id)}>Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
        </div>
    );
}

export default Bookservice;
