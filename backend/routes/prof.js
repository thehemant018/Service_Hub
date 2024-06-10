const express = require('express');
const Professional = require('../models/professional');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const Rating = require('../models/Rating');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'TumseNaHoPayega';
var fetchuser = require('../middleware/fetchuser');
var fetchprofs = require('../middleware/fetchprofs');
var fetchprofsfororder = require('../middleware/fetchprofsfororder');
const { sendEmail } = require("../controllers/acceptemailControllers");
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const multer = require('multer');
const path = require('path');

router.get('/fetchprofssional', fetchprofs, async (req, res) => {
    try {
        const profs = await Professional.find({ professional: req.professional.id });
        res.json(profs)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Iternal server Error')
    }
})



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer upload setup
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // 1MB file size limit
});
router.post(
    '/profcreateuser',
    upload.single('image'),
    [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Passwords must be at least 5 characters').isLength({ min: 5 }),
        body('aadhar', 'Enter a valid Aadhar').isLength({ min: 12, max: 12 }),
        body('category', 'Enter a valid category').isString(),
        body('latitude', 'Enter valid latitude').isNumeric(),
        body('longitude', 'Enter valid longitude').isNumeric(),
    ],
    async (req, res) => {
        // validate result
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ success, message: 'No file uploaded' });
            }
            let professional = await Professional.findOne({ aadhar: req.body.aadhar });
            if (professional) {
                return res.status(400).json({ success, error: 'Sorry, a user with this Aadhar already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            professional = await Professional.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
                contact: req.body.contact,
                aadhar: req.body.aadhar,
                city: req.body.city,
                address: req.body.address,
                category: req.body.category,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
                },
                image: `/uploads/${req.file.filename}`
            });

            const data = {
                professional: {
                    id: professional.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal server error');
        }
    }
);

router.post('/proflogin', [
    body('aadhar', "Enter valid aadhar").isLength({ min: 12, max: 12 }),
    body('password', 'Passwords cannot be blank').exists()
], async (req, res) => {
    let success = false;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const { aadhar, password } = req.body;
    try {
        let professional = await Professional.findOne({ aadhar });
        if (!professional) {
            success = false;
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }

        // compare  the passwords using bcrypt
        const comparepassword = await bcrypt.compare(password, professional.password)
        if (!comparepassword) {
            success = false;
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }
        const data = {
            professional: {
                id: professional.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server Error');
    }
})


router.get('/getprofs', fetchprofs, async (req, res) => {
    try {
        const profsId = req.professional.id;
        console.log('profsId:', profsId);

        const professional = await Professional.findById(profsId).select("-password");
        console.log('profession:', professional);

        if (!professional) {
            console.log('Professional not found');
            return res.status(404).json({ error: 'Professional not found' });
        }

        res.json(professional);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});



router.get('/profdetail/:profId', async (req, res) => {
    try {
        const { profId } = req.params;
        const detials = await Professional.findById(profId).select("-password");
        // console.log(detials)
        res.json(detials);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});

router.get('/fetchallprofessionals', async (req, res) => {
    try {
        const professionals = await Professional.find().select("-password");
        res.json(professionals);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});


let h = [fetchuser, fetchprofs]
router.post('/bookservice/:professionalId', h, async (req, res) => {
    try {
        const { professionalId } = req.params;
        const {instruction}=req.body;
        let userId;
        let user_name;
        userId = req.user.id; // If user is logged in
        user_name = await User.findById(userId);

        if (!user_name || Object.keys(user_name).length === 0) {
            userId = req.professional.id;   // Applying fetchprofs middleware
            
            await fetchprofs(req, res, async () => {
                user_name = await Professional.findById(userId);    // Now try fetching user_name again
                console.log(user_name);
            });
        }

        const prof_name = await Professional.findById(professionalId);

        if (!user_name) {
            console.log('user')
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user_name.subscription) {
            return res.status(400).json({ error: 'Please subscribe to book services' });
        }

        if (user_name.subscriptionStatus=="pending") {
            return res.status(400).json({ error: 'Please wait a few minutes to approve the subscription' });
        }

        if (!prof_name) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        const completionOTP = Math.floor(1000 + Math.random() * 9000);

        const serviceRequest = new ServiceRequest({
            professionalId,
            customerId: userId,
            status: 'pending',
            customerName: user_name.name,
            customerEmail: user_name.email,
            professionalName: prof_name.name,
            professionalEmail: prof_name.email,
            serviceName: prof_name.category,
            userlocation: {
                type: 'Point',
                coordinates: [user_name.location.coordinates[0], user_name.location.coordinates[1]],
            },
            proflocation: {
                type: 'Point',
                coordinates: [prof_name.location.coordinates[0], prof_name.location.coordinates[1]],
            },
            completionOTP: completionOTP,
            instruction:instruction
        });

        await serviceRequest.save();

        // console.log(user_name.email);
        // const subRouter = express.Router();
        // router.subRouter('/sendmail',sendEmail);

        // send mail 
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_MAIL, // generated ethereal user
                pass: process.env.SMTP_PASSWORD, // generated ethereal password
            },
        });

        const emailContent = `Dear ${prof_name.name}, your ${prof_name.category} related services with ${user_name.name} has been booked successfully please check further detials in portal.`;

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            // to: 'mauryahemant202@gmail.com', // Sending email to the user
            to: serviceRequest.professionalEmail,
            subject: 'Service Booking Confirmation',
            text: emailContent, // You can customize the email content
        };

        await transporter.sendMail(mailOptions);
        console.log('mail send succesfuly')

        // Send a success response
        res.status(201).json({ message: 'Service booked successfully', serviceRequest });
    } catch (error) {
        console.error('Error booking service:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.post('/acceptservice/:requestId', fetchprofs, async (req, res) => {
    try {
        const profId = req.professional.id;
        const requestId = req.params.requestId;

        // Assuming you have a ServiceRequest model
        const serviceRequest = await ServiceRequest.findById(requestId);

        if (!serviceRequest) {
            return res.status(404).json({ error: 'Service request not found' });
        }

        // Ensure that the professional accepting the request matches the professional ID in the service request
        if (serviceRequest.professionalId.toString() !== profId) {
            return res.status(403).json({ error: 'Unauthorized access to this service request' });
        }

        // For example, update the status to 'accepted'
        serviceRequest.status = 'accepted';
        await serviceRequest.save();

        
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_MAIL, // generated ethereal user
                pass: process.env.SMTP_PASSWORD, // generated ethereal password
            },
        });

        const emailContent = `Dear ${serviceRequest.customerName},

          We are pleased to inform you that your service request for ${serviceRequest.serviceName} has been accepted by our professional, ${serviceRequest.professionalName}.\n
          \tDate and Time of Service: ${serviceRequest.createdAt}\n
          Please ensure that you are available at the specified date, time, and location for the service.\n
          If you have any further questions or need assistance, feel free to contact us.\n\n
          Thank you for choosing our services,\n
          Servicehub`



        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: serviceRequest.customerEmail, // Sending email to the user
            subject: 'Service Acceptance Confirmation',
            text: emailContent, // You can customize the email content
        };

        await transporter.sendMail(mailOptions);
        console.log('mail send succesfuly')

        res.json({ success: true, message: 'Service request accepted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/fetchorderrequest', fetchprofsfororder, async (req, res) => {
    try {
        const profId = req.professional.id;
        console.log(profId);
        // Assuming you have a ServiceRequest model
        const serviceRequests = await ServiceRequest.find({ professionalId: profId });

        res.json(serviceRequests);
    } catch (error) {
        console.error('Error fetching service requests:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/fetchservicerequests', async (req, res) => {
    try {
        const serviceRequests = await Professional.find();

        res.json(serviceRequests);
    } catch (error) {
        console.error('Error fetching service requests:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.get('/booked-services/:customerId', fetchuser, async (req, res) => {
    try {
        const customerId = req.params.customerId;

        const bookedServices = await ServiceRequest.find({ customerId });

        res.json(bookedServices);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.put(
    '/update-location',
    [
        fetchprofs, // Ensure the user is authenticated
        body('latitude', 'Enter a valid latitude').isNumeric(),
        body('longitude', 'Enter a valid longitude').isNumeric(),
    ],
    async (req, res) => {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { latitude, longitude } = req.body;
            const profId = req.professional.id;

            // Update user's location in the database
            const updatedProfessional = await Professional.findByIdAndUpdate(
                profId,
                {
                    $set: {
                        location: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)],
                        },
                    },
                },
                { new: true }
            );

            res.json({ success: true, message: 'Location updated successfully', professional: updatedProfessional });
        } catch (error) {
            console.error('Error updating location:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);




router.get('/fetchprofessionalsbycategory/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const professionals = await Professional.find({ category }).select("-password");
        res.json(professionals);
    } catch (error) {
        console.error('Error fetching professionals by category:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.put('/cancelservice/:requestId', fetchprofs || fetchuser, async (req, res) => {
    try {

        const requestId = req.params.requestId;
      
        const serviceRequest = await ServiceRequest.findById(requestId);

        if (!serviceRequest) {
            return res.status(404).json({ error: 'Service request not found' });
        }

       
        serviceRequest.status = 'canceled';
        await serviceRequest.save();

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_MAIL, // generated ethereal user
                pass: process.env.SMTP_PASSWORD, // generated ethereal password
            },
        });

        const emailContent = `Dear ${serviceRequest.customerName},,

          We regret to inform you that your ${serviceRequest.serviceName} with ${serviceRequest.professionalName} service request has been canceled.\n
          Please feel free to contact us if you have any questions or require further assistance.\n\n
          Thank you,\n
          Servicehub`

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: serviceRequest.customerEmail, // Sending email to the user
            subject: 'Service Cancellation Confirmation',
            text: emailContent, // You can customize the email content
        };

        await transporter.sendMail(mailOptions);
        console.log('mail send succesfuly')

        res.json({ success: true, message: 'Service request canceled successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


//city wise display services
router.get('/fetchprofessionalsbycity/:city', async (req, res) => {
    const { city } = req.params;
    try {
        const professionals = await Professional.find({ city });
        res.json(professionals);
    } catch (error) {
        console.error('Error fetching professionals by city:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

//fetch services
router.get('/fetchservicedetail/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const service = await ServiceRequest.findById(id);
        res.json(service)
    } catch (error) {
        console.error('Error fetching professionals by city:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
})

router.post('/ratings', async (req, res) => {
    try {
        const { serviceId, userId, profId, rating, feedback } = req.body;
        const newRating = new Rating({
            serviceId,
            userId,
            profId,
            rating,
            feedback
        });
        await newRating.save();

        const professional = await Professional.findById(profId);

        if (!professional) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        if (professional.ratings.hasOwnProperty(rating)) {
            professional.ratings[rating]++;
        } else {
            return res.status(400).json({ error: 'Invalid rating value' });
        }
        await professional.save();


        res.status(201).json({ message: 'Rating saved successfully' });
    } catch (error) {
        console.error('Error saving rating:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getratings/:profId', async (req, res) => {
    try {
        const { profId } = req.params;

        // Find ratings with the specified profId
        const ratings = await Rating.find({ profId });

        res.json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});




router.delete('/deleteprofessional/:professionalId', async (req, res) => {
    const professionalId = req.params.professionalId; // Corrected parameter name
    try {
        await Professional.findByIdAndDelete(professionalId);
        console.log('Professional deleted successfully');
        res.status(200).json({ message: 'Professional deleted successfully' });
    } catch (error) {
        console.error('Error deleting professional:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/ratings/:profId', async (req, res) => {
    const profId = req.params.profId;

    try {
        // Send request to fetch data based on profId
        const ratings = await Rating.find({ profId: profId }).exec();
        res.json(ratings);
    } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
})

router.put('/subscription',fetchuser,async(req,res)=>{
    try {
        const { transactionId } = req.body;
        const userId = req.user.id;
        let user = await User.findByIdAndUpdate(userId, { subscription: transactionId }, { new: true }); 
        res.json(user);
    }
    catch (error) {
        console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data" });
    }
}) 


router.get("/getProfessionalCount", async (req, res) => {
    try {
      const professionalCount = await Professional.countDocuments();
      res.json({ count: professionalCount });
    } catch (error) {
      console.error("Error fetching professional count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });




router.post('/completeservice/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const { otpInputs } = req.body;
       
        console.log('Request ID:', requestId);
        console.log('OTP Inputs:', otpInputs);

        const serviceRequest = await ServiceRequest.findById(requestId);

        if (!serviceRequest) {
            return res.status(404).json({ error: 'Service request not found' });
        }

      
        const otpInputForRequest = otpInputs[requestId];
        if (!otpInputForRequest || otpInputForRequest !== serviceRequest.completionOTP.toString()) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }


        serviceRequest.status = 'completed';
        await serviceRequest.save();

        res.status(200).json({ message: 'Service completed successfully' });
    } catch (error) {
        console.error('Error completing service:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;