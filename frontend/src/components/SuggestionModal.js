import React, { useState, useEffect } from 'react';
import './SuggestionModal.css';

const SuggestionModal = ({ suggestion, songs, onClose, loading = false, error = null }) => {
  const [currentView, setCurrentView] = useState('choices'); 
  const [playerQuery, setPlayerQuery] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 8 seconds if on choices view
    const timer = setTimeout(() => {
      if (currentView === 'choices' && !loading) {
        handleClose();
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [currentView, loading]);

  const handleChoiceClick = (songQuery) => {
    // Clean up the song query for better YouTube search results
    // Format: "Song Title - Artist Name" becomes "Song Title Artist Name malayalam song"
    const cleanQuery = songQuery.replace(/ - /g, ' ') + ' malayalam song';
    setPlayerQuery(cleanQuery);
    setCurrentView('player'); 
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentView('choices'); 
      setPlayerQuery('');
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="music-toast" style={{ animation: isVisible ? 'slideInUp 0.4s ease-out' : 'slideOutDown 0.3s ease-in' }}>
      {loading ? (
        // Loading state
        <div className="toast-content">
          <div className="toast-header">
            <div className="toast-title-section">
              <span className="toast-icon">🎵</span>
              <div>
                <h3 className="toast-title">Finding perfect songs...</h3>
                <p className="toast-subtitle">Personalizing for your mood</p>
              </div>
            </div>
            <button className="toast-close" onClick={handleClose}>✕</button>
          </div>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      ) : error ? (
        // Error state
        <div className="toast-content">
          <div className="toast-header">
            <div className="toast-title-section">
              <span className="toast-icon">⚠️</span>
              <div>
                <h3 className="toast-title">Couldn't find songs</h3>
                <p className="toast-subtitle">Please try again</p>
              </div>
            </div>
            <button className="toast-close" onClick={handleClose}>✕</button>
          </div>
        </div>
      ) : (
        // Songs display
        currentView === 'choices' ? (
          <div className="toast-content">
            <div className="toast-header">
              <div className="toast-title-section">
                <span className="toast-icon">🎵</span>
                <div>
                  <h3 className="toast-title">{suggestion.title}</h3>
                  <p className="toast-subtitle">Pick a song to play</p>
                </div>
              </div>
              <button className="toast-close" onClick={handleClose}>✕</button>
            </div>

            <div className="toast-songs">
              <button 
                className="toast-song-btn"
                onClick={() => handleChoiceClick(songs.song1)}
                title={songs.song1}
              >
                <span className="song-number">1</span>
                <span className="song-text">{songs.song1}</span>
                <span className="play-icon">▶</span>
              </button>

              <button 
                className="toast-song-btn"
                onClick={() => handleChoiceClick(songs.song2)}
                title={songs.song2}
              >
                <span className="song-number">2</span>
                <span className="song-text">{songs.song2}</span>
                <span className="play-icon">▶</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="toast-player">
            <button className="player-back" onClick={() => setCurrentView('choices')}>← Back</button>
            
            <div className="player-message">
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>🎵 Ready to play:</p>
              <p style={{ margin: '0 0 12px 0' }}>
                <strong style={{ fontSize: '15px', color: '#3b82f6' }}>{playerQuery}</strong>
              </p>
              <p className="player-hint" style={{ fontSize: '12px', color: '#808080', margin: 0 }}>
                Click below to open YouTube and choose your video
              </p>
            </div>
            
            <a 
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(playerQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="open-youtube-btn"
            >
              🎵 Open in YouTube
            </a>
            
            <button className="player-close" onClick={handleClose}>Close</button>
          </div>
        )
      )}
    </div>
  );
};

export default SuggestionModal;