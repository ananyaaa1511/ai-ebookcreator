import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import ProfileDropdown from "./ProfileDropdown";
import { Menu, X, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <span className="font-bold text-lg text-gray-900">AI eBook Creator</span>
                    </Link>

                    {/* Desktop Navigation - Right Side */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <ProfileDropdown user={user} />
                        ) : (
                            <div className="flex gap-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 border-t border-gray-200">
                        <div className="py-4">
                            {isAuthenticated ? (
                                <div className="space-y-4">
                                    <div className="px-4 py-2">
                                        <div className="font-semibold text-gray-900">{user?.name}</div>
                                        <div className="text-sm text-gray-500">{user?.email}</div>
                                    </div>
                                    <hr />
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2 px-4">
                                    <Link
                                        to="/login"
                                        className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;