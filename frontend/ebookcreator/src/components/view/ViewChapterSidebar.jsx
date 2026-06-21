import { ChevronDown, ChevronRight } from 'lucide-react';

const ViewChapterSidebar = ({
    chapters = [],
    selectedChapterId,
    onSelectChapter,
}) => {
    return (
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chapters</h3>

                {chapters && chapters.length > 0 ? (
                    <nav className="space-y-1">
                        {chapters.map((chapter, index) => (
                            <button
                                key={chapter._id || index}
                                onClick={() => onSelectChapter(chapter, index)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-start gap-2 group ${selectedChapterId === chapter._id
                                    ? 'bg-blue-100 text-blue-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-sm mt-0.5">
                                    {selectedChapterId === chapter._id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </span>
                                <span className="flex-1 overflow-hidden">
                                    <div className="font-medium truncate">Chapter {index + 1}</div>
                                    <div className="text-xs opacity-75 truncate">{chapter.title}</div>
                                </span>
                            </button>
                        ))}
                    </nav>
                ) : (
                    <p className="text-center text-gray-500 py-8">No chapters available</p>
                )}
            </div>
        </aside>
    );
};

export default ViewChapterSidebar;