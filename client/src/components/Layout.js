import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ title, children }) => {
  return (
    <div className="orbit-shell">
      <Sidebar />
      <div className="orbit-main">
        <Topbar title={title} />
        <main className="orbit-content p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
