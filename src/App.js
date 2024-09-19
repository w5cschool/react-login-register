import React, { useState, useCallback, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const response = await fetch('http://localhost:8000/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.access_token);
          setIsLoggedIn(true);
          fetchCurrentUser(data.access_token);
        } else {
          alert(data.detail || 'Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    } else if (!isVerifying) {
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          setIsVerifying(true);
          alert(data.message);
        } else {
          alert(data.detail || 'An error occurred');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      try {
        const response = await fetch('http://localhost:8000/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: verificationCode, password }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          setIsVerifying(false);
          setIsLogin(true);
        } else {
          alert(data.detail || 'An error occurred');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const PasswordInput = useCallback(({ id, value, onChange, show, setShow }) => (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-md pr-10"
        required
      />
      <button
        type="button"
        onClick={() => setShow(prev => !prev)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  ), []);

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">Welcome, {currentUser?.email}</h2>
          <p>You are logged in!</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? 'Login' : (isVerifying ? 'Verify Email' : 'Register')}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          {!isVerifying && (
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">Password</label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                show={showPassword}
                setShow={setShowPassword}
              />
            </div>
          )}
          {!isLogin && !isVerifying && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
              />
            </div>
          )}
          {isVerifying && (
            <div className="mb-4">
              <label htmlFor="verificationCode" className="block mb-2">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          )}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            {isLogin ? 'Login' : (isVerifying ? 'Verify' : 'Register')}
          </button>
        </form>
        {!isVerifying && (
          <p className="mt-4 text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setConfirmPassword('');
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
              className="text-blue-500 hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default App;