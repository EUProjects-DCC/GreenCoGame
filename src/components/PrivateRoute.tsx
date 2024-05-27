import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import LoadingPage from './LoadingPage';  

interface PrivateRouteProps {
  children: React.ReactNode
}
const PrivateRoute:React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<any>(null);
  
  React.useEffect(() => {
    const check = async () => {
      
    };
    check();
  }, []);

  if(isAuthenticated===null) {
    return <LoadingPage></LoadingPage>;
  }
  else if(isAuthenticated===true) {
    return <Route>{children}</Route>;
  }
  else {
    if(localStorage.getItem('login')!==null) {
      localStorage.removeItem('login');
      return <Redirect to="/login"></Redirect>
    }
    else{
      return <Redirect to="/welcome"></Redirect>
    }
  }
};

export default PrivateRoute;