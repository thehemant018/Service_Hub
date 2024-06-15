# Service Hub

Service Hub is a comprehensive web application designed to simplify the process of connecting users with trusted local professionals for various home services. The platform provides a seamless and efficient booking process, ensuring quality and reliability.

## Features
- **Wide Range of Services**: Book service professionals for plumbing, carpentry, AC repair, pest control, and more.
- **Local and City-Wide Search**: Find service professionals from the nearest location or search city-wide.
- **Professional Registration**: Professionals can register themselves to offer home services to users.
- **Service Reviews and Comments**: Customers can review and comment on the services received.
- **Email Notifications**: Notifications sent to users and professionals when services are booked, accepted, or canceled.
- **JWT Authentication**: Secure authentication and authorization using JWT tokens.
- **Service Professional Stats**: View service professional stats with the help of pie charts.
- **Admin Management**: Admin can approve subscriptions, and maintain user and professional data.
- **Rich UI Experience**: Intuitive and user-friendly interface for seamless interaction.

## Technologies Used

- **Frontend**: ReactJs
- **Backend**: Node.js, ExpressJs
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/yourusername/service-hub.git
   cd service-hub

   ```

2. **Install Backend Dependencies**

   ```sh
   cd backend
   npm install

   ```

3. **Install Frontend Dependencies**

   ```sh
   cd ../frontend
   npm install

   ```

4. **Configuration**
   ```sh
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_MAIL=your_email_address
   SMTP_PASSWORD=your_email_app_password
   PORT=8000
   MONGODB_URI=mongodb_url
   JWT_SECRET=your_jwt_secret
    ```


5. **Running the Application**

   Start the Backend Server
   ```sh
   cd backend
   nodemon index.js

   ```
   Start the Frontend Server
   ```sh
   cd ../frontend
   npm start

   ```

## Usage

- **Sign Up / Login**: Create an account or log in to access the platform.
- **Browse Services**: Browse through various home services available.
- **Book Service**: Select a service professional and book the service.
- **Review and Rate**: After the service, leave a review and rate the professional.
- **Admin Panel**: Admins can manage user and professional data, and approve subscriptions.
- **Professional Registration**: Professionals can register themselves to offer home services to users.

## Contributing

1. **Fork the repository**
2. **Create your feature branch**
   ```sh
   git checkout -b feature/AmazingFeature
3. **Commit your changes**
   ```sh
   git commit -m 'Add some AmazingFeature'
4. **Push to the branch**
   ```sh
   git push origin feature/AmazingFeature
5. **Open a pull request**

## Contact

- **Team Member**: Hemant Maurya ,Darshit Yadav, Adarsh Patel 
- **Project Link**: [https://github.com/thehemant018/Service_Hub.git]
