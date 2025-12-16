import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Users, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'user' | 'parent' | 'police'>('user');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  const { login, signup } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, role);
    } else {
      signup(name, email, role);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden">
        <div className="p-8 bg-white">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="SafeBridge" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900">
              {isLogin ? 'Welcome Back' : 'Join SafeBridge'}
            </h2>
            <p className="text-slate-500 mt-2">
              {isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started'}
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2 mb-8 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${role === 'user' ? 'bg-white shadow-sm text-primary ring-1 ring-primary/10' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <User size={20} className="mb-1" />
              <span className="text-xs font-bold">User</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('parent')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${role === 'parent' ? 'bg-white shadow-sm text-primary ring-1 ring-primary/10' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Users size={20} className="mb-1" />
              <span className="text-xs font-bold">Parent</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('police')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${role === 'police' ? 'bg-white shadow-sm text-primary ring-1 ring-primary/10' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Shield size={20} className="mb-1" />
              <span className="text-xs font-bold">Police</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mt-6"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-500 hover:text-primary font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
