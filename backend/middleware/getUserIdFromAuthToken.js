const jwt = require('jsonwebtoken');

const getUserIdFromAuthToken = (authToken) => {
  try {
    // Verify the JWT and extract the user ID
    const decodedToken = jwt.verify(authToken, 'TumseNaHoPayega'); // Replace 'your_secret_key' with your actual JWT secret key
    const userId = decodedToken.customer.id; // Update 'customer' with the actual key in your token payload

    return userId;
  } catch (error) {
    console.error('Error decoding JWT:', error.message);
    return null;
  }
};

// Use this function in your bookService function
const userId = getUserIdFromAuthToken(authToken);
