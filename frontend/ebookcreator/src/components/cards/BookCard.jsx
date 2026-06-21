
import Button from '../ui/Button';

const BookCard = ({
    book,
    onEdit,
    onDelete,
    onView,
    onExport,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-white text-center">
                        <svg
                            className="w-16 h-16 mx-auto mb-2 opacity-50"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                        </svg>
                        <p className="text-sm">No Cover</p>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{book.title}</h3>
                {book.subtitle && (
                    <p className="text-sm text-gray-600 line-clamp-1 mt-1">{book.subtitle}</p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                    By {book.author || 'Unknown'}
                </p>

                {/* Book Stats */}
                <div className="flex gap-4 text-xs text-gray-600 mt-3 py-2 border-t border-b border-gray-200">
                    <div>
                        <span className="font-semibold">{book.chapters?.length || 0}</span> Chapters
                    </div>
                    <div>
                        <span className="font-semibold">{book.status || 'draft'}</span> Status
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 flex-wrap">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={onView}
                        className="flex-1 min-w-fit"
                    >
                        View
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={onEdit}
                        className="flex-1 min-w-fit"
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onExport}
                        className="flex-1 min-w-fit"
                    >
                        Export
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={onDelete}
                        className="flex-1 min-w-fit"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
