import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

function Spinner() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', // Full height to center vertically
      margin: '0 auto', 
      overflowX: 'inherit' }}>
      <ClipLoader color="#2a59a5" size={100}/>
    </div>
  );
};

export default Spinner;