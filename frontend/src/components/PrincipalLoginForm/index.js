import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import './index.css';
import svcLogo from "../../images/svclogo.jpg"

class PrincipalLoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    shouldNavigateToPrincipal: false,
    shouldNavigateToRegister: false,
    showRegisterButton:true
  };

  onChangeUsername = event => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  onSubmitSuccess = (jwtToken) => {
    Cookies.set('principal_jwt_token', jwtToken, { expires: 30 });
    this.setState({ 
      username: '', 
      password: '', 
      showSubmitError: false, 
      shouldNavigateToPrincipal: true ,
      backToHome:false
    });
  };

  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg });
  };

  submitForm = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    if(username !== "" && password !==""){
      const userDetails = { username, password };
    const url = 'http://student-feedback-system-8ln5.onrender.com/principal-login';
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        this.onSubmitSuccess(data.jwt_token);
      } else {
        const errorMsg = await response.text();
        this.onSubmitFailure(errorMsg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.onSubmitFailure('An error occurred. Please try again later.');
    }
    }
    else{
      alert("please enter valid user and password")
    }
    
  };

  componentDidMount() {
    this.fetchRegisterSettings();
  }

  fetchRegisterSettings = async () => {
    try {
      const response = await fetch("http://student-feedback-system-8ln5.onrender.com/registerSettings", { method: "GET" });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      this.setState({ showRegisterButton: data.showRegisterButton });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  renderPasswordField = () => {
    const { password } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    );
  };

  renderUsernameField = () => {
    const { username } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="login-username">USERNAME</label>
        <input
          type="text"
          id="login-username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    );
  };

  navigateRegister = () => {
    this.setState({ shouldNavigateToRegister: true });
  };
  onClickBackToHome = () => this.setState({backToHome:true})

  render() {
    const { showSubmitError, errorMsg, shouldNavigateToPrincipal, shouldNavigateToRegister,backToHome ,showRegisterButton} = this.state;
    const jwtToken = Cookies.get('principal_jwt_token');
    if(backToHome){
      return <Navigate to="/"/>
    }

    if (jwtToken || shouldNavigateToPrincipal) {
      return <Navigate to="/principal" />;
    }

    if (shouldNavigateToRegister) {
      return <Navigate to="/principal-register" />;
    }

    return (
      <div className="login-form-container">
        <div className="inner-login-form-container">
          <form className="form-container" onSubmit={this.submitForm}>
            <div className="heading-container">
              <img
                src={svcLogo}
                className="svc-logo-login"
                alt="website logo"
              />
              <h4>SRI VENKATESWARA COLLEGE OF ENGINEERING &amp; TECHNOLOGY</h4>
            </div>

            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>

            <button type="submit" className="login-button">Login</button>
            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
            <div className='register-back-button-container'>
                  
            {showRegisterButton ? <button type="button" onClick={this.navigateRegister} className="hod-register-button">Register</button>: ""}
                  <button type="button" onClick={this.onClickBackToHome} className="hod-register-button">Back</button>
             
                  </div>  </form>
        </div>
      </div>
    );
  }
}

export default PrincipalLoginForm;
