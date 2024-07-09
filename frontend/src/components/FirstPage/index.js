import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./index.css";

const FirstPage = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [adminName, setAdminName] = useState("principal");
    const correctPassword = "admin123"; // Replace this with the actual password

    const handleAdminClick = () => {
        setShowPopup(true);
        setError("");
        setPassword("");
    };

    const handleStudentClick = () => {
        navigate('/students');
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handlePasswordSubmit = () => {
        if (password === correctPassword) {
            setShowPopup(false);
            navigate(`/${adminName.toLowerCase()}-login`);
        } else {
            setError("Incorrect password");
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="first-page-bg-container">
            <div className='first-page-container'>
            <div className='top-hading-container'>
          <div className='college-info-container'>
            <img className='svc-logo' src="https://res.cloudinary.com/di1e0mwbu/image/upload/v1711821173/wwhvi3uj82w507nruua6.jpg" alt="SVC Logo" />
            <div className='college-heading-container'>
              <h1>SRI VENKATESWARA COLLEGE OF ENGINEERING & TECHNOLOGY</h1>
              <p>Approved by AICTE, New Delhi, Affiliated to JNTUK, Vizianagaram  ISO 9001:2015 Certified</p>
              <p>Contact: +91 9705576693  Email: principal_svcet@yahoo.com,www.svcet.net</p>
              <h3>Student Feedback System</h3>
            </div>
          </div>
        </div>
        {/* <h1>Student Feedback System</h1> */}
            <div className="first-page-inner-container">
             
                <div className="first-page-admin-container" onClick={handleAdminClick}>
                    <img src="/faculty-admin.png" alt="Admin" className="faculty-admin-img" />
                    <h1>Admin</h1>
                </div>
                <div className="first-page-admin-container" onClick={handleStudentClick}>
                    <img src="/student-admin.png" alt="Student" className="student-admin-img" />
                    <h1>Student</h1>
                </div>
            </div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h2>Enter Admin Password</h2>
                        <select onChange={(event) => setAdminName(event.target.value)}>
                            <option value="Principal">Principal</option>
                            <option value="Hod">Hod</option>
                        </select>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={handlePasswordChange} 
                            placeholder="Password" 
                        />
                        <button className='home-submit-button' onClick={handlePasswordSubmit}>Submit</button>
                        <button onClick={handleClosePopup}>Close</button>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default FirstPage;
