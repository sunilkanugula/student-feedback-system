import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom'; // Ensure Navigate is imported
import FeedbackContext from "../../context/FeedbackContext.js";
import './index.css';

const branchList = [
  "CSE", "AIML", "CSM", "ECE", "EEE", "CIVIL", "MECH"
];

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    branch: branchList[0],
  };

  onChangeUsername = event => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  onChangeBranch = event => {
    this.setState({ branch: event.target.value });
  };

  onSubmitSuccess = async (jwtToken, getHodBranch) => {
    const { branch } = this.state;
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    
    getHodBranch(branch); // Set the branch in context
    
    await this.setState({ 
      username: "", 
      password: "", 
      branch: branchList[0], 
      showSubmitError: false 
    });
    
    return <Navigate to="/hod" />;
  };

  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg });
  };

  submitForm = async (event, getHodBranch) => {
    event.preventDefault();
    const { username, password, branch } = this.state;
    const userDetails = { username, password, branch };
    const url = 'http://localhost:5000/hod-login';
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
        this.onSubmitSuccess(data.jwt_token, getHodBranch);
      } else {
        const errorMsg = await response.text();
        this.onSubmitFailure(errorMsg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.onSubmitFailure('An error occurred. Please try again later.');
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

  render() {
    const { showSubmitError, errorMsg, branch } = this.state;
    const jwtToken = Cookies.get('jwt_token');

    if (jwtToken) {
      return <Navigate to="/hod" />;
    }

    return (
      <FeedbackContext.Consumer>
        {value => {
          const { getHodBranch } = value;
          return (
            <div className="login-form-container">
              <div className='inner-login-form-container'>
                <form
                  className="form-container"
                  onSubmit={(event) => this.submitForm(event, getHodBranch)}
                >
                  <div className='heading-container'>
                    <img
                      src="https://res.cloudinary.com/di1e0mwbu/image/upload/v1711821173/wwhvi3uj82w507nruua6.jpg"
                      className='svc-logo-login'
                      alt="website logo"
                    />
                    <h4>SRI VENKATESWARA COLLEGE OF ENGINEERING &amp; TECHNOLOGY</h4>
                  </div>

                  <div className="input-container">{this.renderUsernameField()}</div>
                  <div className="input-container">{this.renderPasswordField()}</div>
                  <div className="input-container">
                    <label className="input-label" htmlFor="branch">BRANCH</label>
                    <select
                      className="branch-input-field"
                      onChange={this.onChangeBranch}
                      value={branch}
                    >
                      {branchList.map(each => (
                        <option value={each} key={each}>{each}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="login-button">Login</button>
                  {showSubmitError && <p className="error-message">*{errorMsg}</p>}
                </form>
              </div>
            </div>
          );
        }}
      </FeedbackContext.Consumer>
    );
  }
}

export default LoginForm;
