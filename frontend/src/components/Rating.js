import React from 'react';
import { FaStar } from 'react-icons/fa';

const Rating = ({ value, onChange }) => {
  const stars = Array.from( {length: 5}, (_, index) => index+1);

  return (
    <div> 
      {stars.map((starValue) => (
        <FaStar key={starValue} size={24} style={{ marginRight: 5, cursor: 'pointer', color: starValue <= value ? '#ffc107' : '#e4e5e9' }} onClick={() => onChange(starValue)} />
      ))}
    </div>
  );
};

export default Rating;
