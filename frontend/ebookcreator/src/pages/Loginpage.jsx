import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiClient } from '../utils/apiClient';
import { API_PATHS } from '../utils/apiPaths';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { BookOpen, Sparkles } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ email: '', password: '' });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setLoading(true);
        try {
            const response = await apiClient.post(API_PATHS.auth.login, formData);
            const { user, token } = response.data;
            login(user, token);
            toast.success('Welcome back!');
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from);
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-violet-700 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-600 opacity-50" />
                <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-violet-800 opacity-60" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur p-2 rounded-xl">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-semibold text-lg">AI eBook Creator</span>
                    </div>
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 w-fit">
                        <Sparkles className="w-4 h-4 text-violet-200" />
                        <span className="text-violet-100 text-sm font-medium">AI-powered writing</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white leading-tight">
                        Turn your ideas into<br />
                        <span className="text-violet-200">polished eBooks</span><br />
                        in minutes.
                    </h2>
                    <p className="text-violet-200 text-base leading-relaxed max-w-sm">
                        Write, structure, and export professional eBooks with the help of AI.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {['A', 'B', 'C'].map((l) => (
                            <div key={l} className="w-8 h-8 rounded-full bg-violet-400 border-2 border-violet-700 flex items-center justify-center text-white text-xs font-semibold">{l}</div>
                        ))}
                    </div>
                    <p className="text-violet-200 text-sm">Joined by <span className="text-white font-semibold">2,400+</span> creators</p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex lg:hidden items-center gap-3 justify-center">
                        <div className="bg-violet-600 p-2 rounded-xl"><BookOpen className="w-5 h-5 text-white" /></div>
                        <span className="text-gray-900 font-semibold text-lg">AI eBook Creator</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
                        <p className="text-gray-500 mt-1 text-sm">Welcome back — let's pick up where you left off.</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <InputField label="Email address" type="email" name="email"
                                placeholder="you@example.com" value={formData.email}
                                onChange={handleChange} error={errors.email} disabled={loading} required />
                            <InputField label="Password" type="password" name="password"
                                placeholder="••••••••" value={formData.password}
                                onChange={handleChange} error={errors.password} disabled={loading} required />
                            <div className="flex justify-end">
                                <a href="#" className="text-sm text-violet-600 hover:text-violet-700 transition-colors">Forgot password?</a>
                            </div>
                            <Button type="submit" variant="primary" size="lg"
                                className="w-full !bg-violet-600 hover:!bg-violet-700 !rounded-xl !font-semibold"
                                disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">Create one free</Link>
                    </p>
                    <p className="text-center text-xs text-gray-400">
                        By signing in you agree to our{' '}
                        <a href="#" className="underline hover:text-gray-600">Terms</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;