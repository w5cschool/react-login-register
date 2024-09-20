import React from 'react';

const FormField = ({ id, label, type = "text", value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block mb-2">{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-md"
      required
    />
  </div>
);

export default FormField;