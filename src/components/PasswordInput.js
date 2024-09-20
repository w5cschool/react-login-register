import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ id, value, onChange, show, setShow }) => (
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
  );

export default PasswordInput;