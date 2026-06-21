import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import { apiClient } from '../utils/apiClient';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';
import { User, Mail, Save } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
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
            const response = await apiClient.put(API_PATHS.auth.updateProfile, {
                name: formData.name,
            });
            updateUser(response.data.user || { name: formData.name });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Avatar Section */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <span className="text-4xl font-bold text-blue-600">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="p-8">
                        {/* Account Status */}
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                                        Active
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <InputField
                                    label="Full Name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                    disabled={loading}
                                    required
                                />

                                <InputField
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={() => { }} // Email is read-only
                                    disabled={true}
                                />

                                <div className="flex gap-4">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({ name: user?.name || '', email: user?.email || '' });
                                            setErrors({});
                                        }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900">{user?.name}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900">{user?.email}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li><span className="font-medium">Account Status:</span> Active</li>
                        <li><span className="font-medium">Member Since:</span> {new Date().getFullYear()}</li>
                        <li><span className="font-medium">Plan:</span> Free</li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;