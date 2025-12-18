import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MapPin, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import type { EmergencyAlert } from '@shared/schema';

export const PoliceDashboard: React.FC = () => {
  const { data: alerts = [], isLoading, refetch } = useQuery<EmergencyAlert[]>({
    queryKey: ['/api/emergency/alerts'],
  });

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  const resolveMutation = useMutation({
    mutationFn: (alertId: string) => apiRequest('PATCH', `/api/emergency/alert/${alertId}/resolve`),
    onSuccess: () => refetch()
  });

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
          <h3 className="text-red-800 font-bold mb-1">Active SOS</h3>
          <p className="text-4xl font-display font-bold text-red-600" data-testid="stat-active-sos">{activeAlerts.length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl">
          <h3 className="text-green-800 font-bold mb-1">Resolved Today</h3>
          <p className="text-4xl font-display font-bold text-green-600" data-testid="stat-resolved-today">{resolvedAlerts.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <h3 className="text-blue-800 font-bold mb-1">Total Alerts</h3>
          <p className="text-4xl font-display font-bold text-blue-600" data-testid="stat-total-alerts">{alerts.length}</p>
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
          {isLoading ? (
            <div className="p-6 text-center text-slate-500">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No emergency alerts</div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`p-6 hover:bg-slate-50 transition-colors ${alert.status === 'active' ? 'bg-red-50/30' : ''}`} data-testid={`alert-${alert.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.status === 'active' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {alert.status === 'active' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg" data-testid={`alert-name-${alert.id}`}>{alert.userName}</h3>
                      {alert.address && (
                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                          <MapPin size={16} />
                          <span className="text-sm" data-testid={`alert-location-${alert.id}`}>{alert.address}</span>
                        </div>
                      )}
                      {alert.userPhone && (
                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                          <Phone size={16} />
                          <span className="text-sm font-mono" data-testid={`alert-phone-${alert.id}`}>{alert.userPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${alert.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {alert.status}
                    </span>
                    <p className="text-xs text-slate-400">
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {alert.status === 'active' && (
                  <div className="mt-4 flex gap-3 pl-16">
                    <button 
                      onClick={() => resolveMutation.mutate(alert.id)}
                      disabled={resolveMutation.isPending}
                      className="bg-primary hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                      data-testid={`button-resolve-${alert.id}`}
                    >
                      {resolveMutation.isPending ? 'Resolving...' : 'Resolve'}
                    </button>
                    <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                      View on Map
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
