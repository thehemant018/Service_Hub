import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PiChart from './PiChart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SelectService = (props) => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [professional, setProfessional] = useState(null);
    const [ratingsData, setRatingsData] = useState({ 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 });
    const [feedback, setFeedback] = useState(null);
    const [instruction, setInstruction] = useState('');

    useEffect(() => {

        const fetchProfessional = async () => {
            try {
                const response = await fetch(`http://localhost:1818/api/prof/profdetail/${id}`);

                if (!response.ok)
                    throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setProfessional(data);
                setRatingsData(data.ratings);
            }
            
            catch (error) {
                console.error('Error fetching professional details:', error.message);
            }
        };

        
        fetchProfessional();
    }, [id]);

    const handleInputChange = (e) => {
        setInstruction(e.target.value);
    };
    
    const handleBookService = async () => {
        try {
            const authToken = localStorage.getItem('token');

            props.setProgress(30);
            const response = await fetch(`http://localhost:1818/api/prof/bookservice/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'auth-token': authToken },
                body: JSON.stringify({ instruction }),
            });

            props.setProgress(70);
            const responseData = await response.json();
            

            if (!response.ok) {
                if (response.status === 400 && responseData.error === 'Please subscribe to book services') {
                    // alert('Please subscribe to book services');
                    toast.info('Please subscribe to book services');
                    navigate('/payment');
                }
                else if (response.status === 400 && responseData.error === 'Please wait a few minutes to approve the subscription') {
                    
                    toast.info('Please wait a few minutes to approve the subscription!');
                    navigate('/payment');
                }
                else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
            props.setProgress(100);
            if (response.ok) {
                toast.success('Service Booked Successfully');
                
                navigate('/profile');
            }
        }
        
        catch (error) {
            console.error('Error booking service:', error.message);
        }
    };
    
    const fetchRatingsData = async () => {
        try {
            const response = await fetch(`http://localhost:1818/api/prof/ratings/${professional._id}`); 

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(data);
            setFeedback(data);
        }
        
        catch (error) {
            console.error('Error fetching ratings data:', error.message);
        }
    };



    const handleNavigateToHome = () => {
        navigate('/');
    };

    

    if (!professional) {
        return <div>Loading...</div>; // or some loading indicator
    }

    const ratingsArray = Object.entries(ratingsData).map(([rating, count]) => ({ rating: parseInt(rating), count }));

   

    return (
        <div className='select-service'>
            <div className='select-service-detail'>
                <div className="select-service-detail-left">
                    <h2>Professional Details</h2>
                
                    <div className="card">
                        <p >Name: {professional.name}</p>
                        <p>Email: {professional.email}</p>
                        <p>Category: {professional.category}</p>
                        <p>Permanent Address: {professional.address}</p>
                        <p>City: {professional.city}</p>

                        <input
                            type="text"
                            value={instruction}
                            onInput={handleInputChange}
                            placeholder="Any Instruction"
                        />
                        <button className="" onClick={handleBookService}>Book Service</button>
                        <button className="" onClick={fetchRatingsData}>Fetch Ratings Data</button>
                        <button className="" onClick={handleNavigateToHome}>Go Back to Home</button>
                    </div>
                </div>
               
                <div className='order-pichart' style={{marginBottom: '2%'}}><PiChart data={ratingsArray} /></div>
            </div>

            <h2>Feedbacks</h2>
            {feedback !== null && feedback.length > 0 && (
                <div className='grid'>
                    <ul className='row'>
                        {feedback.map((item, index) => (
                            <li key={index} className='select-service-rating col' style={{listStyle: 'none'}}>
                                <p>User Name: Anonymous</p>
                                <p>Rating: {item.rating}</p>
                                <p>Comment: {item.feedback}</p>
                                <p>Created At: {item.createdAt}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
        </div>
    );
};

export default SelectService;
