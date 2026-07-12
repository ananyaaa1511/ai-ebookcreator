import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/apiClient';
import toast from 'react-hot-toast';
import ViewChapterSidebar from '../components/view/ViewChapterSidebar';
import ViewBookContent from '../components/view/ViewBook';

const ViewBook = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/books/${bookId}`);
        setBook(res.data);
        if (res.data.chapters && res.data.chapters.length > 0) {
          setSelectedChapter(res.data.chapters[0]);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [bookId]);

  const handleSelectChapter = (chapter) => {
    setSelectedChapter(chapter);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!book) return <div className="p-4">No book found.</div>;

  return (
    <div className="flex h-screen">
      <ViewChapterSidebar
        chapters={book.chapters}
        selectedChapterId={selectedChapter?._id}
        onSelectChapter={handleSelectChapter}
      />
      <ViewBookContent book={book} chapter={selectedChapter} />
    </div>
  );
};

export default ViewBook;