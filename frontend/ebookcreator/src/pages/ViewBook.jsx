import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/apiClient';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ViewBook = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/books/${bookId}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [bookId]);

  const handleExport = async (type) => {
    try {
      const res = await api.get(`/export/${bookId}/${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${book?.title || 'book'}.${type === 'doc' ? 'docx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error('Export failed');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!book) return <div className="p-4">No book found.</div>;

  const coverSrc = book.coverImageBase64 || (book.coverImage ? `${BASE}/${book.coverImage}` : null);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      {coverSrc && <img src={coverSrc} alt="cover" className="w-48 h-64 object-cover rounded mb-4" />}
      <h1 className="text-2xl mb-2">{book.title}</h1>
      <div className="text-sm text-gray-600 mb-4">By {book.author}</div>
      <div className="prose mb-4">{book.description}</div>
      <div className="flex gap-2">
        <button onClick={() => handleExport('pdf')} className="px-3 py-1 border rounded">Export PDF</button>
        <button onClick={() => handleExport('doc')} className="px-3 py-1 border rounded">Export DOC</button>
      </div>
    </div>
  );
};

export default ViewBook;
