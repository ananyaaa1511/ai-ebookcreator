import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
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

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/png');
    });
};

const Editor = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: '', subtitle: '', author: '', description: '', chapters: [] });
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
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

    useEffect(() => {
        return () => {
            if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl);
        };
    }, [selectedFileUrl]);

    const coverSrc = book?.coverImageBase64 || (book?.coverImage ? `${BASE}/${book.coverImage}` : null);

    const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileSelect = (file) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setSelectedFile(file);
        setSelectedFileUrl(url);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };

    const uploadCroppedCover = async () => {
        if (!selectedFileUrl || !croppedAreaPixels) {
            toast.error('Please select and crop an image before uploading.');
            return;
        }

        try {
            const croppedBlob = await getCroppedImg(selectedFileUrl, croppedAreaPixels);
            if (!croppedBlob) {
                toast.error('Could not create cropped image');
                return;
            }
            const fileToUpload = new File([croppedBlob], selectedFile?.name || 'cover.png', { type: 'image/png' });
            const fd = new FormData();
            fd.append('coverImage', fileToUpload);
            await api.put(`/books/cover/${bookId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Cover uploaded');
            setSelectedFile(null);
            setSelectedFileUrl(null);
            setCroppedAreaPixels(null);
            const res = await api.get(`/books/${bookId}`);
            setBook(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Upload failed');
        }
    };

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
                <div className="w-full lg:w-48 h-64 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {selectedFileUrl ? (
                        <img src={selectedFileUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : coverSrc ? (
                        <img src={coverSrc} alt="cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-sm text-gray-400">No cover</div>
                    )}
                </div>

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
                        <label className="px-3 py-2 bg-gray-100 border rounded cursor-pointer">
                            Choose cover and crop
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files[0])} />
                        </label>
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

            {selectedFileUrl && (
                <div className="mt-6">
                    <div className="rounded overflow-hidden bg-black relative" style={{ height: 360 }}>
                        <Cropper
                            image={selectedFileUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={3 / 4}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={handleCropComplete}
                        />
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                        <label className="flex items-center gap-3 text-sm">
                            Zoom
                            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1" />
                        </label>
                        <div className="flex gap-3">
                            <button onClick={uploadCroppedCover} className="px-4 py-2 bg-green-600 text-white rounded">Upload cropped cover</button>
                            <button type="button" onClick={() => { setSelectedFile(null); setSelectedFileUrl(null); setCroppedAreaPixels(null); }} className="px-4 py-2 border rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

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