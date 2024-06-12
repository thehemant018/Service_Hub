import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PiChart from './PiChart';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Order = (props) => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [prof, setProf] = useState({})
  const today = new Date().toISOString().split('T')[0];   //for displace accept & cancel button for todays services
  const [ratingsData, setRatingsData] = useState({ 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 });
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);
  const [otpInputs, setOtpInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const authToken = localStorage.getItem('token');
        console.log(authToken)

        if (!authToken) {
          console.error('Authentication token not found in localStorage.');
          return;
        }
        props.setProgress(30);
        const response = await fetch('http://localhost:1818/api/prof/fetchorderrequest', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'auth-token': authToken }
        });

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          const errorText = await response.text();
          console.error('Error details:', errorText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        props.setProgress(70);
        const data = await response.json();
        setServiceRequests(data);
        props.setProgress(100);
      }

      catch (error) {
        console.error('Error fetching service requests:', error.message);
      }
    };

    const fetchProfProfile = async () => {
      try {
        const authToken = localStorage.getItem('token');
        const response = await fetch('http://localhost:1818/api/prof/getprofs', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'auth-token': authToken }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const profData = await response.json();
        setProf(profData);
        setRatingsData(profData.ratings);
      }

      catch (error) {
        navigate('/profile');
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchProfProfile();
    fetchServiceRequests();
  }, []);

  const acceptServiceRequest = async (requestId) => {
    try {
      const authToken = localStorage.getItem('token');

      const response = await fetch(`http://localhost:1818/api/prof/acceptservice/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'auth-token': authToken }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedServiceRequests = serviceRequests.map((request) => {
        if (request._id === requestId) {
          return { ...request, status: 'accepted' };
        }
        return request;
      });

      setServiceRequests(updatedServiceRequests);
      

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Service Confirmed'
      })
    }

    catch (error) {
      console.error('Error accepting service request:', error.message);
    }
  };

  const cancelServiceRequest = async (requestId) => {
    try {
      const authToken = localStorage.getItem('token');

      const response = await fetch(`http://localhost:1818/api/prof/cancelservice/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'auth-token': authToken }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedServiceRequests = serviceRequests.map((request) => {
        if (request._id === requestId) {
          return { ...request, status: 'canceled' };
        }
        return request;
      });

      setServiceRequests(updatedServiceRequests);
      console.log('Service request canceled successfully');
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Service Canceled'
      })
    }

    catch (error) {
      console.error('Error canceling service request:', error.message);
    }
  };

  const updateLocation = () => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(

        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const authToken = localStorage.getItem('token');

            const response = await fetch('http://localhost:1818/api/prof/update-location', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'auth-token': authToken },
              body: JSON.stringify({ latitude, longitude })
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('Location updated successfully!');
          }

          catch (error) {
            console.error('Error updating location:', error.message);
          }
        },

        (error) => {
          console.error(error.message);
        }
      );
    }

    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  //future error
  // const ratingsArray = Object.entries(ratingsData).map(([rating, count]) => ({ rating: parseInt(rating), count }));
  const ratingsArray = ratingsData ? Object.entries(ratingsData).map(([rating, count]) => ({ rating: parseInt(rating), count })) : [];

  const handleCompleteWork = async (requestId) => {
    try {
      console.log("otpInputs:", otpInputs);
      const response = await fetch(`http://localhost:1818/api/prof/completeservice/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({otpInputs} ),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      });
    } catch (error) {
      console.error('Error completing service:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while completing the service.',
      });
    }
  };
  const handleOtpInputChange = (requestId, value) => {
    setOtpInputs((prevState) => ({
      ...prevState,
      [requestId]: value,
    }));
  };


  return (
    <>
      <div className='order-page'>

        <div className='order-container'>

          <div className='order-left'>
            <h1 className='order-left-title'>Professional Details</h1>
            <div className='order-left-details'>
              <p>User ID: {prof._id}</p>
              <p>Username: {prof.name}</p>
              <p>Category: {prof.category}</p>
              <p>Email: {prof.email}</p>
              <p>Contact: {prof.contact}</p>
              <p>Address: {prof.address}</p>

            </div>
          </div>

          <div className='order-right'>
            <h1 className='order-rating-title'>Overall Rating</h1>
            <div className="order-right-pichart">
              <PiChart className='' data={ratingsArray} />
            </div>
          </div>

        </div>

        <h1>Service Requests</h1>

        <div className="grid"></div>
        <ul className='row'>
          {serviceRequests
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 7)
            .map((request) => {
              const requestDate = new Date(request.createdAt).toISOString().split('T')[0];

              return (
                <li key={request._id} className='col' style={{ listStyle: 'none' }}>
                  <p>Request ID: {request._id}</p>
                  <p>Status: {request.status}</p>
                  <p>Time: {request.createdAt}</p>
                  <p>Customer: {request.customerId}</p>
                  <p>CustomerName: {request.customerName}</p>
                  <p>Professional: {request.professionalId}</p>
                  <p>Instruction: {request.instruction}</p>

                  {requestDate === today && request.status !== 'accepted' && request.status !== 'completed' && (
                    <button className='btn btn-primary' onClick={() => acceptServiceRequest(request._id)}>Accept Request</button>
                  )}

                  {requestDate === today && request.status !== 'canceled' && request.status !== 'completed' && (
                    <button className='btn btn-primary mx-3' onClick={() => cancelServiceRequest(request._id)}>Cancel Request</button>
                  )}
  <br/>
                  {requestDate === today && request.status !== 'completed' && (
                    <>
                    <button
                        className='btn btn-primary mx-3'
                        onClick={() => handleCompleteWork(request._id)}
                      >
                        Complete Work
                      </button>
                      <input
                        type="text"
                        value={otpInputs[request._id] || ''}
                        onChange={(e) => handleOtpInputChange(request._id, e.target.value)}
                        placeholder="Enter OTP"
                        style={{ "width": "10rem" }}
                      />
                      
                    </>
                  )}

                </li>
              );

            })

          }
        </ul>

      </div>
    </>
  );
};

export default Order;
