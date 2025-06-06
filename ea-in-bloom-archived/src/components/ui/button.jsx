import React from 'react';

// A simple button component that can be used as a replacement
export const Button = ({ 
  children, 
  className = '', 
  onClick, 
  ...props 
}) => {
  return (
    <button
      className={`px-4 py-2 rounded font-medium transition-colors ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

