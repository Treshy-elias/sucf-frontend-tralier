import React from 'react';

const CategoryButton = ({ value, label, highLight, handleClick, setHighLight }) => {
  const isActive = highLight === value;

  return (
    <button
      style={{
        backgroundColor: isActive ? 'gray' : '',
        color: 'white'
      }}
      value={value}
      onClick={(e) => {
        handleClick(e);
        setHighLight(value);
      }}
    >
      {label}
    </button>
  );
};

export default CategoryButton;
