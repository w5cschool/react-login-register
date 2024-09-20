import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MyLogin from './components/MyLogin';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<MyLogin />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;