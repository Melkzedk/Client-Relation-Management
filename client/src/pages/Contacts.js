import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

const emptyForm = { name: '', email: '', phone: '', company: '', jobTitle: '', status: 'lead', notes: '' };
const statusColors = { lead: 'secondary', prospect: 'warning', customer: 'success', inactive: 'danger' };

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contacts', { params: { search, status, page, limit: 8 } });
      setContacts(data.contacts);
      setTotal(data.total);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (contact) => {
    setEditingId(contact._id);
    setForm({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      jobTitle: contact.jobTitle || '',
      status: contact.status || 'lead',
      notes: contact.notes || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/contacts/${editingId}`, form);
      } else {
        await api.post('/contacts', form);
      }
      setShowModal(false);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    await api.delete(`/contacts/${id}`);
    fetchContacts();
  };

  return (
    <Layout title="Contacts">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <div className="d-flex flex-wrap gap-2">
          <div className="orbit-search">
            <FiSearch />
            <input
              placeholder="Search name, email, company…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
          <select
            className="form-select form-select-sm w-auto"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All statuses</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="customer">Customer</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button className="btn btn-orbit d-flex align-items-center gap-2" onClick={openCreate}>
          <FiPlus /> Add contact
        </button>
      </div>

      <div className="orbit-card p-0">
        <div className="table-responsive">
          <table className="table orbit-table mb-0 align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">Loading…</td>
                </tr>
              )}
              {!loading && contacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">No contacts found.</td>
                </tr>
              )}
              {!loading &&
                contacts.map((c) => (
                  <tr key={c._id}>
                    <td className="fw-semibold">{c.name}</td>
                    <td>{c.company || '—'}</td>
                    <td>{c.email || '—'}</td>
                    <td>{c.phone || '—'}</td>
                    <td>
                      <span className={`badge text-bg-${statusColors[c.status]} text-capitalize`}>{c.status}</span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-light me-2" onClick={() => openEdit(c)}>
                        <FiEdit2 />
                      </button>
                      <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(c._id)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted small">{total} contact{total !== 1 ? 's' : ''} total</span>
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <button className="btn btn-sm btn-outline-secondary" disabled>
              {page} / {pages}
            </button>
            <button className="btn btn-sm btn-outline-secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="orbit-modal-backdrop">
          <div className="orbit-modal">
            <h2 className="h5 mb-3">{editingId ? 'Edit contact' : 'Add contact'}</h2>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Name*</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Company</label>
                  <input
                    className="form-control"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Phone</label>
                  <input
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Job title</label>
                  <input
                    className="form-control"
                    value={form.jobTitle}
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Notes</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-orbit">
                  {editingId ? 'Save changes' : 'Create contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Contacts;
