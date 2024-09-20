import React, { useState, useEffect } from 'react';

const VerificationInput = ({ onVerificationChange, onResend, isLoading }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleResend = () => {
    if (resendTimer > 0 || isLoading) return;
    onResend();
    setResendTimer(30);
  };

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
    onVerificationChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="verificationCode" className="block mb-2">Verification Code</label>
      <div className="flex">
        <input
          type="text"
          id="verificationCode"
          value={verificationCode}
          onChange={handleChange}
          className="flex-grow px-3 py-2 border rounded-l-md"
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleResend}
          className={`px-3 py-2 bg-blue-500 text-white rounded-r-md ${
            resendTimer > 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={resendTimer > 0 || isLoading}
        >
          {resendTimer > 0 ? `${resendTimer}s` : 'Resend'}
        </button>
      </div>
    </div>
  );
};

export default VerificationInput;