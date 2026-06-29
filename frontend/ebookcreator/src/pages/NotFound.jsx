import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Button from '../components/ui/Button';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-md border border-indigo-100/50 rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center transition-all hover:shadow-2xl">
        {/* Animated Icon Container */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-6 animate-bounce">
          <FileQuestion className="w-10 h-10" />
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-extrabold text-indigo-900 tracking-tight mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 !bg-indigo-600 hover:!bg-indigo-700 !rounded-xl !py-3 !px-6 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center justify-center gap-2 !rounded-xl !py-3 !px-6 transition-all"
          >
            <Home className="w-4 h-4" /> {isAuthenticated ? 'Dashboard' : 'Home'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
