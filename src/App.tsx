import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import MemoryDetail from './pages/MemoryDetail';
import Timeline from './pages/Timeline';
import ManageMembers from './pages/ManageMembers';
import AcceptInvite from './pages/AcceptInvite';
import Privacy from './pages/Privacy';
import AboutUs from './pages/AboutUs';
import Settings from './pages/Settings';
import Activity from './pages/Activity';
import Storage from './pages/Storage';
// --- IMPORT ADMIN REVIEW COMPONENT ---
import AdminReviewMemories from './components/AdminReviewMemories';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-[#181411] text-white flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/accept-invite" element={<AcceptInvite />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/about" element={<AboutUs />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/memory/:id"
                  element={
                    <ProtectedRoute>
                      <MemoryDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/timeline"
                  element={
                    <ProtectedRoute>
                      <Timeline />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/members"
                  element={
                    <ProtectedRoute>
                      <ManageMembers />
                    </ProtectedRoute>
                  }
                />
                {/* ---- NEW ROUTES BELOW ---- */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/activity"
                  element={
                    <ProtectedRoute>
                      <Activity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/storage"
                  element={
                    <ProtectedRoute>
                      <Storage />
                    </ProtectedRoute>
                  }
                />
                {/* ---- ADMIN MEMORY REVIEW ROUTE ---- */}
                <Route
                  path="/admin/review"
                  element={
                    <ProtectedRoute>
                      <AdminReviewMemories />
                    </ProtectedRoute>
                  }
                />
                {/* ---- CATCH-ALL ---- */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
