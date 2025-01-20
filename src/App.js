import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AuthLayout from './components/auth/AuthLayout';
import Dashboard from './components/Dashboard/Dashboard';
import PostJobs from './components/SideBarMenuItems/JobsAndInternships/PostJobs/PostJobs';
import PostInternship from './components/SideBarMenuItems/JobsAndInternships/PostInternship/PostInternship';
import PostUnpaidInternship from './components/SideBarMenuItems/JobsAndInternships/PostUnpaidInternship/PostUnpaidInternship';
import ActiveListings from './components/SideBarMenuItems/JobListings/ActiveListings/ActiveListings';
import ClosedListings from './components/SideBarMenuItems/JobListings/ClosedListings/ClosedListings';
import AutomatedListings from './components/SideBarMenuItems/JobListings/AutoListings/AutomatedListings/AutomatedListings';
import NotAutomatedListings from './components/SideBarMenuItems/JobListings/AutoListings/NotAutomatedListings/NotAutomatedListings';
import ExpiredListings from './components/SideBarMenuItems/JobListings/AutoListings/ExpiredListings/ExpiredListings';
import Assignments from './components/SideBarMenuItems/Assignments/Assignments';
import Questions from './components/SideBarMenuItems/Questions/Questions';
import './styles/global.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-vh-100 w-100 overflow-hidden">
          <Routes>
            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />} />

            {/* Protected routes wrapped in Layout */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/post-jobs" element={<PostJobs />} />
                      <Route path="/post-internship" element={<PostInternship />} />
                      <Route path="/post-unpaid-internship" element={<PostUnpaidInternship />} />
                      <Route path="/active-listings" element={<ActiveListings />} />
                      <Route path="/closed-listings" element={<ClosedListings />} />
                      <Route path="/automated-listings" element={<AutomatedListings />} />
                      <Route path="/not-automated-listings" element={<NotAutomatedListings />} />
                      <Route path="/expired-listings" element={<ExpiredListings />} />
                      <Route path="/assignments" element={<Assignments />} />
                      <Route path="/questions" element={<Questions />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
