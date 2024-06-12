import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Nav = () => {
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  //active the tab which is clicked by user
  let location = useLocation();
  useEffect(() => {}, [location]);

  const isLoggedIn = localStorage.getItem("token");

  return (
    <>
        <nav>

          <ul className="nav-bar">
            <li className="logo"> <Link to="/"><img src="/images/logo.png" alt="img" /> Service Hub</Link> </li>
            <input type="checkbox" id="check" />

            <span className="menu">
              {!isLoggedIn && (
                <>
                  <li className="nav-item"> <Link className="nav-link" aria-current="page" to="/">Home</Link> </li>
                  <li className="nav-item"> <Link className="nav-link" to="/about">About</Link> </li>
                  <li className="nav-item"> <Link className="nav-link" to="/proflogin">Professionals</Link> </li>
                  <li className="nav-item"> <Link className="nav-link" to="/adminlogin">Admin</Link> </li>
                  <li className="nav-link"> <Link to="/login" role="button">Login</Link> </li>
                </>
              )}

              {isLoggedIn && (
                <>
                  <li className="nav-item"> <Link className="nav-link" to="/">Home</Link> </li>
                  <li className="nav-item"> <Link className="nav-link" to="/bookservice">Book Service</Link> </li>
                  <li className="nav-item"> <Link className="nav-link" to="/orders">Orders</Link> </li>
                  <li className="nav-item"> <Link className="nav-link" to="/about">About</Link> </li>
                  <li className="nav-item"> <Link className="nav-link" to="/profile">Profile</Link> </li>
                  <li className="nav-item"> <Link className="nav-link" to="/payment">Subscription</Link> </li>
                  <li className="nav-item"> <Link className="nav-link" to="/proflogin">Professionals</Link> </li>
                  
                  <li className="nav-link"> <Link onClick={handleLogout} to="/">Logout</Link> </li>
                </>
              )}

              <label htmlFor="check" className="close-menu">
                <i className="fas fa-times"></i>
              </label>

            </span>

            <label htmlFor="check" className="open-menu"> <i className="fas fa-bars"></i> </label>

          </ul>

        </nav>
    </>
  );
};

export default Nav;
