import React from 'react';

const GoogleAuth = () => {
    const handleSubmit = (event) => {
      event.preventDefault(); // Prevent default form submission
  
      // Submit the form to initiate the OAuth authentication flow
      event.target.submit();
    };
  
    return (
      <div>
        <form action="http://localhost:8080/auth" method="get" onSubmit={handleSubmit}>
          <input type="submit" value="Press to log in" />
        </form>
      </div>
    );
  };
  
  export default GoogleAuth;
