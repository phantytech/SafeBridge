import { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Users, 
  Shield, 
  MapPin, 
  Battery, 
  Activity, 
  Phone,
  Bell,
  Share2,
  Eye,
  Link,
  Unlink,
  CheckCircle2,
  Copy,
  QrCode,
  User
} from 'lucide-react';

interface LinkedCaregiver {
  id: string;
  name: string;
  email: string;
  relationship: string;
  permissions: {
    viewLocation: boolean;
    viewActivity: boolean;
    receiveAlerts: boolean;
    manageSettings: boolean;
  };
  linkedAt: Date;
  lastActive: Date;
}

const CaregiverMode = () => {
  const { settings } = useAccessibility();
  const [isCaregiverModeEnabled, setIsCaregiverModeEnabled] = useState(false);
  const [linkCode, setLinkCode] = useState('');
  const [showLinkSuccess, setShowLinkSuccess] = useState(false);
  const [caregivers, setCaregivers] = useState<LinkedCaregiver[]>([
    {
      id: '1',
      name: 'Fatima Rahman',
      email: 'fatima.r@email.com',
      relationship: 'Mother',
      permissions: {
        viewLocation: true,
        viewActivity: true,
        receiveAlerts: true,
        manageSettings: false
      },
      linkedAt: new Date('2024-01-15'),
      lastActive: new Date()
    }
  ]);

  const generateLinkCode = () => {
    const code = 'SB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setLinkCode(code);
  };

  const copyLinkCode = () => {
    navigator.clipboard.writeText(linkCode);
    setShowLinkSuccess(true);
    setTimeout(() => setShowLinkSuccess(false), 2000);
  };

  const updatePermission = (caregiverId: string, permission: keyof LinkedCaregiver['permissions']) => {
    setCaregivers(prev => prev.map(cg => 
      cg.id === caregiverId 
        ? { ...cg, permissions: { ...cg.permissions, [permission]: !cg.permissions[permission] } }
        : cg
    ));
  };

  const unlinkCaregiver = (caregiverId: string) => {
    setCaregivers(prev => prev.filter(cg => cg.id !== caregiverId));
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl">Caregiver Mode</h2>
              <p className="text-indigo-100 mt-1">Share your dashboard with trusted helpers</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Share2 size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Enable Caregiver Access</h4>
                <p className="text-sm text-slate-500">Allow trusted people to view your status and help manage settings</p>
              </div>
            </div>
            <button
              data-testid="toggle-caregiver-mode"
              onClick={() => setIsCaregiverModeEnabled(!isCaregiverModeEnabled)}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                isCaregiverModeEnabled ? 'bg-indigo-500' : 'bg-slate-300'
              }`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                isCaregiverModeEnabled ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {isCaregiverModeEnabled && (
        <>
          {/* Link New Caregiver */}
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <Link size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-800">Link New Caregiver</h3>
                <p className="text-sm text-slate-500">Generate a code to share with your caregiver</p>
              </div>
            </div>

            {!linkCode ? (
              <button
                data-testid="button-generate-link-code"
                onClick={generateLinkCode}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors"
              >
                <QrCode size={20} />
                Generate Link Code
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-indigo-500 font-medium mb-1">Your Link Code</p>
                    <p className="text-2xl font-mono font-bold text-indigo-700" data-testid="text-link-code">{linkCode}</p>
                  </div>
                  <button
                    data-testid="button-copy-code"
                    onClick={copyLinkCode}
                    className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
                  >
                    <Copy size={20} />
                  </button>
                </div>
                {showLinkSuccess && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 size={16} />
                    Code copied to clipboard!
                  </div>
                )}
                <p className="text-sm text-slate-500 text-center">
                  Share this code with your caregiver. It expires in 24 hours.
                </p>
              </div>
            )}
          </div>

          {/* Linked Caregivers */}
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-800">Linked Caregivers</h3>
                  <p className="text-sm text-slate-500">{caregivers.length} caregiver(s) connected</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {caregivers.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No caregivers linked yet</p>
                </div>
              ) : (
                caregivers.map((caregiver) => (
                  <div key={caregiver.id} className="p-6" data-testid={`caregiver-${caregiver.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                          <User size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{caregiver.name}</h4>
                          <p className="text-sm text-slate-500">{caregiver.relationship}</p>
                          <p className="text-xs text-slate-400">{caregiver.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Active
                        </span>
                        <button
                          data-testid={`button-unlink-${caregiver.id}`}
                          onClick={() => unlinkCaregiver(caregiver.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Unlink caregiver"
                        >
                          <Unlink size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="grid grid-cols-2 gap-3">
                      <PermissionToggle
                        label="View Location"
                        icon={MapPin}
                        enabled={caregiver.permissions.viewLocation}
                        onChange={() => updatePermission(caregiver.id, 'viewLocation')}
                        testId={`permission-location-${caregiver.id}`}
                      />
                      <PermissionToggle
                        label="View Activity"
                        icon={Activity}
                        enabled={caregiver.permissions.viewActivity}
                        onChange={() => updatePermission(caregiver.id, 'viewActivity')}
                        testId={`permission-activity-${caregiver.id}`}
                      />
                      <PermissionToggle
                        label="Emergency Alerts"
                        icon={Bell}
                        enabled={caregiver.permissions.receiveAlerts}
                        onChange={() => updatePermission(caregiver.id, 'receiveAlerts')}
                        testId={`permission-alerts-${caregiver.id}`}
                      />
                      <PermissionToggle
                        label="Manage Settings"
                        icon={Shield}
                        enabled={caregiver.permissions.manageSettings}
                        onChange={() => updatePermission(caregiver.id, 'manageSettings')}
                        testId={`permission-settings-${caregiver.id}`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Current Status Card */}
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Eye size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-800">What Caregivers See</h3>
                <p className="text-sm text-slate-500">Preview of shared information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <MapPin size={16} />
                  <span className="text-xs font-medium">Location</span>
                </div>
                <p className="font-medium text-slate-800">Dhaka, Bangladesh</p>
                <p className="text-xs text-slate-400">Updated just now</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Battery size={16} />
                  <span className="text-xs font-medium">Battery</span>
                </div>
                <p className="font-medium text-slate-800">85%</p>
                <p className="text-xs text-slate-400">Charging</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Shield size={16} />
                  <span className="text-xs font-medium">Status</span>
                </div>
                <p className="font-medium text-green-600">Safe</p>
                <p className="text-xs text-slate-400">No alerts</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Permission Toggle Component
const PermissionToggle = ({ 
  label, 
  icon: Icon, 
  enabled, 
  onChange,
  testId
}: { 
  label: string; 
  icon: typeof MapPin; 
  enabled: boolean; 
  onChange: () => void;
  testId: string;
}) => (
  <button
    data-testid={testId}
    onClick={onChange}
    className={`flex items-center gap-2 p-3 rounded-xl transition-colors ${
      enabled 
        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
        : 'bg-slate-50 text-slate-500 border border-slate-200'
    }`}
  >
    <Icon size={16} />
    <span className="text-sm font-medium">{label}</span>
    <div className={`ml-auto w-4 h-4 rounded-full ${enabled ? 'bg-blue-500' : 'bg-slate-300'}`} />
  </button>
);

export default CaregiverMode;
