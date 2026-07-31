import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const Topbar = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <header className="orbit-topbar d-flex align-items-center justify-content-between px-4 py-3">
      <h1 className="orbit-page-title mb-0">{title}</h1>
      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-sm-block">
          <div className="fw-semibold small">{user?.name}</div>
          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.role}</div>
        </div>
        <div className="orbit-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={logout}>
          <FiLogOut /> <span className="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
