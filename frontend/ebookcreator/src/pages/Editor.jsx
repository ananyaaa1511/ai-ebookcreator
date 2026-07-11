import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/apiClient';
import toast from 'react-hot-toast';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useEffect } from 'react';

// Draggable Chapter Component
const DraggableChapter = ({ chapter, index, onRemove, onUpdate, onGenerateContent, isGenerating }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `chapter-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`border p-4 rounded bg-gray-50 ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
        >
            <div className="flex items-start gap-3 mb-3">
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing flex-shrink-0"
                    title="Drag to reorder"
                >
                    <GripVertical size={20} />
                </button>
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                        <h3 className="font-semibold">Chapter {index + 1}</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onGenerateContent(index)}
                                disabled={isGenerating === index}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
                            >
                                {isGenerating === index ? 'Generating...' : 'Generate content'}
                            </button>
                            <button
                                onClick={() => onRemove(index)}
                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                    <input
                        className="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Chapter title"
                        value={chapter.title}
                        onChange={(e) => onUpdate(index, 'title', e.target.value)}
                    />
                    <textarea
                        className="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Chapter description"
                        rows={2}
                        value={chapter.description}
                        onChange={(e) => onUpdate(index, 'description', e.target.value)}
                    />
                    <textarea
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Chapter content (Markdown supported)"
                        rows={4}
                        value={chapter.content}
                        onChange={(e) => onUpdate(index, 'content', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

const Editor = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: '', subtitle: '', author: '', description: '', chapters: [] });
    const [aiStyle, setAiStyle] = useState('Informative');
    const [numChapters, setNumChapters] = useState(5);
    const [outlineLoading, setOutlineLoading] = useState(false);
    const [chapterGenerating, setChapterGenerating] = useState(null);

    // Drag-and-drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            distance: 8,
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/books/${bookId}`);
                setBook(res.data);
                setForm({
                    title: res.data.title || '',
                    subtitle: res.data.subtitle || '',
                    author: res.data.author || '',
                    description: res.data.description || '',
                    chapters: res.data.chapters || [],
                });
            } catch (err) {
                console.error(err);
                toast.error('Failed to load book');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [bookId]);

    const handleSave = async () => {
        try {
            await api.put(`/books/${bookId}`, form);
            toast.success('Book saved');
            const res = await api.get(`/books/${bookId}`);
            setBook(res.data);
            setForm((prev) => ({ ...prev, chapters: res.data.chapters || [] }));
        } catch (err) {
            console.error(err);
            toast.error('Save failed');
        }
    };

    const addChapter = () => {
        setForm((prev) => ({
            ...prev,
            chapters: [...(prev.chapters || []), { title: '', description: '', content: '' }],
        }));
    };

    const updateChapter = (index, field, value) => {
        setForm((prev) => {
            const chapters = [...(prev.chapters || [])];
            chapters[index] = { ...chapters[index], [field]: value };
            return { ...prev, chapters };
        });
    };

    const removeChapter = (index) => {
        setForm((prev) => {
            const chapters = [...(prev.chapters || [])];
            chapters.splice(index, 1);
            return { ...prev, chapters };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeIndex = parseInt(active.id.split('-')[1]);
            const overIndex = parseInt(over.id.split('-')[1]);

            setForm((prev) => {
                const chapters = [...(prev.chapters || [])];
                return {
                    ...prev,
                    chapters: arrayMove(chapters, activeIndex, overIndex),
                };
            });
        }
    };

    const generateOutline = async () => {
        if (!form.title && !form.description) {
            toast.error('Please add a book title or description first');
            return;
        }

        setOutlineLoading(true);
        try {
            const topic = form.title || book?.title || 'Book topic';
            const payload = {
                topic,
                style: aiStyle,
                numChapters,
                description: form.description || book?.subtitle || '',
            };
            const res = await api.post('/ai/generate-outline', payload);
            const outline = res.data.outline || [];
            if (!outline.length) {
                toast.error('No outline returned');
                return;
            }
            setForm((prev) => ({
                ...prev,
                chapters: outline.map((item) => ({
                    title: item.title || '',
                    description: item.description || '',
                    content: '',
                })),
            }));
            toast.success('Outline generated');
        } catch (err) {
            console.error(err);
            toast.error('Outline generation failed');
        } finally {
            setOutlineLoading(false);
        }
    };

    const generateChapterContent = async (index) => {
        const chapter = form.chapters?.[index];
        if (!chapter?.title) {
            toast.error('Chapter title is required');
            return;
        }

        setChapterGenerating(index);
        try {
            const res = await api.post('/ai/generate-chapter-content', {
                chapterTitle: chapter.title,
                chapterDescription: chapter.description,
                style: aiStyle,
            });
            updateChapter(index, 'content', res.data.content || '');
            toast.success('Chapter content generated');
        } catch (err) {
            console.error(err);
            toast.error('Chapter generation failed');
        } finally {
            setChapterGenerating(null);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!book) return <div className="p-4">Book not found.</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Title</label>
                        <input className="w-full border p-2 rounded" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Subtitle</label>
                        <input className="w-full border p-2 rounded" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Author</label>
                        <input className="w-full border p-2 rounded" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Description</label>
                        <textarea className="w-full border p-2 rounded" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button onClick={handleSave} className="px-4 py-2 bg-orange-500 text-white rounded">Save</button>
                        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border rounded">Back</button>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-slate-50 border border-slate-200 rounded p-4">
                <div className="flex flex-col md:flex-row md:items-end md:gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium">AI Writing Style</label>
                        <select value={aiStyle} onChange={(e) => setAiStyle(e.target.value)} className="mt-1 w-full border p-2 rounded">
                            <option>Informative</option>
                            <option>Narrative</option>
                            <option>Academic</option>
                            <option>Conversational</option>
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium">Chapters</label>
                        <input type="number" min={1} max={12} value={numChapters} onChange={(e) => setNumChapters(Number(e.target.value))} className="mt-1 w-full border p-2 rounded" />
                    </div>
                    <button onClick={generateOutline} disabled={outlineLoading} className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded shadow">
                        {outlineLoading ? 'Generating...' : 'Generate Outline'}
                    </button>
                </div>
                <p className="mt-3 text-sm text-gray-600">Generate a chapter outline from the current title and description, then optionally generate individual chapter content.</p>
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Chapters</h2>
                    <button onClick={addChapter} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Add chapter</button>
                </div>
                {form.chapters && form.chapters.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={form.chapters.map((_, index) => `chapter-${index}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {form.chapters.map((chapter, index) => (
                                    <DraggableChapter
                                        key={`chapter-${index}`}
                                        chapter={chapter}
                                        index={index}
                                        onRemove={removeChapter}
                                        onUpdate={updateChapter}
                                        onGenerateContent={generateChapterContent}
                                        isGenerating={chapterGenerating}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="border p-4 rounded bg-gray-50 text-gray-600">No chapters yet. Add one above.</div>
                )}
            </div>
        </div>
    );
};

export default Editor;