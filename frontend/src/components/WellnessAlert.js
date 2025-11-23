import React from 'react';
import './WellnessAlert.css';

const WellnessAlert = ({ onClose }) => {
  return (
    <div className="wellness-overlay" onClick={onClose}>
      <div className="wellness-modal" onClick={(e) => e.stopPropagation()}>
        <button className="wellness-close" onClick={onClose}>&times;</button>
        <div className="wellness-icon">❤️</div>
        <h2>A Quick Check-in</h2>
        <p>
          We've noticed you've been feeling down for a few days. 
          Please remember that it's okay to ask for help and you're not alone.
        </p>
        <div className="wellness-buttons">
          <a 
            href="https://findahelpline.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="wellness-btn helpline"
          >
            Find a Helpline
          </a>
          <button 
            className="wellness-btn call-friend"
            onClick={() => {
              alert('Consider reaching out to someone you trust!');
            }}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default WellnessAlert;