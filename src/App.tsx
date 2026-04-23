/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import AISupport from './pages/AISupport';
import Therapists from './pages/Therapists';

export default function App() {
  const { user } = useStore();

  return (
    <Router>
      <div className="min-h-screen relative overflow-x-hidden bg-[#0A0B10]">
        <div className="atmosphere-blobs">
          <div className="blob-1" />
          <div className="blob-2" />
          <div className="blob-3" />
        </div>
        
        <Routes>
          <Route path="/" element={<Landing />} />
          
          <Route 
            path="/onboarding" 
            element={user?.onboarded ? <Navigate to="/dashboard" /> : <OnboardingFlow />} 
          />
          
          <Route 
            path="/dashboard" 
            element={!user?.onboarded ? <Navigate to="/onboarding" /> : <Dashboard />} 
          />

          <Route 
            path="/ai-support" 
            element={!user?.onboarded ? <Navigate to="/onboarding" /> : <AISupport />} 
          />

          <Route 
            path="/therapists" 
            element={!user?.onboarded ? <Navigate to="/onboarding" /> : <Therapists />} 
          />
        </Routes>
      </div>
    </Router>
  );
}
