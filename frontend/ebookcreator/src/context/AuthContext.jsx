import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("token");
    });

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/';
    }, []);

    const checkAuthStatus = useCallback(async () => {
        await Promise.resolve();
        try {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem('user');
            if (token && userStr && userStr !== "undefined") {
                const userData = JSON.parse(userStr);
                setUser(userData);
                setIsAuthenticated(true);
            } else if (!token) {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const updateUser = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData };
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
    };

    useEffect(() => {
        const runAuthCheck = async () => {
            await checkAuthStatus();
        };

        runAuthCheck();
    }, [checkAuthStatus]);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};