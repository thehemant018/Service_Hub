import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'


const About = () => {
  const navigate=useNavigate();
  const [query, setQuery] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:1818/api/query/upload-query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });

    const json = await response.json();

    if (json.message === 'Query uploaded successfully') {
      alert("Query uploaded successfully");
      navigate('/about')
    }
    
    else {
      alert("Error uploading query");
    }
  };

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };
  
 
  return (
    <>

    
      <div className="about-content">
        
        <div className="letstalk">
          <h3 className="h3-title">Let's Talk</h3>
          <p>We collaborate with our thousands of service provider, enterpreneurs and complete legends</p>
          <hr className='about-hr' />

          <div className="about-email">
            <img src="/images/email.jpg" alt="email" />
            <div className="about-text">
              <p><b>Our Email</b></p>
              <p>servicehub18@gmail.com</p>
            </div>
          </div>

          <div className="about-call">
            <img src="/images/call.jpg" alt="call" />
            <div className="about-text">
              <p><b>Call us</b></p>
              <p>1234567890</p>
            </div>
          </div>

          <div className="about-find">
            <img src="/images/location.jpg" alt="location" />
            <div className="about-text">
              <p><b>Find us</b></p>
              <p>Open Google Maps</p>
            </div>
          </div>

          <hr className='about-hr' />

          <div className="about-links">
            <Link to="#"><img src="/images/facebook.png" alt="facebook" /></Link>
            <Link to="#"><img src="/images/instagram.png" alt="instagram" /></Link>
            <Link to="#"><img src="/images/linkedin.png" alt="linkedin" /></Link>
          </div>
        </div>

        <form method="post" className='about-form' onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" className='about-input' value={query.firstName} onChange={handleChange} required/>
          </div>

          <div>
            <label htmlFor="LastName">Last Name</label>
            <input type="text" id="LastName" name="lastName" className='about-input' value={query.lastName} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" className='about-input' value={query.email} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" name="phone" className='about-input' value={query.phone} onChange={handleChange} required />
          </div>

          <label htmlFor="message">Message</label>
          <input type="text" id="message" name="message" className='about-input' value={query.message} onChange={handleChange} required />

          <input type="submit" value="Submit Now" className='about-submit' />
        </form>

        <div className="about-map">
          <Link to='https://www.google.com/maps/place/A.+D.+Patel+Institute+of+Technology,+New+Vallabh+Vidyanagar/@22.5215561,72.9138887,17z/data=!3m1!4b1!4m6!3m5!1s0x395e4d93862df729:0xadbe2043bbfd455b!8m2!3d22.5215561!4d72.9164636!16s%2Fm%2F0j26qms?authuser=0&entry=ttu' target='_blank' /><img src='/images/map.jpg' alt='img'/>
        </div>

        <div className="ourteam">
          <h1>Our Team</h1>

          <div className="team-section">
            
            <div className="team-member">
              <div className="about-img">
                <img src="/images/hemant.jpg" alt="Hemant Maurya" />
                <div className="about-icon">
                  <Link to="#"><img src="/images/facebook.png" alt="facebook" /></Link>
                  <Link to="#"><img src="/images/instagram.png" alt="instagram" /></Link>
                  <Link to="#"><img src="/images/linkedin.png" alt="linkedin" /></Link>
                </div>
              </div>
              <p className="member-name">Hemant Maurya</p>
            </div>

            <div className="team-member">
              <div className="about-img">
                <img src="/images/adarsh.jpg" alt="Adarsh Patel" />
                <div className="about-icon">
                  <Link to="#"><img src="/images/facebook.png" alt="facebook" /></Link>
                  <Link to="#"><img src="/images/instagram.png" alt="instagram" /></Link>
                  <Link to="#"><img src="/images/linkedin.png" alt="linkedin" /></Link>
                </div>
              </div>
              <p className="member-name">Adarsh Patel</p>
            </div>

            <div className="team-member">
              <div className="about-img">
                <img src="/images/darshit.jpg" alt="Darshit Yadav" />
                <div className="about-icon">
                  <Link to="#"><img src="/images/facebook.png" alt="facebook" /></Link>
                  <Link to="#"><img src="/images/instagram.png" alt="instagram" /></Link>
                  <Link to="#"><img src="/images/linkedin.png" alt="linkedin" /></Link>
                </div>
              </div>
              <p className="member-name">Darshit Yadav</p>
            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default About
