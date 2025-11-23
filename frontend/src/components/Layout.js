import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;