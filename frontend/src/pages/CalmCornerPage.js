import React, { useState, useEffect } from 'react';

const BreathingAnimator = () => {
  const [phase, setPhase] = useState('inhale');
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 1) {
          let nextPhase = phase;
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') nextPhase = 'hold1';
            else if (currentPhase === 'hold1') nextPhase = 'exhale';
            else if (currentPhase === 'exhale') nextPhase = 'hold2';
            else nextPhase = 'inhale';
            return nextPhase;
          });
          return nextPhase === 'hold1' || nextPhase === 'hold2' ? 7 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
      default: return '';
    }
  };

  return (
    <div className="breathing-animator">
      <div className={`breathing-circle ${phase}`}>
        <div className="breathing-text">
          <div className="phase-text">{getPhaseText()}</div>
          <div className="countdown">{seconds}</div>
        </div>
      </div>
    </div>
  );
};

const CalmCornerPage = () => {
  const [currentVideo, setCurrentVideo] = useState('');

  const meditationVideos = [
    'https://www.youtube.com/embed/6bGlFwNfRGg',
    'https://www.youtube.com/embed/PttMV1xRJv4',
    'https://www.youtube.com/embed/inpok4MKVLM'
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * meditationVideos.length);
    setCurrentVideo(meditationVideos[randomIndex]);
  }, []);

  const handleNewMeditation = () => {
    const randomIndex = Math.floor(Math.random() * meditationVideos.length);
    setCurrentVideo(meditationVideos[randomIndex]);
  };

  return (
    <div className="calm-corner-page">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .calm-corner-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%);
          padding: 4rem 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .page-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .page-title {
          font-size: 3.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }

        .page-subtitle {
          font-size: 1.25rem;
          color: #94a3b8;
          font-weight: 300;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 3rem;
        }

        /* Breathing Section */
        .breathing-section {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 0.75rem;
        }

        .section-description {
          font-size: 1.1rem;
          color: #94a3b8;
          font-weight: 300;
        }

        .breathing-animator {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }

        .breathing-circle {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border: 3px solid #60a5fa;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 60px rgba(96, 165, 250, 0.4),
                      inset 0 0 40px rgba(96, 165, 250, 0.2);
        }

        .breathing-circle.inhale {
          animation: breathe-in 4s ease-in-out forwards;
        }

        .breathing-circle.hold1,
        .breathing-circle.hold2 {
          animation: breathe-hold 7s ease-in-out forwards;
        }

        .breathing-circle.exhale {
          animation: breathe-out 4s ease-in-out forwards;
        }

        @keyframes breathe-in {
          0% { 
            transform: scale(1); 
            box-shadow: 0 0 60px rgba(96, 165, 250, 0.4),
                        inset 0 0 40px rgba(96, 165, 250, 0.2);
          }
          100% { 
            transform: scale(1.4); 
            box-shadow: 0 0 80px rgba(96, 165, 250, 0.6),
                        inset 0 0 50px rgba(96, 165, 250, 0.3);
          }
        }

        @keyframes breathe-hold {
          0%, 100% { 
            transform: scale(1.4); 
            box-shadow: 0 0 80px rgba(96, 165, 250, 0.6),
                        inset 0 0 50px rgba(96, 165, 250, 0.3);
          }
          50% { 
            transform: scale(1.45); 
            box-shadow: 0 0 90px rgba(96, 165, 250, 0.7),
                        inset 0 0 55px rgba(96, 165, 250, 0.35);
          }
        }

        @keyframes breathe-out {
          0% { 
            transform: scale(1.4); 
            box-shadow: 0 0 80px rgba(96, 165, 250, 0.6),
                        inset 0 0 50px rgba(96, 165, 250, 0.3);
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 60px rgba(96, 165, 250, 0.4),
                        inset 0 0 40px rgba(96, 165, 250, 0.2);
          }
        }

        .breathing-text {
          text-align: center;
        }

        .phase-text {
          font-size: 1.5rem;
          font-weight: 600;
          color: #60a5fa;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .countdown {
          font-size: 4rem;
          font-weight: 700;
          color: #f1f5f9;
          text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
        }

        /* Meditation Section */
        .meditation-section {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 16px;
        }

        .new-meditation-btn {
          display: block;
          margin: 0 auto;
          padding: 12px 32px;
          background: #3b82f6; /* solid neon blue */
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.4px;
          transition: background 0.15s ease; /* minimal */
        }
        
        .new-meditation-btn:hover {
          background: #2563eb; /* slightly deeper blue on hover */
        }
        
        

        .new-meditation-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(96, 165, 250, 0.6);
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .new-meditation-btn:active {
          transform: translateY(0);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .calm-corner-page {
            padding: 2rem 1rem;
          }

          .page-title {
            font-size: 2.5rem;
          }

          .page-subtitle {
            font-size: 1.1rem;
          }

          .breathing-section,
          .meditation-section {
            padding: 2rem 1.5rem;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .section-description {
            font-size: 1rem;
          }

          .breathing-circle {
            width: 240px;
            height: 240px;
          }

          .phase-text {
            font-size: 1.2rem;
          }

          .countdown {
            font-size: 3rem;
          }

          .new-meditation-btn {
            padding: 12px 28px;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 2rem;
          }

          .breathing-circle {
            width: 200px;
            height: 200px;
          }

          .countdown {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Calm Corner</h1>
        <p className="page-subtitle">Take a moment to breathe and relax</p>
      </div>

      <div className="content-wrapper">
        <section className="breathing-section">
          <div className="section-header">
            <h2 className="section-title">Breathing Exercise</h2>
            <p className="section-description">Follow the 4-7-8 breathing pattern for relaxation</p>
          </div>
          <BreathingAnimator />
        </section>

        <section className="meditation-section">
          <div className="section-header">
            <h2 className="section-title">Guided Meditation</h2>
            <p className="section-description">Relax your mind with a peaceful meditation session</p>
          </div>
          {currentVideo && (
            <div className="video-container">
              <iframe
                src={currentVideo}
                title="Meditation Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <button className="new-meditation-btn" onClick={handleNewMeditation}>
           New Meditation
          </button>
        </section>
      </div>
    </div>
  );
};

export default CalmCornerPage;