import { Switch, Route } from "wouter";
import LandingPage from './pages/LandingPage';
import LearnMore from './pages/LearnMore';
import AuthPage from './pages/AuthPage';
import MainApp from './pages/MainApp';
import SignLanguageGuide from './pages/SignLanguageGuide';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

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
      <AccessibilityProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/learn-more" component={LearnMore} />
            <Route path="/sign-language-guide" component={SignLanguageGuide} />
            <Route path="/auth" component={AuthPage} />
            
            {/* Protected Routes */}
            <Route path="/dashboard">
              <ProtectedRoute component={MainApp} />
            </Route>
            
            {/* Fallback */}
            <Route component={LandingPage} />
          </Switch>
        </div>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
