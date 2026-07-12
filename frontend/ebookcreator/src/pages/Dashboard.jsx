import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/apiClient';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';

const Dashboard = () => {
  const { logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', author: '', description: '' });
  const [editing, setEditing] = useState(null);

  const fetchBooks = useCallback(async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/books/${editing}`, form);
        toast.success('Book updated');
        setEditing(null);
      } else {
        await api.post('/books', form);
        toast.success('Book created');
      }
      setForm({ title: '', author: '', description: '' });
      fetchBooks();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Save failed';
      toast.error(message);
    }
  };

  const handleEdit = (book) => {
    setEditing(book._id || book.id);
    setForm({ title: book.title || '', author: book.author || '', description: book.description || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Deleted');
      fetchBooks();
    } catch (e) {
      console.error(e);
      toast.error('Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">My Books</h1>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 bg-white shadow p-4 rounded grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="border p-2 rounded col-span-1 md:col-span-3" />
          <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author" required className="border p-2 rounded" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required className="border p-2 rounded" />
          <div className="flex items-center gap-2">
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow">{editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: '', author: '', description: '' }); }} className="px-4 py-2">Cancel</button>}
          </div>
        </form>

        {loading ? <div>Loading...</div> : (
          <ul className="space-y-4">
            {books.map((b) => (
              <li key={b._id || b.id} className="bg-white shadow rounded p-4 flex gap-4 items-start">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-medium">{b.title}</h3>
                      <div className="text-sm text-gray-500">{b.author}</div>
                    </div>
                    <div className="text-sm text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</div>
                  </div>

                  <p className="mt-2 text-gray-700">{b.description}</p>

                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={() => handleEdit(b)} className="px-3 py-1 border rounded">Edit</button>
                    <Link to={`/editor/${b._id || b.id}`} className="px-3 py-1 border rounded">Open Editor</Link>
                    <Link to={`/view-book/${b._id || b.id}`} className="px-3 py-1 border rounded">View</Link>
                    <button onClick={() => handleDelete(b._id || b.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;