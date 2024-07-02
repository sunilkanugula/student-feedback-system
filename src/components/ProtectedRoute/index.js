import {Navigate, Route} from 'react-router-dom'
import Cookie from 'js-cookie'

const ProtectedRoute = props => {
  const studentToken = Cookie.get('student_token')
  
  if (studentToken === undefined) {
    return <Navigate to="/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute
