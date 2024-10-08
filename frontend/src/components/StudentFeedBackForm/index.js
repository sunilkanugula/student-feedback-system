import React, { Component } from 'react';
import FeedBackFormCategories from "../feedBackFormCategories";
import Cookies from 'js-cookie';
import "./index.css";
import svcLogo from "../../images/svclogo.jpg"
import sunil from '../../images/sunil.jpg';
import sunil1 from '../../images/sunil1.png';
import studentswithLpatops from "../../images/studentswithLpatops.jpg"
import { Navigate } from 'react-router-dom';

const feedBackFormCategories = [
  { id: 1, name: "Punctuality" },
  { id: 2, name: "Appearance & Personality" },
  { id: 3, name: "Communication skills" },
  { id: 4, name: "Subject preparation" },
  { id: 5, name: "Ability to explain concepts" },
  { id: 6, name: "Depth of Knowledge" },
  { id: 7, name: "Sincerity in Teaching" },
  { id: 8, name: "Using of Notes, printed materials and related reference" },
  { id: 9, name: "Respond to doubts" },
  { id: 10, name: "Conducting of tests" },
  { id: 11, name: "Availability in the staff room" },
  { id: 12, name: "Relationship with Students" },
  { id: 13, name: "Syllabus Coverage" },
  { id: 14, name: "Lecture at different levels" },
  { id: 15, name: "Ability to maintain discipline" },
  { id: 16, name: "Utilizing the class hours effectively with full preparation for the class" }
];



const branchList = [
  "CSE",
  "AIML",
  "CSM",
  "ECE",
  "EEE",
  "CIVIL",
  "MECH"
];

class StudentFeedBackForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: branchList[0],
      semester: "1-1",
      academicYear: "2024-2025",
      classSection: "A",
      subjectType:"Theoretical",
      feedback:1,
      allSubjectsReview: {},
      formId:null,
      averagePercentages: null,
      onClickPercentage: false,
      showPageLoadPopup: true,
      showCalculatePopup: false,
      showTablePage: false,
      facultyNames: [],
      subjectsBasedOnInput: [],
      timer: 10, // 10 minutes in seconds
      timerEnded: false,
      borderWidth: 10,
      goToHome:false
    };
  }

  countDown = () => {
    const initialTime = this.state.timer;
    this.timerInterval = setInterval(() => {
      this.setState(prevState => {
        if (prevState.timer > 0) {
          const newBorderWidth = (prevState.timer / initialTime) * 10;
          return { 
            timer: prevState.timer - 1,
            borderWidth: newBorderWidth
          };
        } else {
          clearInterval(this.timerInterval);
          return { timerEnded: true };
        }
      });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  changeReview = (categoryName, subjectName, value) => {
    
    const { allSubjectsReview} = this.state
   
    this.setState((prevState) => ({
      allSubjectsReview: {
        ...prevState.allSubjectsReview,
        [subjectName]: {
          ...prevState.allSubjectsReview[subjectName],
          [categoryName]: value
        }
      }
    }));
    
  };

  //insert FeedbackData in backend
  insertFeedbackData = async () => {
    const { allSubjectsReview ,formId} = this.state;
    try {
        const response = await fetch('https://student-feedback-system-8ln5.onrender.com/FeedbackData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({allSubjectsReview,formId})
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        // Handle success, e.g., show a success message to the user
        const data = await response.json();
        console.log('Feedback data inserted successfully:', data);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message); // Show error message to the user
    }
}

startTimer = () => {
  this.closePageLoadPopup();
  this.countDown();
};

  findAverage = () => {
    const { allSubjectsReview,subjectsBasedOnInput } = this.state;
    
    this.setState({ onClickPercentage: true });
    // Check if all reviews are integers
    let allIntegers = true;
    for (const subject in allSubjectsReview) {
      const eachSubject = allSubjectsReview[subject];
      for (const category in eachSubject) {
        if (isNaN(parseInt(eachSubject[category]))) {
          allIntegers = false;
          break;
        }
      }
      if (!allIntegers) break;
    }

    // If all reviews are integers, proceed to calculate average
    if (allIntegers) {
      // Calculate the total length of all nested objects
      let totalLength = 0;
      for (const subject in allSubjectsReview) {
        totalLength += Object.keys(allSubjectsReview[subject]).length;
      }
      console.log(allSubjectsReview)
      // If the total length is not equal to 64, show an alert and return
      if (totalLength !== subjectsBasedOnInput.length * feedBackFormCategories.length) {
        alert("Please complete all reviews before calculating percentage.");
        return;
      }
     
      // Calculate average percentages
      else{
        const averagePercentages = {};
        for (const subject in allSubjectsReview) {
          const eachSubject = allSubjectsReview[subject];
          const total = Object.values(eachSubject).reduce(
            (acc, curr) => acc + parseInt(curr),
            0
          );
          averagePercentages[subject] =
            (total / (feedBackFormCategories.length *4)*100);
        }
  
        // Show the calculation popup
        this.setState({ averagePercentages, showCalculatePopup: true },this.insertFeedbackData);
      }
     
    } else {
      // If any review is not an integer, show alert
      alert("Please complete all reviews before calculating percentage.");
    }
  };

  // onClickLogout = () => {
  //   Cookies.remove('student_token');
  //   window.location.replace('/login');
  // };

  closePageLoadPopup = () => {
    this.setState({ showPageLoadPopup: false });
  };

  closeCalculatePopup = () => {
    this.setState({ showCalculatePopup: false ,goToHome:true});

  };

displayTablePage = () => {
    const { facultyNames, subjectsBasedOnInput ,showTablePage,showPageLoadPopup,timer,borderWidth} = this.state;
    
    return (
      <>
      {showPageLoadPopup && (
          <div>
            <div className='pop-up-overlay'></div>
            <div className='pop-up-container' style={{ textAlign: "center" }}>
              <h5>Student Feedback Form !</h5>
              <p>Note:- Nobody can see your data ,the feedback data can be represented as total average percentage of your classroom</p>
              <button className='start-btn' onClick={this.startTimer}>Start</button>
            </div>
          </div>
        )}
          
      <div className='top-hading-container'>
  <div className='college-info-container'>
    <img className='svc-logo' src={svcLogo} alt="SVC Logo" />
    <div className='college-heading-container'>
      <h1>SRI VENKATESWARA COLLEGE OF ENGINEERING AND TECHNOLOGY</h1>
      <p>Approved by AICTE- New Delhi, Affiliated to JNTUGV, Vizianagaram  ISO 9001:2015 Certified</p>
      <p>Contact: +91 9705576693  Email: principal_svcet@yahoo.com,www.svcet.net</p>
    </div>
    <div className='timer-submit-btn-container'>
    {!this.state.timerEnded &&<div className="timer" style={{ borderWidth: `${borderWidth}px`}}>
          <p>Time remaining: {this.formatTime(timer)}</p>
        </div>}
        {this.state.timerEnded && (
    <button onClick={this.findAverage} className='calculate-percentage-btn'>Submit</button>
  )}
  </div>
    {!showTablePage && (
      <button onClick={this.displayFacultyAndSubjects} className='display-faculty-btn'>Display Faculty and Subjects</button>
    )}
  </div>
</div>

        <table>
          <thead>
            <tr>
              <th></th>
              <th>Faculty Name</th>
              {facultyNames.map((each, index) => (
                <th key={index}>{each.faculty_name}</th>
              ))}
            </tr>
            <tr>
              <th>S.No</th>
              <th>Evaluation Parameter/Subject Name</th>
              {subjectsBasedOnInput.map((subject, index) => (
                <th key={index}>{subject.subject_name}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {feedBackFormCategories.map((each, index) => (
              <FeedBackFormCategories key={index}  each={each} index={index} feedBackFormCategories={feedBackFormCategories} changeReview={this.changeReview} onClickPercentage={this.state.onClickPercentage} facultyNames={facultyNames} subjectsBasedOnInput={subjectsBasedOnInput}/>
            ))}
          </tbody>
        </table>
        <div className='bottom-button-container'>
        <div className='bottom-button-container'>
 
</div>

        </div>
        {this.state.showCalculatePopup && this.state.averagePercentages && (
          <div>
          <div className='pop-up-overlay' ></div>
          <div className='pop-up-container'>
          <div style={{ textAlign: 'right',margin:"0px" }}>
              <button style={{margin:"0px"}} className='back-logout-btn' onClick={this.closeCalculatePopup}>Back</button>
            </div>
         
            <h3 style={{marginTop:"0px"}}>Subject Percentages:</h3>
            {Object.entries(this.state.averagePercentages).map(([subject, percentage]) => (
              !isNaN(percentage) && (
                <p style={{marginLeft:"3px"}} key={subject}>{subject}: {percentage.toFixed(2)}%</p>
              )
            ))}
            {Object.entries(this.state.averagePercentages).some(([subject, percentage]) => isNaN(percentage)) && (
              <p>Please note: Some subjects have incomplete reviews and their percentages are not available.</p>
            )}
            <hr style={{ color: "white", width: "80%", height: "2px", backgroundColor: "white", border: "none", margin: "20px auto" }} />

            <div className='developer-name-img-container'>
              <img src={sunil1} alt="developer-img" className='developer-img'/>
              <p style={{ textAlign: "center", margin: "4px" }}>
  Developed by : <span style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif", fontStyle: "italic", fontWeight: "300" }}>Kanugula Sunil Kumar</span>
</p>

              <h5 style={{textAlign: "center",margin:"2px"}}>Thank You</h5>
            </div>
          
           
          </div>
        </div>
        )}
      </>
    );
  }

  displayFacultyAndSubjects = async () => {
    const { department, semester, academicYear, classSection,feedback,formId,subjectType } = this.state;
    

    try {
      const response = await fetch('https://student-feedback-system-8ln5.onrender.com/fetchFacultyAndSubjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          department,
          semester,
          academicYear,
          section: classSection,
          feedback,
          subjectType,
        })
      });
  
      if (!response.ok) {
        
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
      
      // Assuming the API response contains an array of faculty names and an array of subject names
      const { facultyNames, subjectNames,formId } = data;
      const { form_id}= formId
      
      // Update state with the retrieved data
      this.setState({
        facultyNames,
        subjectsBasedOnInput:subjectNames,
        formId:form_id,
        showTablePage: true
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error
    }
  };

  onChangeFeedBackAttempt = (e) => this.setState({feedback:e.target.value})
 onChangeSubjectType = (e) => this.setState({subjectType: e.target.value}); // Added change handler for subject type

  
  render() {
    const { department, semester,goToHome, academicYear,subjectType, classSection, showPageLoadPopup, showTablePage,allSubjectsReview } = this.state;
    console.log(allSubjectsReview)
    if(goToHome){
      return <Navigate to="/"/>
    }
    return (
      <div className="svc-feedback-form-container">
        

        {!showTablePage && (

          <div className='student-input-container'>
<div className='top-hading-container'>
  <div className='college-info-container'>
    <img className='svc-logo' src={svcLogo} alt="SVC Logo" />
    <div className='college-heading-container'>
      <h1>SRI VENKATESWARA COLLEGE OF ENGINEERING AND TECHNOLOGY</h1>
      <p>Approved by AICTE- New Delhi, Affiliated to JNTGV, Vizianagaram  ISO 9001:2015 Certified</p>
      <p>Contact: +91 9705576693  Email: principal_svcet@yahoo.com,www.svcet.net</p>
    </div>
    
  </div>
</div>            
<h1 className='student-feedback-heading'>Student Feedback</h1>
<div className='student-input-form-bg-container'>

   <div className='student-input-form-inner-container'>
    
    <div className="student-input-take-container">
    

              <label className='student-input-label' htmlFor="department">Department</label>
              <select className="student-input" onChange={(e) => this.setState({ department: e.target.value })} id="department" name="department" value={department}>
                {branchList.map(each => <option value={each} key={each}>{each}</option>)}
              </select>
            </div>
            <div className="student-input-take-container">
              <label  className='student-input-label' htmlFor="semester">Semester</label>
           
            <select
      className="student-input"
        onChange={(e) => this.setState({ semester: e.target.value })}
             name="semester"
            id="semester"
            value={semester}
        >
              {['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>



            </div>
            <div className="student-input-take-container">
              <label className='student-input-label' htmlFor="year">Current Acadamic-year</label>
              <select
                className="student-input"
                onChange={(e) => this.setState({ academicYear: e.target.value })}
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

            
            <div className="student-input-take-container">
              <label htmlFor="subjectType">Select Subject Type</label>
              <select
                className="hod-input"
                id="subjectType"
                onChange={this.onChangeSubjectType}
                value={subjectType}
              >
                <option value="Theoretical">Theoretical</option>
                <option value="Practical">Practical(Labs)</option>
              </select>
            </div>

            <div className="student-input-take-container">
              <label className='student-input-label' htmlFor="section"> Class Section Name</label>
              <select className="student-input" id="section" onChange={(e) => this.setState({ classSection: e.target.value })} value={classSection}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div className="hod-input-take-container">
                    <label htmlFor="feedback" className='student-input-label'> Feedback Attempt</label>
                    <select className="hod-input" id="feedback" onChange={this.onChangeFeedBackAttempt} value={this.state.feedback}>
                        <option value={1}>1st time</option>
                        <option value={2}>2nd time</option>
                        <option value={3}>3rd time</option>
                    </select>
                    </div>
                    <div style={{textAlign:'center'}}>
            <button onClick={this.displayFacultyAndSubjects} className='student-display-faculty-btn'>Display Faculty and Subjects</button>
            </div>
            </div>
            <img src={studentswithLpatops} alt="studentswithLpatops" style={{width:"50%"}}/>
            </div>
            {/* {!showTablePage && (
      <button onClick={this.displayFacultyAndSubjects} className='display-faculty-btn'>Display Faculty and Subjects</button>
    )} */}
          </div>
        )}

        {showTablePage && this.displayTablePage()}
      </div>
    );
  }
}

export default StudentFeedBackForm;
