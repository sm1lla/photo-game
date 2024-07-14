import React from 'react';
import GoogleAuth from '../components/GoogleAuth';

const Home = () => {
  return (
    <div>
      <h2>Hello and Welcome!</h2>
      <p>This is the home page.</p>
      <GoogleAuth/>
    </div>
  );
};

export default Home;