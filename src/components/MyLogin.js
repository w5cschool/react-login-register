import React, { useState, useCallback, useEffect } from 'react';
import PasswordInput from './PasswordInput';
import EmailInput from './EmailInput';
import VerificationInput from './VerificationInput';
import { useNavigate } from 'react-router-dom';
import { login, register, verify, resendVerification } from './api';


const ResendButton = ({ canResend, resendTimer, handleResendEmail }) => (
  <div className="mt-4">
    <button
      onClick={handleResendEmail}
      disabled={!canResend}
      className={`w-full py-2 rounded-md ${canResend ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
    >
      {canResend ? 'Resend Verification Email' : `Resend in ${resendTimer}s`}
    </button>
  </div>
);

const ToggleButton = ({ isVerifying, isLogin, setIsVerifying, setIsLogin, resetPasswordFields }) => (
  <p className="mt-4 text-center">
    {isVerifying ? (
      <button
        onClick={() => setIsVerifying(false)}
        className="text-blue-500 hover:underline"
      >
        Back to {isLogin ? 'Login' : 'Register'}
      </button>
    ) : (
      <>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            resetPasswordFields();
          }}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </>
    )}
  </p>
);

const MyLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    let timer;
    if (!canResend && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      setResendTimer(30);
    }
    return () => clearTimeout(timer);
  }, [canResend, resendTimer]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const data = await login(email, password);
        localStorage.setItem('token', data.access_token);
        navigate('/');
      } else if (!isVerifying) {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match!");
        }
        await register(email, password);
        setIsVerifying(true);
      } else {
        await verify(email, verificationCode, password);
        alert('Email verified successfully. You can now log in.');
        setIsVerifying(false);
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await resendVerification(email);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to resend verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordFields = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? 'Login' : (isVerifying ? 'Verify Email' : 'Register')}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isVerifying && <EmailInput email={email} setEmail={setEmail} />}
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
              <VerificationInput
              onVerificationChange={setVerificationCode}
              onResend={handleResendVerification}
              isLoading={isLoading}
            />
          )}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            {isLoading 
          ? 'Processing...' 
          : (isLogin ? 'Login' : (isVerifying ? 'Verify' : 'Register'))}
          </button>
        </form>
        <ToggleButton
          isVerifying={isVerifying}
          isLogin={isLogin}
          setIsVerifying={setIsVerifying}
          setIsLogin={setIsLogin}
          resetPasswordFields={resetPasswordFields}
        />
      </div>
    </div>
  );
};

export default MyLogin;