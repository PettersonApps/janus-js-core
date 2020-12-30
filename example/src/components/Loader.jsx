import React from 'react';
import logo from '../logo.svg';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
};

export default Loader;
