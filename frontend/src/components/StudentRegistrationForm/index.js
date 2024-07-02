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
  
    // Check if username is not empty
    if (!username || !password || !branch) {
      alert('Please fill in all fields');
      return;
    }
  
    const formData = {
      username,
      password,
      branch,
    };
  
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = await response.text();
          if (errorMessage === 'Username already exists') {
            alert('Username already exists. Please choose another one.');
            return;
          }
        }
        throw new Error('Failed to register student');
      }
  
      const data = await response.text();
      alert(data); // Show success message
      window.location.replace("/login");
    } catch (error) {
      console.error(error.message);
      alert('An error occurred. Please try again later.');
    }
  };
  
  
  render() {
    return (
      <div className='register-container'>
        <div className='inner-register-form-container'>
          <h2 style={{ fontSize: "30px", alignSelf: "center", color: "white" }}>Student Registration Form</h2>
          <form className='register-form-container' onSubmit={this.handleSubmit}>
            <div className='heading-container'>
              <img
                src="https://res.cloudinary.com/di1e0mwbu/image/upload/v1711821173/wwhvi3uj82w507nruua6.jpg"
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
            <button className='registration-submit-btn'>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default StudentRegistrationForm;
