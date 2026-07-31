import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiTrendingUp, FiCheckSquare } from 'react-icons/fi';

const links = [
  { to: '/', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/contacts', label: 'Contacts', icon: <FiUsers /> },
  { to: '/deals', label: 'Deals', icon: <FiTrendingUp /> },
  { to: '/tasks', label: 'Tasks', icon: <FiCheckSquare /> },
];

const Sidebar = () => {
  return (
    <aside className="orbit-sidebar d-none d-md-flex flex-column p-3">
      <div className="orbit-brand mb-4">
        <span className="orbit-brand-mark">O</span>
        <span className="orbit-brand-name">Orbit CRM</span>
      </div>
      <nav className="flex-grow-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `orbit-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="orbit-nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="orbit-sidebar-footer text-muted small">v1.0 &middot; MERN CRM</div>
    </aside>
  );
};

export default Sidebar;
