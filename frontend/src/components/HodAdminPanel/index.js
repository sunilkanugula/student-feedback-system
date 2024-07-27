import Cookies from 'js-cookie';
import React, { useState, useContext } from "react";
import FeedbackContext from "../../context/FeedbackContext.js";
import { Navigate, useNavigate } from "react-router-dom";
import "./index.css";
import svcLogo from "../../images/svclogo.jpg"

const branchList = ["CSE", "AIML", "CSM", "ECE", "EEE", "CIVIL", "MECH"];

const HodAdminPanel = () => {
  const [formName, setFormName] = useState("");
  const [semester, setSemester] = useState("1-1");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [noSubjects, setNoSubjects] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [section, setSection] = useState("A");
  const [feedback, setFeedback] = useState(1);
  const { hodBranch } = useContext(FeedbackContext);
  const navigate = useNavigate();

  const onSetFormName = (e) => setFormName(e.target.value);
  const onSetSemester = (e) => setSemester(e.target.value);
  const onSetYear = (e) => setAcademicYear(e.target.value);

  const onSetNoSubjects = (e) => {
    const numSubjects = parseInt(e.target.value);
    setNoSubjects(numSubjects);

    const subjectsArray = Array.from({ length: numSubjects }, () => ({
      subjectName: "",
      facultyName: "",
    }));
    setSubjects(subjectsArray);
  };

  const onSetSubjectName = (index, e) => {
    const newSubjects = [...subjects];
    newSubjects[index].subjectName = e.target.value;
    setSubjects(newSubjects);
  };

  const onSetFacultyName = (index, e) => {
    const newSubjects = [...subjects];
    newSubjects[index].facultyName = e.target.value;
    setSubjects(newSubjects);
  };

  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/hod-login');
  };

  const onChangeSection = (e) => setSection(e.target.value);
  const onChangeFeedBackAttempt = (e) => setFeedback(e.target.value);

  const renderSubjectInputs = () => {
    return subjects.map((subject, index) => (
      <div className="hod-input-take-container" key={index}>
        <label htmlFor={`subject-${index + 1}`}>Subject {index + 1}:</label>
        <input
          className="hod-input"
          type="text"
          id={`subject-${index + 1}`}
          value={subject.subjectName}
          onChange={(e) => onSetSubjectName(index, e)}
          placeholder={`Enter Subject ${index + 1}`}
        />
        <input
          className="hod-input"
          type="text"
          value={subject.facultyName}
          onChange={(e) => onSetFacultyName(index, e)}
          placeholder={`Enter Faculty Name for Subject ${index + 1}`}
        />
      </div>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formName !== "" &&
      section !== "" &&
      semester !== "" &&
      academicYear !== "" &&
      subjects.length > 0 &&
      feedback !== ""
    ) {
      const formData = {
        formName,
        department: hodBranch,
        semester,
        academicYear,
        subjects,
        section,
        feedback,
      };

      try {
        const response = await fetch("http://localhost:5000/saveFormData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        } else {
          alert("Successfully Feedback form created");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(error.message);
      }
    } else {
      console.error("Required fields are missing");
      alert("Please submit all inputs");
    }
  };
 
  const branchToken = Cookies.get('branch_token');
  const jwtToken = Cookies.get("jwt_token")
  if(!jwtToken){
   return <Navigate to="/hod-login"/>
  }
  else{

  
  return (
    <div className="hod-bg-container">
      <div className="top-hading-container">
        <div className="college-info-container">
          <img
            className="svc-logo"
            src={svcLogo}
            alt="SVC Logo"
          />
          <div className="college-heading-container">
          <h1>SRI VENKATESWARA COLLEGE OF ENGINEERING & TECHNOLOGY</h1>
              <p>Approved by AICTE, New Delhi, Affiliated to JNTUK, Vizianagaram  ISO 9001:2015 Certified</p>
              <p>Contact: +91 9705576693  Email: principal_svcet@yahoo.com,www.svcet.net</p>
          </div>
          <button
            type="button"
            className="logout-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <h1 style={{ textAlign: "center" }}>
        Please Create Feedback Form
      </h1>
      <div className="hod-form-bg-container">
        <form className="hod-form" onSubmit={handleSubmit}>
          <div className="hod-input-take-container">
            <label htmlFor="formName">Form Name</label>
            <input
              className="hod-input"
              onChange={onSetFormName}
              type="text"
              id="formName"
              name="formName"
              placeholder="Enter Form Name"
            />
          </div>
          <div className="hod-input-take-container">
            <label htmlFor="department">Department</label>
            <select
              className="hod-input"
              id="department"
              name="department"
              value={branchToken}
              disabled
            >
              {branchList.map((each) => (
                <option value={each} key={each}>
                  {each}
                </option>
              ))}
            </select>
          </div>
          <div className="hod-input-take-container">
            <label htmlFor="semester">Semester</label>
            <select
              className="hod-input"
              onChange={onSetSemester}
              name="semester"
              id="semester"
              placeholder="Select Semester"
            >
              <option value="1-1">1-1</option>
              <option value="1-2">1-2</option>
              <option value="2-1">2-1</option>
              <option value="2-2">2-2</option>
              <option value="3-1">3-1</option>
              <option value="3-2">3-2</option>
              <option value="4-1">4-1</option>
              <option value="4-2">4-2</option>
            </select>
          </div>
          <div className="hod-input-take-container">
            <label htmlFor="year">Current Academic Year</label>
            <select
              className="hod-input"
              onChange={onSetYear}
              id="year"
              name="year"
              value={academicYear}
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2027-2028">2027-2028</option>
              <option value="2028-2029">2028-2029</option>
            </select>
          </div>
          <div className="hod-input-take-container">
            <label htmlFor="noSubjects">Number of Subjects</label>
            <input
              className="hod-input"
              onChange={onSetNoSubjects}
              type="text"
              placeholder="Enter Number of Subjects"
              name="noSubjects"
              id="noSubjects"
              min="1"
            />
          </div>
          <div className="subject-input-container">
            {renderSubjectInputs()}
          </div>
          <div className="hod-input-take-container">
            <label htmlFor="section"> Class Section Name</label>
            <select
              className="hod-input"
              id="section"
              onChange={onChangeSection}
              value={section}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <div className="hod-input-take-container">
            <label htmlFor="feedback"> Feedback Attempt</label>
            <select
              className="hod-input"
              id="feedback"
              onChange={onChangeFeedBackAttempt}
              value={feedback}
            >
              <option value={1}>1st time</option>
              <option value={2}>2nd time</option>
              <option value={3}>3rd time</option>
            </select>
          </div>
          <div style={{ textAlign: "center" }}>
            <button type="submit" className="hod-submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
};

export default HodAdminPanel;
