import { useAccessibility } from '../context/AccessibilityContext';
import { 
  User, 
  Droplets, 
  AlertTriangle, 
  Heart, 
  Pill, 
  Phone, 
  MapPin,
  FileText,
  Shield,
  ExternalLink
} from 'lucide-react';

const EmergencyProfileCard = () => {
  const { settings } = useAccessibility();
  const profile = settings.emergencyProfile;

  if (!profile || !profile.fullName) {
    return (
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800">Emergency Profile</h3>
            <p className="text-sm text-slate-500">Not configured yet</p>
          </div>
        </div>
        <p className="text-slate-500 text-sm mb-4">
          Set up your emergency profile so first responders can quickly access your medical information during emergencies.
        </p>
        <a 
          href="#settings" 
          className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:text-blue-600"
        >
          Configure in Settings
          <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Emergency Profile</h3>
            <p className="text-red-100 text-sm">Quick access for first responders</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Basic Info */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-800" data-testid="text-profile-name">{profile.fullName}</p>
            {profile.bloodType && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <Droplets size={14} />
                <span data-testid="text-blood-type">Blood Type: {profile.bloodType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Allergies */}
        {profile.allergies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <AlertTriangle size={16} />
              <span className="font-bold text-sm">ALLERGIES</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, i) => (
                <span 
                  key={i} 
                  data-testid={`badge-allergy-${i}`}
                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-sm font-medium"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Medical Conditions */}
        {profile.medicalConditions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <Heart size={16} />
              <span className="font-bold text-sm">CONDITIONS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.medicalConditions.map((condition, i) => (
                <span 
                  key={i}
                  data-testid={`badge-condition-${i}`}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Medications */}
        {profile.medications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Pill size={16} />
              <span className="font-bold text-sm">MEDICATIONS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.medications.map((med, i) => (
                <span 
                  key={i}
                  data-testid={`badge-medication-${i}`}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
                >
                  {med}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        {profile.emergencyContacts.length > 0 && profile.emergencyContacts[0].name && (
          <div>
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Phone size={16} />
              <span className="font-bold text-sm">EMERGENCY CONTACTS</span>
            </div>
            <div className="space-y-2">
              {profile.emergencyContacts.filter(c => c.name).map((contact, i) => (
                <div 
                  key={i} 
                  data-testid={`contact-${i}`}
                  className="flex items-center justify-between bg-green-50 p-2 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{contact.name}</p>
                    <p className="text-xs text-slate-500">{contact.relationship}</p>
                  </div>
                  <a 
                    href={`tel:${contact.phone}`}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Sharing Status */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <MapPin size={16} className={profile.shareLocationEnabled ? 'text-green-500' : 'text-slate-400'} />
          <span className={`text-sm ${profile.shareLocationEnabled ? 'text-green-600' : 'text-slate-500'}`}>
            {profile.shareLocationEnabled ? 'Location sharing enabled' : 'Location sharing disabled'}
          </span>
        </div>

        {/* Special Instructions */}
        {profile.specialInstructions && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <FileText size={16} />
              <span className="font-bold text-sm">SPECIAL INSTRUCTIONS</span>
            </div>
            <p 
              data-testid="text-special-instructions"
              className="text-sm text-slate-600 bg-purple-50 p-3 rounded-lg"
            >
              {profile.specialInstructions}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyProfileCard;
