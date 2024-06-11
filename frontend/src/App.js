import './App.css';
import React,{useState,useEffect} from 'react';
import { BrowserRouter, Route, Routes,useLocation } from "react-router-dom";
import Nav from './components/Nav';
import Home from './components/Home';
import About from './components/About';
import Signup from './components/Signup';
import Login from './components/Login';
import Professionals from './components/Professionals';
import ProfLogin from './components/ProfLogin';
import Order from './components/Order';
import Profile from './components/Profile';
import SelectService from './components/SelectService';
import Footer from './components/Footer';
import Bookservice from './components/Bookservice';
import ServiceFeedbackDetail from './components/ServiceFeedbackDetail';
import ProfDetail from './components/ProfDetail';
import AdminPage from './components/AdminPage';
import AdminLogin from './components/AdminLogin';
import AdminSignup from './components/AdminSignup';
import Subscription from './components/Subscription';

import LoadingBar from 'react-top-loading-bar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [progress, setProgress] = useState(0);

  
  return (
    <>
      <BrowserRouter>
        <Nav />
        
        <LoadingBar
        color='#00FFFF'
        progress={progress}
        // onLoaderFinished={() => setProgress(100)}
      />

        <Routes>
          <Route exact path="/" element={<Home setProgress={setProgress} />}></Route>
          <Route exact path="/about" element={<About setProgress={setProgress} />}></Route>
          <Route exact path="/signup" element={<Signup setProgress={setProgress} />}></Route>
          <Route exact path="/login" element={<Login setProgress={setProgress} />}></Route>
          <Route exact path="/profsignup" element={<Professionals setProgress={setProgress} />}></Route>
          <Route exact path="/proflogin" element={<ProfLogin setProgress={setProgress} />}></Route>
          <Route exact path="/orders" element={<Order setProgress={setProgress} />}></Route>
          <Route exact path="/profile" element={<Profile setProgress={setProgress} />}></Route>
          <Route exact path="/bookservice" element={<Bookservice setProgress={setProgress} />}></Route>
          <Route exact path="/service-feedback/:id/:userId/:profId" element={<ServiceFeedbackDetail setProgress={setProgress} />}></Route>
          <Route exact path="/profdetail" element={<ProfDetail setProgress={setProgress}/>}></Route>
          <Route exact path="/adminsignup" element={<AdminSignup setProgress={setProgress} />}></Route>
          <Route exact path="/adminlogin" element={<AdminLogin setProgress={setProgress} />}></Route>
          <Route exact path="/admin" element={<AdminPage setProgress={setProgress} />}></Route>
          <Route exact path="/service/:id" element={<SelectService  setProgress={setProgress}/>} />
          <Route exact path="/payment" element={<Subscription setProgress={setProgress} />}></Route>
        </Routes>
        
        <ToastContainer theme="dark"/>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
