import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_ALERTS } from '../lib/mockData';
import { MapPin, Phone, AlertTriangle, CheckCircle } from 'lucide-react';

export const PoliceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
          <h3 className="text-red-800 font-bold mb-1">Active SOS</h3>
          <p className="text-4xl font-display font-bold text-red-600">3</p>
        </div>
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl">
          <h3 className="text-green-800 font-bold mb-1">Resolved Today</h3>
          <p className="text-4xl font-display font-bold text-green-600">12</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <h3 className="text-blue-800 font-bold mb-1">Units Active</h3>
          <p className="text-4xl font-display font-bold text-blue-600">8</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-display font-bold text-xl text-slate-800">Live Emergency Feed</h2>
          <span className="flex items-center gap-2 text-xs font-bold text-red-500 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            LIVE UPDATES
          </span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {MOCK_ALERTS.map((alert) => (
            <div key={alert.id} className={`p-6 hover:bg-slate-50 transition-colors ${alert.status === 'active' ? 'bg-red-50/30' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.status === 'active' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {alert.status === 'active' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{alert.userName}</h3>
                    <div className="flex items-center gap-2 text-slate-500 mt-1">
                      <MapPin size={16} />
                      <span className="text-sm">{alert.location.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 mt-1">
                      <Phone size={16} />
                      <span className="text-sm font-mono">{alert.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${alert.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {alert.status}
                  </span>
                  <p className="text-xs text-slate-400">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {alert.status === 'active' && (
                <div className="mt-4 flex gap-3 pl-16">
                  <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    Dispatch Unit
                  </button>
                  <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    View on Map
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
