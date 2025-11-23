import React from 'react';

const MoodToolkit = () => {
  const tips = [
    { icon: '🚶', title: 'Take a Walk', description: 'Fresh air and movement can boost your mood' },
    { icon: '💧', title: 'Stay Hydrated', description: 'Drink a glass of water to refresh yourself' },
    { icon: '🧘', title: 'Meditate', description: 'Take 5 minutes for mindful breathing' }
  ];

  return (
    <div className="mood-toolkit">
      <h2>Quick Mood Boosters</h2>
      <div className="toolkit-grid">
        {tips.map((tip, index) => (
          <div key={index} className="toolkit-card">
            <div className="toolkit-icon">{tip.icon}</div>
            <h3>{tip.title}</h3>
            <p>{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodToolkit;