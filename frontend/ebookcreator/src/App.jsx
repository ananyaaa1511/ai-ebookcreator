// import React from "react";
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Loginpage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import Editor from './pages/Editor';
import ViewBook from './pages/ViewBook';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
const App = () => {
  return (
    <div >
      <Routes>
        {/*public routes*/}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/*protected routes*/}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/editor/:bookId" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        <Route path="/view-book/:bookId" element={<ProtectedRoute><ViewBook /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        {/*fallback route*/}
        <Route path="*" element={<NotFound />} />


      </Routes>
    </div>
  )
}
export default App;