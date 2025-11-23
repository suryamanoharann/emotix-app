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
      <style>{`
        .breathing-animator {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }

        .breathing-circle {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
          border: 3px solid #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: breathe-scale 8s infinite;
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.3),
                      inset 0 0 30px rgba(59, 130, 246, 0.15),
                      0 0 80px rgba(59, 130, 246, 0.1);
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
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.3),
                        inset 0 0 30px rgba(59, 130, 246, 0.15);
          }
          100% { 
            transform: scale(1.5); 
            box-shadow: 0 0 60px rgba(59, 130, 246, 0.5),
                        inset 0 0 40px rgba(59, 130, 246, 0.25);
          }
        }

        @keyframes breathe-hold {
          0%, 100% { 
            transform: scale(1.5); 
            box-shadow: 0 0 60px rgba(59, 130, 246, 0.5),
                        inset 0 0 40px rgba(59, 130, 246, 0.25);
          }
          50% { 
            transform: scale(1.55); 
            box-shadow: 0 0 70px rgba(59, 130, 246, 0.6),
                        inset 0 0 45px rgba(59, 130, 246, 0.3);
          }
        }

        @keyframes breathe-out {
          0% { 
            transform: scale(1.5); 
            box-shadow: 0 0 60px rgba(59, 130, 246, 0.5),
                        inset 0 0 40px rgba(59, 130, 246, 0.25);
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.3),
                        inset 0 0 30px rgba(59, 130, 246, 0.15);
          }
        }

        .breathing-text {
          text-align: center;
          color: #f5f5f5;
        }

        .phase-text {
          font-size: 1.4rem;
          font-weight: 600;
          color: #3b82f6;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .countdown {
          font-size: 3rem;
          font-weight: 700;
          color: #f5f5f5;
        }

        @media (max-width: 768px) {
          .breathing-circle {
            width: 200px;
            height: 200px;
          }

          .phase-text {
            font-size: 1.1rem;
          }

          .countdown {
            font-size: 2.2rem;
          }
        }
      `}</style>

      <div className={`breathing-circle ${phase}`}>
        <div className="breathing-text">
          <div className="phase-text">{getPhaseText()}</div>
          <div className="countdown">{seconds}</div>
        </div>
      </div>
    </div>
  );
};

export default BreathingAnimator;