import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { FiPlus } from 'react-icons/fi';

const stages = [
  { key: 'new', label: 'New' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
];

const emptyForm = { title: '', contact: '', value: '', stage: 'new', expectedCloseDate: '', notes: '' };

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [dragDealId, setDragDealId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dealsRes, contactsRes] = await Promise.all([
        api.get('/deals'),
        api.get('/contacts', { params: { limit: 200 } }),
      ]);
      setDeals(dealsRes.data);
      setContacts(contactsRes.data.contacts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.contact) {
      setError('Please select a contact for this deal');
      return;
    }
    try {
      await api.post('/deals', form);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const moveDeal = async (dealId, newStage) => {
    setDeals((prev) => prev.map((d) => (d._id === dealId ? { ...d, stage: newStage } : d)));
    try {
      await api.put(`/deals/${dealId}`, { stage: newStage });
    } catch (err) {
      console.error(err);
      fetchAll();
    }
  };

  return (
    <Layout title="Deals">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted small mb-0">Drag a card between columns to update its stage.</p>
        <button className="btn btn-orbit d-flex align-items-center gap-2" onClick={openCreate}>
          <FiPlus /> Add deal
        </button>
      </div>

      {loading ? (
        <div className="text-muted">Loading pipeline…</div>
      ) : (
        <div className="orbit-kanban">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.key);
            const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
            return (
              <div
                key={stage.key}
                className="orbit-kanban-col"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dragDealId && moveDeal(dragDealId, stage.key)}
              >
                <div className="orbit-kanban-col-header">
                  <span>{stage.label}</span>
                  <span className="text-muted small">{stageDeals.length} · ${stageValue.toLocaleString()}</span>
                </div>
                <div className="orbit-kanban-col-body">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal._id}
                      className="orbit-deal-card"
                      draggable
                      onDragStart={() => setDragDealId(deal._id)}
                    >
                      <div className="fw-semibold small mb-1">{deal.title}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{deal.contact?.name}</div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="badge text-bg-light">${Number(deal.value || 0).toLocaleString()}</span>
                        {deal.expectedCloseDate && (
                          <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {new Date(deal.expectedCloseDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {stageDeals.length === 0 && <div className="text-muted small text-center py-3">No deals</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="orbit-modal-backdrop">
          <div className="orbit-modal">
            <h2 className="h5 mb-3">Add deal</h2>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold">Deal title*</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Contact*</label>
                  <select
                    className="form-select"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    required
                  >
                    <option value="">Select a contact</option>
                    {contacts.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} {c.company ? `— ${c.company}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Value ($)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Stage</label>
                  <select
                    className="form-select"
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  >
                    {stages.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Expected close date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.expectedCloseDate}
                    onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-orbit">
                  Create deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Deals;
