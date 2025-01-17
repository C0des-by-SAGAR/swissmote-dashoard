import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title, 
  className = '', 
  hoverable = true,
  padding = 'pa4'
}) => {
  return (
    <div 
      className={`
        card bg-white dark:bg-gray-900 br3 shadow-1
        ${hoverable ? 'card-hover' : ''}
        ${padding}
        ${className}
      `}
    >
      {title && (
        <h3 className="mt0 mb3 f4 dark:text-white">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;
