import { useState } from 'react';
import Modal from '../ui/Modal';
import InputField from '../ui/InputField';
import TextareaField from '../ui/TextareaField';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const CreateBookModal = ({ isOpen, onClose, onCreateBook }) => {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        author: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.author.trim()) newErrors.author = 'Author name is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await onCreateBook(formData);
            setFormData({ title: '', subtitle: '', author: '', description: '' });
            setErrors({});
            onClose();
            toast.success('Book created successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to create book');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Book"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="Book Title"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    required
                />

                <InputField
                    label="Subtitle"
                    name="subtitle"
                    placeholder="Enter subtitle (optional)"
                    value={formData.subtitle}
                    onChange={handleChange}
                />

                <InputField
                    label="Author Name"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleChange}
                    error={errors.author}
                    required
                />

                <TextareaField
                    label="Description"
                    name="description"
                    placeholder="Enter book description (optional)"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                />

                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Book'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateBookModal;