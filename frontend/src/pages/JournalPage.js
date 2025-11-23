import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { analyzeAndSave, getEntries, getGeminiSongs } from '../api/apiService';
import SuggestionModal from '../components/SuggestionModal'; 

const JournalPage = ({ username }) => {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [suggestion, setSuggestion] = useState(null);
  const [songs, setSongs] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [songsLoading, setSongsLoading] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEntries(username);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setAnalyzing(true);
    try {
      const timestamp = new Date().toISOString();
      
      const response = await analyzeAndSave(text, username, timestamp);
      
      console.log('Backend response:', response); // Debug log
      
      setText('');
      await loadEntries();

      // ✅ FIX: Check if we have a vibe (emotion) instead of suggestion
      if (response.overallVibe && response.overallVibe.vibe) {
        const detectedEmotion = response.overallVibe.vibe;
        
        // Create a suggestion object
        setSuggestion({
          title: `You're feeling ${detectedEmotion}`,
          message: response.overallVibe.message || `Here are some songs for your ${detectedEmotion} mood`
        });
        
        // Show modal immediately with loading state
        setShowModal(true);
        setSongsLoading(true);
        
        // ✅ Call Gemini to get songs based on emotion
        try {
          console.log('Calling Gemini for emotion:', detectedEmotion); // Debug log
          const geminiSongs = await getGeminiSongs(detectedEmotion);
          console.log('Got songs from Gemini:', geminiSongs); // Debug log
          setSongs(geminiSongs);
        } catch (error) {
          console.error('Error getting songs from Gemini:', error);
          setSongs(null);
        } finally {
          setSongsLoading(false);
        }
      }
      
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSuggestion(null);
    setSongs(null);
    setSongsLoading(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <style>{`
        .journal-page {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #f5f5f5;
          letter-spacing: -0.5px;
        }

        .page-subtitle {
          font-size: 0.95rem;
          color: #b0b0b0;
          margin-bottom: 2rem;
        }

        .journal-form {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .journal-form:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1);
        }

        .journal-form textarea {
          width: 100%;
          padding: 1.2rem;
          background: #242424;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #f5f5f5;
          font-size: 0.95rem;
          line-height: 1.6;
          resize: vertical;
          font-family: inherit;
          transition: all 0.2s ease;
          margin-bottom: 1.2rem;
        }

        .journal-form textarea::placeholder {
          color: #606060;
        }

        .journal-form textarea:focus {
          outline: none;
          background: #2d2d2d;
          border-color: #3b82f6;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 
                      0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .journal-form button {
          width: 100%;
          padding: 0.9rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .journal-form button:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .journal-form button:active:not(:disabled) {
          transform: translateY(0);
        }

        .journal-form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .entries-section {
          margin-top: 2rem;
        }

        .entries-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #f5f5f5;
        }

        .loading-text,
        .no-entries {
          text-align: center;
          padding: 2.5rem 2rem;
          color: #808080;
          font-size: 0.95rem;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
        }

        .entries-list {
          display: grid;
          gap: 1rem;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .entry-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-left: 4px solid;
          border-radius: 8px;
          padding: 1.3rem;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .entry-card:hover {
          transform: translateY(-2px);
          border-color: #3a3a3a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
          gap: 1rem;
        }

        .entry-vibe {
          font-weight: 600;
          font-size: 1rem;
          text-transform: capitalize;
        }

        .entry-date {
          font-size: 0.85rem;
          color: #808080;
          white-space: nowrap;
        }

        .entry-text {
          color: #d0d0d0;
          line-height: 1.6;
          font-size: 0.95rem;
          margin: 0;
          word-break: break-word;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.75rem;
          }

          .journal-form {
            padding: 1rem;
          }

          .entry-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="journal-page">
        <h1 className="page-title">Your Journal</h1>
        <p className="page-subtitle">Track your emotions and reflect on your day</p>
        
        <form onSubmit={handleSubmit} className="journal-form">
          <textarea
            placeholder="How are you feeling today? Share your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={analyzing}
            rows="5"
          />
          <button type="submit" disabled={analyzing || !text.trim()}>
            {analyzing ? 'Analyzing...' : 'Save & Analyze'}
          </button>
        </form>

        <div className="entries-section">
          <h2>Your Entries</h2>
          {loading ? (
            <p className="loading-text">Loading entries...</p>
          ) : entries.length === 0 ? (
            <p className="no-entries">No entries yet. Start journaling to track your emotions!</p>
          ) : (
            <div className="entries-list">
              {entries.map((entry) => (
                <div key={entry._id} className="entry-card" style={{ borderLeftColor: entry.color }}>
                  <div className="entry-header">
                    <span className="entry-vibe" style={{ color: entry.color }}>
                      {entry.vibe}
                    </span>
                    <span className="entry-date">{formatDate(entry.timestamp)}</span>
                  </div>
                  <p className="entry-text">{entry.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* ✅ Show modal if visible, pass loading state */}
      {showModal && (
        <SuggestionModal 
          suggestion={suggestion}
          songs={songs}
          onClose={handleCloseModal}
          loading={songsLoading}
          error={!songsLoading && !songs ? "Couldn't fetch songs" : null}
        />
      )}
    </Layout>
  );
};

export default JournalPage;