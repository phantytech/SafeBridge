import React from 'react';
import { MOCK_USERS } from '../lib/mockData';
import { User, MapPin, Battery, Activity, Phone } from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const child = MOCK_USERS.find(u => u.id === 'u1');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
        <h2 className="font-display font-bold text-xl text-slate-800 mb-6">Family Monitor</h2>
        
        {child && (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">{child.name}</h3>
                  <p className="text-slate-500 text-sm">Last update: Just now</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Safe</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                  <p className="text-sm font-medium text-slate-800">Home (Dhaka)</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <Battery size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Battery</p>
                  <p className="text-sm font-medium text-slate-800">85%</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                  <p className="text-sm font-medium text-slate-800">Active</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-medium transition-colors text-left px-4 flex justify-between items-center">
              Call Child
              <Phone size={16} />
            </button>
            <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-medium transition-colors text-left px-4 flex justify-between items-center">
              Request Location
              <MapPin size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
