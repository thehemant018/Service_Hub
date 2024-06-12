import React, { useEffect, useState } from 'react';
import PiChart from './PiChart';
import { FaStar } from 'react-icons/fa';

export default function ProfDetail({ value, onChange }) {
   const [prof, setProf] = useState({})
   const [ratingsData, setRatingsData] = useState({ 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 });
   const ratingsArray = ratingsData ? Object.entries(ratingsData).map(([rating, count]) => ({ rating: parseInt(rating), count })) : [];
   const stars = Array.from({ length: 5 }, (_, index) => index + 1);

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
         console.error('Error fetching user profile:', error.message);
      }
   };

   fetchProfProfile();

   return (
      <div>

         <div className='order-container'>
            <div className='order-left'>
               <h1 className='order-left-title'>Professional Details</h1>
               <div className='order-left-details'>
                  <p>User ID: </p>
                  <p>Username: </p>
                  <p>Category: </p>
                  <p>Email: </p>
                  <p>Contact: </p>
                  <p>Address: </p>
               </div>
               <button className='book' style={{ 'margin': '3% 0 0 78%' }}>Book</button>
            </div>

            <div className='order-right'>
               <h1 className='order-rating-title'>Overall Rating</h1>
               <div className="order-right-pichart">
                  <PiChart className='' data={ratingsArray} />
               </div>
            </div>
         </div>

         <div className="profdetails-grid grid">
            <div className="profdetails-row row">
               <div className="profdetails-col col">
                  <p>Comment: </p>
                  <p>Rating: </p>
                  <p>User ID: </p>
                  <p>Created At: </p>
               </div>
               <div className="profdetails-col col">
                  <p>Comment: </p>
                  <p>Rating: </p>
                  <p>User ID: </p>
                  <p>Created At: </p>
               </div>
               <div className="profdetails-col col">
                  <p>Comment: </p>
                  <p>Rating: </p>
                  <p>User ID: </p>
                  <p>Created At: </p>
               </div>
            </div>
            <div className="profdetails-row row">
               <div className="profdetails-col col">
                  <p>Comment: </p>
                  <p>Rating: </p>
                  <p>User ID: </p>
                  <p>Created At: </p>
               </div>
               <div className="profdetails-col col">
                  <p>Comment: </p>
                  <p>Rating: </p>
                  <p>User ID: </p>
                  <p>Created At: </p>
               </div>
               <div className="profdetails-col col">
                  <p>Comment: </p>
                  <p>Rating: </p>
                  <p>User ID: </p>
                  <p>Created At: </p>
               </div>
            </div>
         </div>
         
      </div>
   )
}
