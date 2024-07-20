import { PiArrowLineRightBold } from "react-icons/pi";
import { IoSettings } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import React, { Component } from "react";
import Chart from 'chart.js/auto';
import Cookies from 'js-cookie';
import "./index.css";
import svcLogo from "../../images/svclogo.jpg";
import principalStudentsImage from '../../images/principalstudents.jpg';
const branchList = ["CSE", "AIML", "CSM", "ECE", "EEE", "CIVIL", "MECH"];


class Principal extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  state = {
    department: branchList[0],
    semester: "1-1",
    academicYear: "2024-2025",
    no_subjects: 0,
    subjectsBasedOnInput: [],
    facultyNames: [],
    formId: null,
    section: "A",
    feedback: 1,
    showTablePage: false,
    feedbackList: [],
    totalSubmissions: null,
    clicked: false,
    clickedIndex: null,
    showGraph: true,
    menuOpen: false // New state for menu visibility
  };

  onSetFormName = (e) => this.setState({ formName: e.target.value });
  onSetDepartment = (e) => this.setState({ department: e.target.value });
  onSetSemester = (e) => this.setState({ semester: e.target.value });
  onSetYear = (e) => this.setState({ academicYear: e.target.value });
  onSetNoSubjects = (e) => {
    const numSubjects = parseInt(e.target.value);
    this.setState({ no_subjects: numSubjects, subjects: Array.from({ length: numSubjects }, () => ({ subjectName: "", facultyName: "" })) });
  };

  onClickLogout = () => {
    Cookies.remove('principal_jwt_token');
    window.location.replace('/principal-login');
  };

  onClickSettings = () => {
    this.setState(prevState => ({ menuOpen: !prevState.menuOpen }));
  };

  onChangeSection = (e) => this.setState({ section: e.target.value });
  onChangeFeedBackAttempt = (e) => this.setState({ feedback: e.target.value });

  displayFacultyAndSubjects = async (e) => {
    e.preventDefault();
    const { department, semester, academicYear, section, feedback } = this.state;

    if (department && section && semester && academicYear && feedback) {
      try {
        const response = await fetch('https://student-feedback-system-8ln5.onrender.com/fetchFacultyAndSubjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ department, semester, academicYear, section, feedback })
        });

        if (!response.ok) {
          alert("No data found");
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const { facultyNames, subjectNames, formId, totalSubmissions } = data;
        const { total_submissions } = totalSubmissions;
        const { form_id } = formId;

        this.setState({
          facultyNames,
          subjectsBasedOnInput: subjectNames,
          formId: form_id,
          showTablePage: true,
          totalSubmissions: total_submissions
        }, () => this.onClickFacultySubject(0));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      console.error("Required fields are missing");
      alert("Please submit all inputs");
    }
  };

  onClickFacultySubject = async (index) => {
    const { facultyNames, subjectsBasedOnInput, formId } = this.state;
    const subjectName = subjectsBasedOnInput[index];
    const facultyName = facultyNames[index];

    try {
      const response = await fetch('https://student-feedback-system-8ln5.onrender.com/checkResults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectName, facultyName, formId })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      this.setState({ feedbackList: data.feedBackList, totalSubmissions: data.totalSubmissions.total_submissions });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    this.setState({
      clicked: true,
      clickedIndex: index
    });
  };

  renderBarGraph() {
    const { feedbackList, totalSubmissions } = this.state;

    if (feedbackList.length === 0 || !totalSubmissions) {
      console.error('Feedback list is empty or total submissions are not available');
      return;
    }

    if (!this.chartRef.current) {
      console.error('Canvas element is not available');
      return;
    }

    const ctx = this.chartRef.current.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is not available');
      return;
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const categories = feedbackList.map((item) => item.category);
    const totalPercentage = feedbackList.map((item) => ((item.rating / (totalSubmissions * 4)) * 100).toFixed(2));

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Total Percentage',
            data: totalPercentage,
            backgroundColor: "#0E2954",
            borderColor: '#FFEBB2',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
          x: { stacked: true },
        },
      },
    });
  }

  componentDidMount() {
    this.renderBarGraph();
  }

  componentDidUpdate() {
    this.renderBarGraph();
  }

  onClickBack = () => this.setState({
    department: branchList[0],
    semester: "1-1",
    academicYear: "2024-2025",
    no_subjects: 0,
    subjectsBasedOnInput: [],
    facultyNames: [],
    formId: null,
    section: "A",
    feedback: 1,
    showTablePage: false,
    feedbackList: [],
    totalSubmissions: null,
    clicked: false,
    clickedIndex: null
  });

  toggleView = () => {
    this.setState((prevState) => ({
      showGraph: !prevState.showGraph
    }));
  };

  renderTable() {
    const { feedbackList, totalSubmissions } = this.state;

    return (
      <table className="principal-table">
        <thead style={{ height: "70px" }}>
          <tr>
            <th style={{ borderTopLeftRadius: "10px" }}>Category</th>
            <th style={{ borderTopRightRadius: "10px" }}>Total Percentage</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td className="category-row">{item.category}</td>
              <td className="percentage-row">
                <div className="percentage-cell">
                  {((item.rating / (totalSubmissions * 4)) * 100).toFixed(2)}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    const { feedback, subjectsBasedOnInput, facultyNames, showTablePage, clicked, clickedIndex, semester, department, section, totalSubmissions, showGraph, menuOpen } = this.state;
    console.log(totalSubmissions);

    return (
      <div className="hod-bg-container">
        <div className='top-hading-container'>
          <div className='college-info-container'>
            <img className='svc-logo' src={svcLogo} alt="SVC Logo" />
            <div className='college-heading-container'>
              <h1>SRI VENKATESWARA COLLEGE OF ENGINEERING & TECHNOLOGY</h1>
              <p>Approved by AICTE, New Delhi, Affiliated to JNTUGV, Vizianagaram  ISO 9001:2015 Certified</p>
              <p>Contact: +91 9705576693  Email: principal_svcet@yahoo.com,www.svcet.net</p>
            </div>
            <button
              type="button"
              className="settings-btn"
              onClick={this.onClickSettings}
            >
             
              Settings{ }   
              < IoSettings  className="settings-icon"/>
            </button>
            
          </div>
        </div>

        <div className={`settings-menu ${menuOpen ? 'open' : ''}`}>
        <div className="icon-container">
      <PiArrowLineRightBold className="custom-icon"  onClick={this.onClickSettings}/>
        </div>
          <button type="button" className="principal-logout-btn " onClick={this.onClickLogout}>Logout <  LuLogOut className="logout-icon"/></button>
          <button type="button" className="show-register-btn">Show Register Button</button>
          <button type="button" className="change-password-btn">Change Password</button>
        </div>

        {!showTablePage ? (
          <>
            <h1 style={{ color: "#03506F", textAlign: "center" }}>Please Check Feedback Review</h1>
            <div className="principal-form-bg-container">
              <form className="principal-form" onSubmit={this.displayFacultyAndSubjects}>
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
                  <label htmlFor="year">Current Academic Year</label>
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
                <div style={{ textAlign: 'center' }}>
                  <button type="submit" className="principal-submit-btn">
                    Submit
                  </button>
                </div>
              </form>
              <div className='hod-previous-forms-container'>
                <img className='principal-panel-img' src={principalStudentsImage} alt="students-img"/>
              </div>
            </div>
          </>
        ) : (
          <div className="principal-faculty-result-container">
            <div className="feedback-data-info-bg-container">
              <div className="principal-class-room-info">
                <h4 style={{ height: "20px", margin: "0px", marginBottom: "2px" }}>Department: {department}</h4>
                <h4 style={{ height: "20px", margin: "0px", marginBottom: "2px" }}>Semester: {semester}</h4>
                <h4 style={{ height: "20px", margin: "0px", marginBottom: "2px" }}>Section: {section}</h4>
                <h4 style={{ height: "20px", margin: "0px" }}>Academic Year: {this.state.academicYear}</h4>
                <h4 style={{ height: "20px", margin: "0px" }}>Review: {feedback}</h4>
                <h4 style={{ height: "20px", margin: "0px" }}>Feedback Submitted by: {totalSubmissions} Students</h4>
              </div>
              <div>
                <h2 style={{ textAlign: 'center', color: '#074173' }}>Faculty and Subject Names:</h2>
                <ul className="principal-faculty-names">
                  {facultyNames.map((faculty, index) => (
                    <li
                      key={index}
                      onClick={() => this.onClickFacultySubject(index)}
                      className={clicked && clickedIndex === index ? 'principal-clicked' : 'principal-not-clicked'}
                    >
                      {faculty.faculty_name}: {subjectsBasedOnInput[index].subject_name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="table-back-container">
                <button type="button" className="back-btn" onClick={this.onClickBack}>Back</button>
                <button type="button" className="toggle-view-btn" onClick={this.toggleView}>
                  {showGraph ? 'Show Table' : 'Show Graph'}
                </button>
              </div>
            </div>
            <div className="table-graph-container">
              {showGraph ? (
                <canvas ref={this.chartRef}></canvas>
              ) : (
                this.renderTable()
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Principal;
