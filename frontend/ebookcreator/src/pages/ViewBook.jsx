import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/apiClient';
import toast from 'react-hot-toast';

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

  if (loading) return <div className="p-4">Loading...</div>;
  if (!book) return <div className="p-4">No book found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl mb-2">{book.title}</h1>
      {book.subtitle && <h2 className="text-lg text-gray-600 mb-2">{book.subtitle}</h2>}
      <div className="text-sm text-gray-600 mb-4">By {book.author}</div>
      <div className="prose mb-6">{book.description}</div>

      {book.chapters && book.chapters.length > 0 ? (
        <div className="space-y-8">
          {book.chapters.map((chapter, index) => (
            <div key={index} className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-2">
                Chapter {index + 1}: {chapter.title}
              </h3>
              {chapter.content ? (
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {chapter.content}
                </p>
              ) : (
                <p className="text-gray-400 italic">No content generated yet for this chapter.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">No chapters yet.</p>
      )}
    </div>
  );
};

export default ViewBook;