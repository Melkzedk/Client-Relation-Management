import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const emptyForm = { title: '', description: '', dueDate: '', priority: 'medium' };
const priorityColors = { low: 'secondary', medium: 'warning', high: 'danger' };

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/tasks', form);
      setShowModal(false);
      setForm(emptyForm);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const toggleStatus = async (task) => {
    const status = task.status === 'completed' ? 'pending' : 'completed';
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status } : t)));
    await api.put(`/tasks/${task._id}`, { status });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <Layout title="Tasks">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted small mb-0">Track follow-ups and to-dos across your pipeline.</p>
        <button className="btn btn-orbit d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <FiPlus /> Add task
        </button>
      </div>

      {loading ? (
        <div className="text-muted">Loading tasks…</div>
      ) : (
        <div className="orbit-card p-0">
          <ul className="list-group list-group-flush">
            {tasks.length === 0 && <li className="list-group-item text-muted text-center py-4">No tasks yet.</li>}
            {tasks.map((task) => (
              <li key={task._id} className="list-group-item d-flex align-items-start gap-3 py-3">
                <input
                  type="checkbox"
                  className="form-check-input mt-1"
                  checked={task.status === 'completed'}
                  onChange={() => toggleStatus(task)}
                />
                <div className="flex-grow-1">
                  <div className={`fw-semibold ${task.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}`}>
                    {task.title}
                  </div>
                  {task.description && <div className="text-muted small">{task.description}</div>}
                  <div className="d-flex gap-2 mt-1 flex-wrap">
                    <span className={`badge text-bg-${priorityColors[task.priority]} text-capitalize`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="badge text-bg-light">Due {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(task._id)}>
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showModal && (
        <div className="orbit-modal-backdrop">
          <div className="orbit-modal">
            <h2 className="h5 mb-3">Add task</h2>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold">Title*</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Due date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Priority</label>
                  <select
                    className="form-select"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-orbit">
                  Create task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Tasks;
