import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import ErrorBoundary from './components/ErrorBoundary';

// Import other components
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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="app-wrapper bg-dark-blue min-h-screen">
            <Routes>
              {/* Redirect /auth to root */}
              <Route path="/auth" element={<Navigate to="/" replace />} />
              
              {/* Main layout with nested routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="post-jobs" element={<PostJobs />} />
                <Route path="post-internship" element={<PostInternship />} />
                <Route path="post-unpaid-internship" element={<PostUnpaidInternship />} />
                <Route path="active-listings" element={<ActiveListings />} />
                <Route path="closed-listings" element={<ClosedListings />} />
                <Route path="automated-listings" element={<AutomatedListings />} />
                <Route path="not-automated-listings" element={<NotAutomatedListings />} />
                <Route path="expired-listings" element={<ExpiredListings />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="questions" element={<Questions />} />
              </Route>
            </Routes>
            <ToastContainer theme="dark" />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

export default App;
