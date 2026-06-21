import Dropdown from '../ui/Dropdown';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ user }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    return (
        <Dropdown
            trigger={
                <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                </div>
            }
            items={[
                {
                    label: 'My Profile',
                    onClick: handleProfile,
                },
                {
                    divider: true,
                },
                {
                    label: 'Logout',
                    onClick: handleLogout,
                },
            ]}
            align="right"
        />
    );
};

export default ProfileDropdown;