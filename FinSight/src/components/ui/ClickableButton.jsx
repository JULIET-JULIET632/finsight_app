import React, { useState } from 'react';

const ClickableButton = ({ 
  children, 
  onClick, 
  bgColor = '#2C6C71', 
  hoverColor = '#1E4F52',
  activeColor = '#0F3E3A',
  textColor = 'white',
  className = '',
  style = {},
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset after 200ms
    
    if (onClick) {
      onClick(e);
    }
  };

  const getBackgroundColor = () => {
    if (disabled) return '#A0A0A0';
    if (isClicked) return activeColor;
    if (isHovered) return hoverColor;
    return bgColor;
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      className={`transition-all duration-200 transform ${isClicked ? 'scale-95' : 'scale-100'} ${className}`}
      style={{
        backgroundColor: getBackgroundColor(),
        color: textColor,
        transition: 'background-color 0.2s, transform 0.1s',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default ClickableButton;