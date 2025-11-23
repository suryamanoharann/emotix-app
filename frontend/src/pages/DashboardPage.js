import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './DashboardPage.css'; 
import WellnessAlert from '../components/WellnessAlert';
import { getMoodData } from '../api/apiService'; 

const DashboardPage = ({ username }) => {
  const [moods, setMoods] = useState({});
  const [showWellnessAlert, setShowWellnessAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getMoodData(username);
        setMoods(data.moods);
        if (data.wellness_alert) {
          setShowWellnessAlert(true);
        }
      } catch (error) {
        console.error("Error loading mood data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (username) {
      loadData();
    }
  }, [username]);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const vibe = moods[dateString];
      if (vibe) {
        return `day-vibe ${vibe.toLowerCase()}-day`;
      }
    }
    return null;
  };

  return (
    <Layout>
      <div className="dashboard-page">
        <h1 className="page-title">Your Mood Calendar</h1>
        <p className="page-subtitle">Visualize your emotional journey over time</p>
        
        {loading ? (
          <p className="loading-text">Loading your calendar...</p>
        ) : (
          <div className="calendar-container">
            <Calendar
              onChange={setCurrentDate}
              value={currentDate}
              tileClassName={tileClassName}
              maxDate={new Date()} 
              defaultActiveStartDate={new Date()} 
            />
          </div>
        )}

        <div className="legend-container">
          <div className="legend-item"><span className="dot joyful-day"></span> Joyful</div>
          <div className="legend-item"><span className="dot sad-day"></span> Sad</div>
          <div className="legend-item"><span className="dot love-day"></span> Love</div>
          <div className="legend-item"><span className="dot anger-day"></span> Anger</div>
          <div className="legend-item"><span className="dot fear-day"></span> Fear</div>
          <div className="legend-item"><span className="dot surprise-day"></span> Surprise</div>
          <div className="legend-item"><span className="dot neutral-day"></span> Neutral</div>
        </div>

        {showWellnessAlert && (
          <WellnessAlert onClose={() => setShowWellnessAlert(false)} />
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;