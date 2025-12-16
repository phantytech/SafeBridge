import React from 'react';
import { Switch, Route } from "wouter";
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import MainApp from './pages/MainApp';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <AuthPage />;
  }
  
  return <Component />;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/auth" component={AuthPage} />
          
          {/* Protected Routes */}
          <Route path="/dashboard">
            <ProtectedRoute component={MainApp} />
          </Route>
          
          {/* Fallback */}
          <Route component={LandingPage} />
        </Switch>
      </div>
    </AuthProvider>
  );
}

export default App;
