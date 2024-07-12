import React, { Component } from 'react';
import { v4 as uuidv4 } from "uuid"

import './StudentRegistrationForm.css';
const branchList = [
  "CSE",
  "AIML",
  "CSM",
  "ECE",
  "EEE",
  "CIVIL",
  "MECH"
]

class StudentRegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      branch: branchList[0],
    
    };
  }

  onChangeUserName = (e) => {
    const { value } = e.target;
    this.setState({ username: value });
  };

  onChangePassword = (e) => {
    const { value } = e.target;
    this.setState({ password: value })
  }

 
  onChangeBranch = (e) => {
    const { value } = e.target
    this.setState({ branch: value })
    console.log(value)
  }


  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, branch } = this.state;
    const formData = {
      hod_id: uuidv4(),
      username,
      password,
      branch,
    };
  
    try {
      const response = await fetch('https://student-feedback-system-8ln5.onrender.com/hod-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        const data = await response.text();
        alert(data); // Show success message
        window.location.replace("/hod-login")
      } else {
        const errorMessage = await response.text();
        alert(errorMessage); // Show the error message from the backend
      }
    } catch (error) {
      console.error(error.message);
      alert('Failed to register HOD');
    }
  };
  
  render() {
    return (
      <div>
       <div className='top-hading-container'>
  <div className='college-info-container'>
    <img className='svc-logo' src={svcLogo} alt="SVC Logo" />
    <div className='college-heading-container'>
      <h1>SRI VENKATESWARA COLLEGE OF ENGINEERING & TECHNOLOGY</h1>
      <p>Approved by AICTE, New Delhi, Affiliated to JNTUK, Vizianagaram  ISO 9001:2015 Certified</p>
      <p>Contact: +91 9705576693  Email: principal@svcet.edu.in</p>
    </div>
   
    
  </div>
  
</div>
      <div className='register-container'>
       
        <div className='hod-inner-register-form-container'>
          
          <form className='register-form-container' onSubmit={this.handleSubmit}>
            <div className='heading-container'>
              <img
                src={svcLogo}
                className='svc-logo-login'
                alt="website logo"
              />
              <h4>SRI VENKATESWARA COLLEGE OF ENGINEERING & TECHNOLOGY</h4>
            </div>
            <label style={{ marginTop: '20px' }} htmlFor="username">Username</label>
            <input className="register-input-field" type="text" id="username" value={this.state.username} onChange={this.onChangeUserName} />
            <label htmlFor="password">Password</label>
            <input className="register-input-field" type="password" id="password" value={this.state.password} onChange={this.onChangePassword} />

           <label htmlFor="username">Branch</label>
            <select className="register-input-field" onChange={this.onChangeBranch} value={this.state.branch}>
              {branchList.map(each => <option value={each} key={each}>{each}</option>)}
            </select>
            <button>Submit</button>
          </form>
        </div>
      </div>
    </div>
    );
  }
}

export default StudentRegistrationForm;
