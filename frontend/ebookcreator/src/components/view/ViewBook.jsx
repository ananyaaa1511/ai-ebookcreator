const ViewBook = ({ chapter, book }) => {
    if (!chapter) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Select a chapter to view</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto bg-white rounded-lg">
            <div className="p-8 max-w-4xl mx-auto">
                {/* Book and Chapter Info */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{book?.title}</h1>
                    {book?.subtitle && (
                        <p className="text-xl text-gray-600 mb-2">{book.subtitle}</p>
                    )}
                    <p className="text-gray-500">By {book?.author}</p>
                </div>

                <hr className="my-8" />

                {/* Chapter Content */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{chapter.title}</h2>
                        {chapter.description && (
                            <p className="text-lg text-gray-600 mb-4 italic">{chapter.description}</p>
                        )}
                    </div>

                    {/* Chapter Body */}
                    <div className="prose prose-lg max-w-none">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {chapter.content || 'No content available for this chapter.'}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Chapter {chapter.chapterNumber || 1} of {book?.chapters?.length || 0}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViewBook;