import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const [dataToShow, setDataToShow] = useState([]);
  const [dataType, setDataType] = useState("users");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [professionalCount, setProfessionalCount] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [allsubscriptionCount, setAllsubscriptionCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    const fetchDataIfNeeded = async () => {
      if (token) {
        await validateToken(token);
      }
      else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    fetchDataIfNeeded();
    fetchCounts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch("http://localhost:1818/api/admin/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const json = await response.json();

      if (response.ok) {

        if (json.success) {
          localStorage.setItem("token", json.authToken);
          // navigate("/");
        }

        console.log("loading", loading);
        console.log("res", json);
        console.log(dataType);

        setIsLoggedIn(true);
        setLoading(false);
        fetchData(dataType);
      }
      else {
        setIsLoggedIn(false);
        setLoading(false);
      }

    }
    
    catch (error) {
      console.error("Error validating token:", error.message);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const handleRadioChange = (event) => {
    setDataType(event.target.value);
    fetchData(event.target.value);
  };

  const fetchData = async (dataType) => {
    try {
      let endpoint = "";

      if (dataType === "users") {
        endpoint = "http://localhost:1818/api/auth/getallusers";
      }
      else if (dataType === "professionals") {
        endpoint = "http://localhost:1818/api/prof/fetchallprofessionals";
      }
      else if (dataType === 'subscription') {
        endpoint = 'http://localhost:1818/api/subscription/subscriptionsRequest';
      }
      else if(dataType === 'quries'){
        endpoint = 'http://localhost:1818/api/query/fetch-all-queries';
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      
      const data = await response.json();
      setDataToShow(data);
      // console.log(data)
    }
    
    catch (error) {
      toast.error('Something Wrong!');
      console.error("Error fetching data:", error.message);
      setDataToShow([]); // Clear data on error
    }
  };

  const handleDelete = async (id) => {
    try {
      let endpoint = "";

      if (dataType === "users") {
        endpoint = `http://localhost:1818/api/auth/deleteuser/${id}`;
      }
      else if (dataType === "professionals") {
        endpoint = `http://localhost:1818/api/prof/deleteprofessional/${id}`;
      }
      

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error("Failed to delete data");
      }

      // After successful deletion, refetch data
      
      fetchData(dataType);
      // console.log(dataType)
    }
    
    catch (error) {
      toast.error('Something Wrong');
      console.error("Error deleting data:", error.message);
    }
  }

  const handleAcceptSubscription = async (id) => {
    try {
      const response = await fetch(`http://localhost:1818/api/subscription/accept/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok)
        throw new Error('Failed to accept subscription');
      
      if (response.ok)
        // alert("Subscription confirmed")
        toast.success('Subscription confirmed');
      
      fetchData(dataType);
    }
    
    catch (error) {
      toast.error('Something Wrong');
        console.error('Error accepting subscription:', error.message);
    }
  };


  const fetchCounts = async () => {
    try {
      const userResponse = await fetch("http://localhost:1818/api/auth/getUserCount");
      const professionalResponse = await fetch("http://localhost:1818/api/prof/getProfessionalCount");
      const subscriptionResponse = await fetch("http://localhost:1818/api/subscription/getPendingSubscriptionCount");
      const allsubscriptionResponse = await fetch("http://localhost:1818/api/subscription/getSubscriptionCount");

      if (!userResponse.ok || !professionalResponse.ok || !subscriptionResponse.ok) {
        throw new Error("Failed to fetch counts");
      }

      const userData = await userResponse.json();
      const professionalData = await professionalResponse.json();
      const subscriptionData = await subscriptionResponse.json();
      const allsubscriptionData=await allsubscriptionResponse.json();

      setUserCount(userData.count);
      setProfessionalCount(professionalData.count);
      setSubscriptionCount(subscriptionData.count);
      setAllsubscriptionCount(allsubscriptionData.count);
    } catch (error) {
      console.error("Error fetching counts:", error.message);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin">
      <h1>Admin Page</h1>

      {!isLoggedIn ?
        (
            <div className="please-login">
                <p>Please <Link to="/adminlogin">login</Link> to view this page.</p>
            </div>
        ) :
        (
            <>
                <div className="radio">
                  <input type="radio" name="radio" id="user" value="users" checked={dataType === "users"} onChange={handleRadioChange} />
                  <label htmlFor="user">Users</label>
                  <input type="radio" name="radio" id="professional" value="professionals" checked={dataType === "professionals"} onChange={handleRadioChange} />
                  <label htmlFor="professional">Professionals</label>
                  <input type="radio" name="radio" id="subscription" value="subscription" checked={dataType === 'subscription'} onChange={handleRadioChange} />
                  <label htmlFor="subscription">Subscription Request</label>
                  <input type="radio" name="radio" id="quries" value="quries" checked={dataType === 'quries'} onChange={handleRadioChange} />
                  <label htmlFor="quries">Quries</label>
                </div>

                <div className="admin-all-data">
                    <div className="admin-data">
                      <h4 className="admin-detail">Users:</h4>
                      <h5 className="admin-detail">{userCount}</h5>
                    </div>
                    <div className="admin-data">
                      <h4 className="admin-detail">Professional:</h4>
                      <h5 className="admin-detail">{professionalCount}</h5>
                    </div>
                    <div className="admin-data">
                      <h4 className="admin-detail">Subscription Request:</h4>
                      <h5 className="admin-detail">{subscriptionCount}</h5>
                    </div>
                    <div className="admin-data">
                      <h4 className="admin-detail">Total Subscribed User:</h4>
                      <h5 className="admin-detail">{allsubscriptionCount}</h5>
                    </div>
                </div>

                <>
                <h2>{dataType === 'users' ? 'User Data' : dataType === 'professionals' ? 'Professional Data' : dataType === 'subscription' ? 'Subscription' : 'Queries'}</h2>


                    <div className="list-group">
                      {dataToShow.map((dataItem, index) => (
                          
                        <div key={index} className="list-item">
                            <div className="mb-2"><strong>Name: </strong> {dataItem.name} </div>
                            <div className="mb-2"><strong>Email: </strong> {dataItem.email} </div>

                            {Object.entries(dataItem)
                                .filter( ([key]) => key !== "location" && key !== "name" && key !== "email" && key !== "id" )
                                .map(([key, value]) => (
                                    <div key={key} className="mb-2"> <strong>{key}: </strong> {JSON.stringify(value)} </div>
                                ))
                            }

                            <button className="delete" onClick={() => handleDelete(dataItem._id)} >Delete</button>

                            {dataType === "professionals" && (
                                <button className="viewservice" ><Link to={`/service/${dataItem._id}`} >View Details</Link></button>
                            )}
                            {dataType === 'subscription' && (
                                <button className='acceptsubscription' onClick={() => handleAcceptSubscription(dataItem._id)}>Accept Subscription</button>
                            )}
                        </div>

                      ))}
                    </div>
                  </>

            </>
        )
      }
      
    </div>
  );
};

export default AdminPage;
