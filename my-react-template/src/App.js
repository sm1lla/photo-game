// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GoogleAuth from './components/GoogleAuth';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Protected route for home page */}
          <Route path="/" element={<GoogleAuth><Home /></GoogleAuth>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
