
import React from 'react';

const EmailInput = ({ email, setEmail }) => (
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
  );

  export default EmailInput; 