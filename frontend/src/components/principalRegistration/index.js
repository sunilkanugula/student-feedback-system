import React, { Component } from 'react';
import { v4 as uuidv4 } from "uuid"

import './index.css';


class StudentRegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
     
    
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

 


  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    if(username !== "" && password !==""){
      const formData = {
        principal_id: uuidv4(),
        username,
        password,
       
      };
    
      try {
        const response = await fetch('https://student-feedback-system-8ln5.onrender.com/principal-register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
    
        if (response.ok) {
          const data = await response.text();
          alert(data); // Show success message
          window.location.replace("/principal-login")
        } else {
          const errorMessage = await response.text();
          alert(errorMessage); // Show the error message from the backend
        }
      } catch (error) {
        console.error(error.message);
        alert('Failed to register HOD');
      }
      
    }
    else{
      alert("Please enter valid username and password")
    }
 
  };
  
  render() {
    return (
      <div>
       <div className='top-hading-container'>
  <div className='college-info-container'>
    <img className='svc-logo' src="https://res.cloudinary.com/di1e0mwbu/image/upload/v1711821173/wwhvi3uj82w507nruua6.jpg" alt="SVC Logo" />
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
                src="https://res.cloudinary.com/di1e0mwbu/image/upload/v1711821173/wwhvi3uj82w507nruua6.jpg"
                className='svc-logo-login'
                alt="website logo"
              />
              <h4>SRI VENKATESWARA COLLEGE OF ENGINEERING & TECHNOLOGY</h4>
            </div>
            <label style={{ marginTop: '20px' }} htmlFor="username">Username</label>
            <input placeholder=' Username' className="register-input-field" type="text" id="username" value={this.state.username} onChange={this.onChangeUserName} />
            <label htmlFor="password">Password</label>
            <input  placeholder=" Password" className="register-input-field" type="password" id="password" value={this.state.password} onChange={this.onChangePassword} />
            <button>register</button>
          </form>
        </div>
      </div>
    </div>
    );
  }
}

export default StudentRegistrationForm;
