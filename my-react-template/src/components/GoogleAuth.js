import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const GoogleAuth = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const username = params.get('username');
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (username && accessToken) {
      localStorage.setItem('username', username);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Redirect or perform any further actions
      console.log('User logged in:', localStorage);
    }
  }, [location]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    // Submit the form to initiate the OAuth authentication flow
    event.target.submit();
  };

  return (
    <div>
      <form action="http://localhost:8080/auth/callback" method="get" onSubmit={handleSubmit}>
        <input type="submit" value="Press to log in" />
      </form>
    </div>
  );
};
  
  export default GoogleAuth;
