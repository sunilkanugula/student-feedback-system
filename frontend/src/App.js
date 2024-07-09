import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentFeedBackForm from "./components/StudentFeedBackForm";
import StudentRegistrationForm from "./components/StudentRegistrationForm";
import HodAdminPanel from "./components/HodAdminPanel";
import HodRegistrationForm from "./components/HodRegistrationForm";
import HodLoginForm from "./components/HodLoginForm";
import Principal from "./components/Principal";
import FeedbackContext from './context/FeedbackContext.js';
import FirstPage from './components/FirstPage';
import PrincipalLoginForm from './components/PrincipalLoginForm/index.js';
import PrincipalRegistration from "./components/principalRegistration"
class App extends Component {
  state = {
    hodBranch: "CSE"
  };
  
  getHodBranch = async (newBranch) => {
    console.log("Updating hodBranch to:", newBranch);
    await this.setState({ hodBranch: newBranch });
    console.log("Updated hodBranch:", this.state.hodBranch); // Ensure state update is complete
  }

  render() {
    const { hodBranch } = this.state;
    console.log("Current hodBranch in App:", hodBranch); // Log current hodBranch for debugging
    
    return (
      <FeedbackContext.Provider value={{ hodBranch, getHodBranch: this.getHodBranch }}>
        <Router>
          <Routes>
            <Route exact path='/hod' element={<HodAdminPanel />} />
           
            <Route exact path="/register" element={<StudentRegistrationForm />} />
            <Route exact path="/hod-login" element={<HodLoginForm />} />
            <Route exact path="/hod-register" element={<HodRegistrationForm />} />
            <Route exact path="/principal" element={<Principal />} />
            <Route exact path="/students" element={<StudentFeedBackForm />} />
            <Route exact path="/" element={<FirstPage/>}/>
            <Route exact path="/principal-login" element={<PrincipalLoginForm/>}/>
            <Route exact path='/principal-register' element={<PrincipalRegistration/>}/>
          </Routes>
        </Router>
      </FeedbackContext.Provider>
    );
  }
}

export default App;
