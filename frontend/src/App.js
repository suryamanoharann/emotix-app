import React, { useState, useEffect } from 'react';
    import AuthPage from './pages/AuthPage';
    import JournalPage from './pages/JournalPage';
    import CalmCornerPage from './pages/CalmCornerPage';
    import DashboardPage from './pages/DashboardPage'; 
    import './App.css';

    function App() {
      const [currentUser, setCurrentUser] = useState(null);
      const [currentPage, setCurrentPage] = useState('journal');

      useEffect(() => {
        const storedUser = localStorage.getItem('emotix_user');
        if (storedUser) {
          setCurrentUser(storedUser);
        }
      }, []);

      const handleLoginSuccess = (username) => {
        setCurrentUser(username);
        localStorage.setItem('emotix_user', username);
        setCurrentPage('journal'); 
      };

      const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('emotix_user');
        setCurrentPage('journal'); 
      };

      if (!currentUser) {
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
      }

      const renderPage = () => {
        switch (currentPage) {
          case 'journal':
            return <JournalPage username={currentUser} />;
          case 'dashboard': 
            return <DashboardPage username={currentUser} />;
          case 'calm':
            return <CalmCornerPage />;
          default:
            return <JournalPage username={currentUser} />;
        }
      }

      return (
        <div className="App">
          <nav className="navbar">
            <div className="nav-brand">EmotiX</div>
            <div className="nav-links">
              <button
                className={currentPage === 'journal' ? 'nav-btn active' : 'nav-btn'}
                onClick={() => setCurrentPage('journal')}
              >
                Journal
              </button>
              
              <button
                className={currentPage === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
                onClick={() => setCurrentPage('dashboard')}
              >
                Dashboard
              </button>

              <button
                className={currentPage === 'calm' ? 'nav-btn active' : 'nav-btn'}
                onClick={() => setCurrentPage('calm')}
              >
                Calm Corner
              </button>
              <button className="nav-btn logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </nav>

          <main className="main-content">
            {renderPage()}
          </main>
        </div>
      );
    }

    export default App;