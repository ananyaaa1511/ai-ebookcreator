import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiClient } from '../utils/apiClient';
import { API_PATHS } from '../utils/apiPaths';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

const PERKS = [
    'AI-assisted chapter writing',
    'PDF & DOCX export',
    'Cover image uploads',
    'Unlimited eBooks',
];

const SignupPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
    });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
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
            const response = await apiClient.post(API_PATHS.auth.register, {
                name: formData.name, email: formData.email, password: formData.password,
            });
            const { user, token } = response.data;
            login(user, token);
            toast.success('Account created — welcome aboard!');
            navigate('/dashboard');
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
        } finally { setLoading(false); }
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
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 w-fit">
                        <Sparkles className="w-4 h-4 text-violet-200" />
                        <span className="text-violet-100 text-sm font-medium">Free to get started</span>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Everything you need<br />to <span className="text-violet-200">publish faster.</span>
                        </h2>
                        <p className="text-violet-200 text-base max-w-sm">
                            Create an account and start writing your first eBook today — no credit card required.
                        </p>
                    </div>
                    <ul className="space-y-3">
                        {PERKS.map((perk) => (
                            <li key={perk} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-violet-300 flex-shrink-0" />
                                <span className="text-violet-100 text-sm">{perk}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="relative z-10 text-violet-300 text-xs">Trusted by 2,400+ writers worldwide.</p>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex lg:hidden items-center gap-3 justify-center">
                        <div className="bg-violet-600 p-2 rounded-xl"><BookOpen className="w-5 h-5 text-white" /></div>
                        <span className="text-gray-900 font-semibold text-lg">AI eBook Creator</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                        <p className="text-gray-500 mt-1 text-sm">Start writing your first eBook in under a minute.</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <InputField label="Full name" type="text" name="name" placeholder="Jane Smith"
                                value={formData.name} onChange={handleChange} error={errors.name} disabled={loading} required />
                            <InputField label="Email address" type="email" name="email" placeholder="you@example.com"
                                value={formData.email} onChange={handleChange} error={errors.email} disabled={loading} required />
                            <InputField label="Password" type="password" name="password" placeholder="Min. 6 characters"
                                value={formData.password} onChange={handleChange} error={errors.password} disabled={loading} required />
                            <InputField label="Confirm password" type="password" name="confirmPassword" placeholder="••••••••"
                                value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} disabled={loading} required />
                            <Button type="submit" variant="primary" size="lg"
                                className="w-full !bg-violet-600 hover:!bg-violet-700 !rounded-xl !font-semibold mt-2"
                                disabled={loading}>
                                {loading ? 'Creating account...' : 'Create free account'}
                            </Button>
                        </form>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">Sign in</Link>
                    </p>
                    <p className="text-center text-xs text-gray-400">
                        By creating an account you agree to our{' '}
                        <a href="#" className="underline hover:text-gray-600">Terms</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;