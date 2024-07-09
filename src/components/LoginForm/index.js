import {Component} from 'react'
import Cookies from 'js-cookie'
import {Navigate} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    
   const {history} = this.props
    Cookies.set('student_token', jwtToken, {
      expires: 1,

    })
  history.replace("/")
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault();
    const { username, password } = this.state;
    const userDetails = { username, password };
    console.log(userDetails)
    const url = 'https://student-feedback-system-8ln5.onrender.com/login';
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json' // Ensure content type is set to JSON
      }
    };
  
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        this.onSubmitSuccess(data.jwt_token);
      } else {
        // Handle non-JSON response (e.g., plain text or HTML)
        const errorMsg = await response.text();
        this.onSubmitFailure(errorMsg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.onSubmitFailure('An error occurred. Please try again later.');
    }
  };
  
  renderPasswordField = () => {
    const {password} = this.state
    const {history} = this.props
    console.log(history)
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <>
        <label className="input-label" htmlFor="login-username">
          USERNAME
        </label>
        <input
          type="text"
          id="login-username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Navigate to="/" />
    }

    return (
      <div className="login-form-container">
      
        <div className='inner-login-form-container'>
        <form className="form-container" onSubmit={this.submitForm}>
          <div className='heading-container'>
          <img
            src="https://res.cloudinary.com/di1e0mwbu/image/upload/v1711821173/wwhvi3uj82w507nruua6.jpg"
            className='svc-logo-login'
            alt="website logo"
          />
          <h4>SRI VENKATESWARA COLLEGE OF ENGINEERING & TECHNOLOGY</h4>
          </div>
          
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
      </div>
    )
  }
}

export default LoginForm