import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentForm = () => {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  let navigate = useNavigate()

  const handleUpiPaymentClick = async () => {
    try {
      const authToken = localStorage.getItem('token');

      if (!upiId) {
        setError('Please enter a valid UPI ID');
        return;
      }
      const response = await fetch('http://localhost:1818/api/prof/subscription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'auth-token': authToken },
        body: JSON.stringify({ transactionId: upiId }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const responseData = await response.json();
      navigate("/")
      // alert('Subscription Done Wait for approvel')
      toast.success('Subscription Done Wait for approvel!');
      // console.log('Subscription updated:', responseData);
    }

    catch (error) {
      toast.error('Error updating subscription')
      console.error('Error updating subscription:', error.message);
    }
  };

  return (
    <div>
      <h2 style={{ margin: '2% 0 0 1%' }}>Payment Details</h2>
      <form style={{ marginLeft: '1%' }}>
        <div className="form-group">
          <label>UPI ID</label>
          <input type="text" className="form-control" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
          {error && <div className="text-danger">{error}</div>}
        </div>

        <div className="form-group">
          <img src="https://qrcg-free-editor.qr-code-generator.com/main/assets/images/websiteQRCode_noFrame.png" alt="UPI QR Code" style={{ width: "250px", height: "250px" }} />
        </div>

        <button type="button" className="btn btn-primary btn-block" onClick={handleUpiPaymentClick}>Pay with UPI</button>
      </form>
    </div>
  );
};

export default PaymentForm;
