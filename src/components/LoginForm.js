import React, { useState, useEffect } from 'react';
import PasswordInput from './PasswordInput';
import FormField from './FormField';

const LoginForm = ({
  isLogin,
  isVerifying,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  verificationCode,
  setVerificationCode,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleSubmit,
}) => {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    } else {
      setIsResendEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    try {
      const response = await fetch('http://localhost:8000/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsResendEnabled(false);
        setResendCooldown(30);
      } else {
        alert(data.detail || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {!isVerifying && (
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          show={showPassword}
          setShow={setShowPassword}
        />
      )}
      {!isLogin && !isVerifying && (
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          show={showConfirmPassword}
          setShow={setShowConfirmPassword}
        />
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
          <button
            type="button"
            onClick={handleResendVerification}
            className={`mt-2 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 ${!isResendEnabled && 'opacity-50 cursor-not-allowed'}`}
            disabled={!isResendEnabled}
          >
            {isResendEnabled ? 'Resend Verification Email' : `Resend in ${resendCooldown}s`}
          </button>
        </div>
      )}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
        {isLogin ? 'Login' : (isVerifying ? 'Verify' : 'Register')}
      </button>
    </form>
  );
};

export default LoginForm;