// HodAdminPanel.js
import Cookies from 'js-cookie';
import React, { Component } from "react";
import "./index.css";

const branchList = ["CSE", "AIML", "CSM", "ECE", "EEE", "CIVIL", "MECH"];
class HodAdminPanel extends Component {
  state = {
    formName: "",
    department: branchList[0],
    semester: "1-1",
    academicYear: "2024-2025",
    no_subjects: 0,
    subjects: [],
    section: "A",
    feedback: 1,
  };

  onSetFormName = (e) => {
    this.setState({ formName: e.target.value });
  };

  onSetDepartment = (e) => {
    this.setState({ department: e.target.value });
  };

  onSetSemester = (e) => {
    this.setState({ semester: e.target.value });
  };

  onSetYear = (e) => {
    this.setState({ academicYear: e.target.value });
  };

  onSetNoSubjects = (e) => {
    const numSubjects = parseInt(e.target.value);
    this.setState({ no_subjects: numSubjects });

    // Initialize subjects array with unique objects for each element
    const subjects = Array.from({ length: numSubjects }, () => ({
      subjectName: "",
      facultyName: "",
    }));
    this.setState({ subjects });
  };

  onSetSubjectName = (index, e) => {
    const { subjects } = this.state;
    const newSubjects = [...subjects];
    newSubjects[index].subjectName = e.target.value;
    this.setState({ subjects: newSubjects });
  };

  onSetFacultyName = (index, e) => {
    const { subjects } = this.state;
    const newSubjects = [...subjects];
    newSubjects[index].facultyName = e.target.value;
    this.setState({ subjects: newSubjects });
  };

  onClickLogout = () => {
    Cookies.remove('jwt_token');
    window.location.replace('/hod-login');
  }; 

  onChangeSection = (e) => this.setState({ section: e.target.value });

  handleSubmit = async (e) => {
    e.preventDefault();

    const {
      formName,
      department,
      section,
      semester,
      academicYear,
      subjects,
      feedback,
    } = this.state;

    // Check if required fields are not empty strings
    if (
      formName !== "" &&
      department !== "" &&
      section !== "" &&
      semester !== "" &&
      academicYear !== "" &&
      subjects.length > 0 &&
      feedback !== ""
    ) {
      const formData = {
        formName,
        department,
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
        }
        else{
          const data = await response.json();
          alert("Successfully Feedback form created")
        }

        
        // Handle success, e.g., show a success message to the user
      } catch (error) {
        console.error("Error:", error);
        alert(error.message); // Show error message to the user
      }
    } else {
      console.error("Required fields are missing");
      alert("Please submit the all inputs");
      // Handle the case where required fields are missing
    }
  };

  renderSubjectInputs = () => {
    const { subjects } = this.state;
    return subjects.map((subject, index) => (
      <div className="hod-input-take-container" key={index}>
        <label htmlFor={`subject-${index + 1}`}>Subject {index + 1}:</label>
        <input
          className="hod-input"
          type="text"
          id={`subject-${index + 1}`}
          value={subject.subjectName}
          onChange={(e) => this.onSetSubjectName(index, e)}
          placeholder={`Enter Subject ${index + 1}`}
        />
        <input
          className="hod-input"
          type="text"
          value={subject.facultyName}
          onChange={(e) => this.onSetFacultyName(index, e)}
          placeholder={`Enter Faculty Name for Subject ${index + 1}`}
        />
      </div>
    ));
  };

  onChangeFeedBackAttempt = (e) => this.setState({ feedback: e.target.value });

  render() {
    return (
      <div className="hod-bg-container">
      <div className='top-hading-container'>
  <div className='college-info-container'>
    <img className='svc-logo' src="https://res.cloudinary.com/di1e0mwbu/image/upload/v1711821173/wwhvi3uj82w507nruua6.jpg" alt="SVC Logo" />
    <div className='college-heading-container'>
      <h1>SRI VENKATESWARA COLLEGE OF ENGINEERING & TECHNOLOGY</h1>
      <p>Approved by AICTE, New Delhi, Affiliated to JNTUK, Vizianagaram  ISO 9001:2015 Certified</p>
      <p>Contact: +91 9705576693  Email: principal@svcet.edu.in</p>
    </div>
    <button
      type="button"
      className="logout-btn"
      onClick={this.onClickLogout}
    >
      Logout
    </button>
    
  </div>
</div>
        <div className='hod-form-bg-container'>
        <form className="hod-form" onSubmit={this.handleSubmit}>
        <h1 style={{ textAlign: 'center' }}>Please Create Feedback Form</h1>

          <div className="hod-input-take-container">
            <label htmlFor="formName">Form Name</label>
            <input
              className="hod-input"
              onChange={this.onSetFormName}
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
              onChange={this.onSetDepartment}
              id="department"
              name="department"
              value={this.state.department}
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
              onChange={this.onSetSemester}
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
            <label htmlFor="year">Current Acadamic-year</label>
            <select
              className="hod-input"
              onChange={this.onSetYear}
              id="year"
              name="year"
              value={this.state.academicYear}
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2027-2028">2027-2028</option>
              <option value="2028-2029">2028-2029</option>
            </select>
          </div>
          <div className="hod-input-take-container">
            <label htmlFor="noSubjects">Number of Subject</label>
            <input
              className="hod-input"
              onChange={this.onSetNoSubjects}
              type="number"
              placeholder="Enter Number of Subjects"
              name="noSubjects"
              id="noSubjects"
              min="1"
            />
          </div>
          <div className="subject-input-container">{this.renderSubjectInputs()}</div>

          <div className="hod-input-take-container">
            <label htmlFor="section"> Class Section Name</label>
            <select
              className="hod-input"
              id="section"
              onChange={this.onChangeSection}
              value={this.state.section}
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
              onChange={this.onChangeFeedBackAttempt}
              value={this.state.feedback}
            >
              <option value={1}>1st time</option>
              <option value={2}>2nd time</option>
              <option value={3}>3rd time</option>
            </select>
          </div>
          <div  style={{ textAlign: 'center' }}>
          <button type="submit" className="hod-submit-btn">
  Submit
</button>
</div>
        </form>
        <div className='hod-previous-forms-container'>
          <h1>hii</h1>
        </div>
        </div>
      </div>
    );
  }
}

export default HodAdminPanel;
