import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import { BookOpen, Sparkles, Zap, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: Sparkles,
            title: 'AI-Powered Content',
            description: 'Generate book outlines and chapter content using advanced AI technology.',
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Create and publish your eBook in minutes, not days.',
        },
        {
            icon: BookOpen,
            title: 'Multiple Formats',
            description: 'Export your books as PDF, Word, or EPUB files.',
        },
        {
            icon: Users,
            title: 'Simple Dashboard',
            description: 'Manage all your books in one place — create, edit, and organize with ease.',
        },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Author',
            text: 'This tool helped me publish my first novel in just two weeks. Amazing!',
        },
        {
            name: 'Mike Chen',
            role: 'Content Creator',
            text: 'The AI suggestions are spot-on. It\'s like having a professional editor.',
        },
        {
            name: 'Emma Wilson',
            role: 'Publisher',
            text: 'We use this for all our author onboarding. Game changer!',
        },
    ];

    return (
        <div className="w-full">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-0">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div>
                                <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                    Welcome to the Future of Writing
                                </div>
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                    Write Your eBook with AI
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Create professional eBooks faster than ever with our AI-powered platform. Generate content, organize chapters, and export in multiple formats—all in one place.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    variant="primary"
                                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                                    className="flex items-center justify-center gap-2"
                                >
                                    Get Started <ArrowRight className="w-5 h-5" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate('/login')}
                                    className={isAuthenticated ? 'hidden' : ''}
                                >
                                    Sign In
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">10K+</div>
                                    <div className="text-sm text-gray-600">Books Created</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">50K+</div>
                                    <div className="text-sm text-gray-600">Happy Users</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">99%</div>
                                    <div className="text-sm text-gray-600">Satisfaction</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Illustration */}
                        <div className="hidden md:block">
                            <div className="relative w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                                <BookOpen className="w-32 h-32 text-white opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                        <p className="text-xl text-gray-600">Everything you need to create and publish eBooks</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-200"
                                >
                                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Users Say</h2>
                        <p className="text-xl text-gray-600">Join thousands of satisfied authors</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.name}
                                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Write Your eBook?</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of authors creating amazing eBooks with AI.
                    </p>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                        className="bg-white text-blue-600 hover:bg-gray-100"
                    >
                        Get Started Free
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-6 h-6 text-blue-400" />
                                <span className="font-bold text-white">AI eBook Creator</span>
                            </div>
                            <p className="text-sm">Create beautiful eBooks with AI-powered content generation.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition">Features</a></li>
                                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition">About</a></li>
                                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm">
                        <p>&copy; 2024 AI eBook Creator. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;