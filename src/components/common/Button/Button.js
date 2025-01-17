import React from 'react';
import './Button.css';

const Button = ({ 
  children,
  variant = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'button bn br2 pointer transition-colors';
  const sizeClasses = {
    small: 'f6 pa2',
    medium: 'f5 pa3',
    large: 'f4 pa4'
  };
  
  const variantClasses = {
    primary: 'bg-blue white hover-bg-dark-blue',
    secondary: 'bg-gray white hover-bg-dark-gray',
    outline: 'ba b--blue blue hover-bg-blue hover-white'
  };

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-100' : ''}
        ${disabled ? 'o-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
