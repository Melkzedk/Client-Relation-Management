import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { FiUsers, FiUserCheck, FiTrendingUp, FiDollarSign, FiCheckSquare } from 'react-icons/fi';

const StatCard = ({ icon, label, value, accent }) => (
  <div className="col-12 col-sm-6 col-xl-3">
    <div className="orbit-card p-3 h-100">
      <div className="d-flex align-items-center gap-3">
        <div className="orbit-stat-icon" style={{ background: accent }}>
          {icon}
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="h4 mb-0">{value}</div>
        </div>
      </div>
    </div>
  </div>
);

const stageLabels = {
  new: 'New',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const maxStageCount = stats?.dealsByStage?.length
    ? Math.max(...stats.dealsByStage.map((s) => s.count))
    : 1;

  return (
    <Layout title="Dashboard">
      {loading ? (
        <div className="text-muted">Loading overview…</div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <StatCard icon={<FiUsers />} label="Total Contacts" value={stats.totalContacts} accent="#EAF1FF" />
            <StatCard icon={<FiUserCheck />} label="Customers" value={stats.totalCustomers} accent="#E9FBF3" />
            <StatCard icon={<FiTrendingUp />} label="Open Deals" value={stats.openDeals} accent="#FFF3E6" />
            <StatCard
              icon={<FiDollarSign />}
              label="Revenue Won"
              value={`$${Number(stats.totalRevenue).toLocaleString()}`}
              accent="#F1ECFF"
            />
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-7">
              <div className="orbit-card p-4 h-100">
                <h2 className="h6 mb-3">Pipeline by stage</h2>
                {stats.dealsByStage.length === 0 && (
                  <p className="text-muted small mb-0">No deals yet — add one from the Deals page.</p>
                )}
                {stats.dealsByStage.map((s) => (
                  <div key={s._id} className="mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="fw-semibold">{stageLabels[s._id] || s._id}</span>
                      <span className="text-muted">{s.count} deal{s.count !== 1 ? 's' : ''} · ${Number(s.value).toLocaleString()}</span>
                    </div>
                    <div className="orbit-progress">
                      <div
                        className="orbit-progress-bar"
                        style={{ width: `${(s.count / maxStageCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="orbit-card p-4 h-100 d-flex flex-column">
                <h2 className="h6 mb-3">Tasks awaiting action</h2>
                <div className="display-5 fw-bold mb-1">{stats.pendingTasks}</div>
                <p className="text-muted small mb-0">
                  Open tasks across all contacts and deals. Visit the Tasks page to review and close them out.
                </p>
                <div className="mt-auto pt-3">
                  <FiCheckSquare size={28} className="text-muted" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
