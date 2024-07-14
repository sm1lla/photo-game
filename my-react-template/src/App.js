// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GoogleAuth from './components/GoogleAuth';
import PhotosButton from './components/OauthCallback'

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/login" element={<GoogleAuth></GoogleAuth>} />
          <Route path="/protected" element={<PhotosButton></PhotosButton>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
