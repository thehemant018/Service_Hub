import React, { useState,useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Rating from './Rating';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ServiceFeedbackDetail = (props) => {
    const navigate=useNavigate();
    const { id,userId,profId } = useParams();
    const [service, setService] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [ratingSaved, setRatingSaved] = useState(false);
    const [reviewsLeft, setReviewsLeft] = useState(2);

    useEffect(() => {
        const fetchServiceDetail = async () => {
            if (!id)
                return;

            try {
                props.setProgress(30);
                const response = await fetch(`http://localhost:1818/api/prof/fetchservicedetail/${id}`);
                props.setProgress(70);
                if (!response.ok)
                    throw new Error(`HTTP error! Status: ${response.status}`);

                const serviceData = await response.json();
                props.setProgress(100);

                setService(serviceData);
            }
            
            catch (error) {
                console.error('Error fetching service detail:', error.message);
            }
        };
    
        fetchServiceDetail();
    }, [id]);
   
    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
    };

    const saveRating = async () => {
        try {
            const response = await fetch('http://localhost:1818/api/prof/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service_id: id, userId:userId, profId:profId, rating: rating, feedback: feedback })
            });

            if (!response.ok)
                throw new Error('Failed to save rating');
            
            // alert("Thank's for feedback")
            toast.success("Thank's for feedback")
            setRatingSaved(true);
        }
        
        catch (error) {
            console.error('Error saving rating:', error.message);
        }
    }

    if (!service)
        return <div>Loading...</div>; // Add loading state until service data is fetched
    
    if (ratingSaved)
       navigate('/profile')

       
    return (
        <div className="service-feedback-detail container">
            <h2>Service Feedback</h2>
            <p>Service Name: {service.serviceName}</p>
            <p>Professional Name: {service.professionalName}</p>

            <div>
                <h3>Rate the Service</h3>
                <Rating value={rating} onChange={handleRatingChange} />
                <textarea placeholder="Your feedback" value={feedback} onChange={handleFeedbackChange} ></textarea>
                <button onClick={saveRating}>Submit Rating</button>
            </div>

        </div>
    );
};

export default ServiceFeedbackDetail;
