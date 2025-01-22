import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-vh-100 w-100 overflow-hidden">
          <Routes>
            <Route element={<Layout />}>
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
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
