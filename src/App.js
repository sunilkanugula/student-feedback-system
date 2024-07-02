import React, { Component,Switch } from 'react';
import { BrowserRouter as Router, Routes,Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import StudentFeedBackForm from "./components/StudentFeedBackForm";
import StudentRegistrationForm from "./components/StudentRegistrationForm";
import HodAdminPanel from "./components/HodAdminPanel";
import HodRegistrationForm from "./components/HodRegistrationForm";
import HodLoginForm from "./components/HodLoginForm";
import Principal from "./components/Principal";
import ProtectedRoute from './components/ProtectedRoute'
class App extends Component {
  

  render() {

    return (
     <Router>
      <Routes>
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/register" element={<StudentRegistrationForm />} />
          <Route exact path='/hod' element={<HodAdminPanel />} />
          <Route exact path="/hod-login" element={<HodLoginForm />} />
          <Route exact path="/hod-register" element={<HodRegistrationForm />} />
          <Route exact path="/principal" element={<Principal/>}/>
          <ProtectedRoute exact path="/" component={StudentFeedBackForm} />
        </Routes>
        </Router>
    );
  }
}

export default App;
