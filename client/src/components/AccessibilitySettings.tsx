import { useState } from 'react';
import { useAccessibility, EmergencyProfile, EmergencyContact } from '../context/AccessibilityContext';
import { 
  Eye, 
  Hand, 
  Brain, 
  Type, 
  Contrast,
  Mic,
  Target,
  Smartphone,
  Sparkles,
  Image,
  Volume2,
  RotateCcw,
  Shield,
  Phone,
  MapPin,
  Heart,
  Pill,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  CheckCircle2
} from 'lucide-react';

const AccessibilitySettings = () => {
  const { settings, updateSetting, updateEmergencyProfile, resetSettings } = useAccessibility();
  const [activeSection, setActiveSection] = useState<'visual' | 'motor' | 'cognitive' | 'emergency'>('visual');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Emergency Profile Form State
  const [emergencyForm, setEmergencyForm] = useState<EmergencyProfile>(
    settings.emergencyProfile || {
      fullName: '',
      bloodType: '',
      allergies: [],
      medicalConditions: [],
      medications: [],
      emergencyContacts: [{ name: '', phone: '', relationship: '' }],
      shareLocationEnabled: true,
      specialInstructions: ''
    }
  );
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const sections = [
    { id: 'visual' as const, label: 'Visual', icon: Eye, color: 'blue' },
    { id: 'motor' as const, label: 'Motor', icon: Hand, color: 'green' },
    { id: 'cognitive' as const, label: 'Cognitive', icon: Brain, color: 'purple' },
    { id: 'emergency' as const, label: 'Emergency Profile', icon: Shield, color: 'red' },
  ];

  const handleSaveEmergencyProfile = () => {
    updateEmergencyProfile(emergencyForm);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const addEmergencyContact = () => {
    setEmergencyForm(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relationship: '' }]
    }));
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    setEmergencyForm(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((c, i) => 
        i === index ? { ...c, [field]: value } : c
      )
    }));
  };

  const removeEmergencyContact = (index: number) => {
    setEmergencyForm(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const addToList = (field: 'allergies' | 'medicalConditions' | 'medications', value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setEmergencyForm(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeFromList = (field: 'allergies' | 'medicalConditions' | 'medications', index: number) => {
    setEmergencyForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    label, 
    description, 
    icon: Icon 
  }: { 
    enabled: boolean; 
    onChange: (v: boolean) => void; 
    label: string; 
    description: string; 
    icon: typeof Eye;
  }) => (
    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shadow-sm">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-800">{label}</h4>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        data-testid={`toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}
        onClick={() => onChange(!enabled)}
        className={`w-12 h-7 rounded-full transition-colors relative ${
          enabled ? 'bg-primary' : 'bg-slate-300'
        }`}
      >
        <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
          enabled ? 'left-6' : 'left-1'
        }`} />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-800">Accessibility Settings</h2>
            <p className="text-slate-500 mt-1">Customize SafeBridge for your needs</p>
          </div>
          <button
            data-testid="button-reset-accessibility"
            onClick={resetSettings}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <RotateCcw size={16} />
            <span className="text-sm font-medium">Reset All</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-slate-100 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            data-testid={`tab-${section.id}`}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeSection === section.id
                ? 'text-primary border-b-2 border-primary bg-blue-50/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <section.icon size={18} />
            {section.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Visual Settings */}
        {activeSection === 'visual' && (
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.highContrast}
              onChange={(v) => updateSetting('highContrast', v)}
              label="High Contrast Mode"
              description="Increase color contrast for better visibility"
              icon={Contrast}
            />
            <ToggleSwitch
              enabled={settings.largeText}
              onChange={(v) => updateSetting('largeText', v)}
              label="Large Text"
              description="Increase text size across the app"
              icon={Type}
            />
            <ToggleSwitch
              enabled={settings.screenReaderMode}
              onChange={(v) => updateSetting('screenReaderMode', v)}
              label="Screen Reader Optimization"
              description="Optimize interface for screen readers"
              icon={Volume2}
            />
            <ToggleSwitch
              enabled={settings.reduceMotion}
              onChange={(v) => updateSetting('reduceMotion', v)}
              label="Reduce Motion"
              description="Minimize animations and transitions"
              icon={Sparkles}
            />
            
            {/* Text Size Slider */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shadow-sm">
                  <Type size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Text Size</h4>
                  <p className="text-sm text-slate-500">Adjust text size multiplier</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">A</span>
                <input
                  data-testid="slider-text-size"
                  type="range"
                  min="1"
                  max="2"
                  step="0.25"
                  value={settings.textSizeMultiplier}
                  onChange={(e) => updateSetting('textSizeMultiplier', parseFloat(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-lg font-bold text-slate-700">A</span>
                <span className="text-sm font-medium text-slate-600 w-12 text-right">
                  {settings.textSizeMultiplier}x
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Motor Settings */}
        {activeSection === 'motor' && (
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.voiceControlEnabled}
              onChange={(v) => updateSetting('voiceControlEnabled', v)}
              label="Voice Control"
              description="Control the app with voice commands"
              icon={Mic}
            />
            <ToggleSwitch
              enabled={settings.largeTouchTargets}
              onChange={(v) => updateSetting('largeTouchTargets', v)}
              label="Large Touch Targets"
              description="Make buttons and controls bigger for easier tapping"
              icon={Target}
            />
            <ToggleSwitch
              enabled={settings.oneHandedMode}
              onChange={(v) => updateSetting('oneHandedMode', v)}
              label="One-Handed Mode"
              description="Optimize layout for single-hand operation"
              icon={Smartphone}
            />
          </div>
        )}

        {/* Cognitive Settings */}
        {activeSection === 'cognitive' && (
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.simplifiedMode}
              onChange={(v) => updateSetting('simplifiedMode', v)}
              label="Simplified Mode"
              description="Show only essential features with clearer labels"
              icon={Sparkles}
            />
            <ToggleSwitch
              enabled={settings.pictureNavigation}
              onChange={(v) => updateSetting('pictureNavigation', v)}
              label="Picture Navigation"
              description="Use icons and images instead of text labels"
              icon={Image}
            />
          </div>
        )}

        {/* Emergency Profile */}
        {activeSection === 'emergency' && (
          <div className="space-y-6">
            {showSaveSuccess && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                <CheckCircle2 size={20} />
                <span className="font-medium">Emergency profile saved successfully!</span>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  data-testid="input-emergency-name"
                  type="text"
                  value={emergencyForm.fullName}
                  onChange={(e) => setEmergencyForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Blood Type</label>
                <select
                  data-testid="select-blood-type"
                  value={emergencyForm.bloodType}
                  onChange={(e) => setEmergencyForm(prev => ({ ...prev, bloodType: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <AlertTriangle size={16} className="text-orange-500" />
                Allergies
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  data-testid="input-add-allergy"
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToList('allergies', newAllergy, setNewAllergy)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Add allergy (e.g., Penicillin)"
                />
                <button
                  data-testid="button-add-allergy"
                  onClick={() => addToList('allergies', newAllergy, setNewAllergy)}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {emergencyForm.allergies.map((allergy, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {allergy}
                    <button onClick={() => removeFromList('allergies', i)} className="ml-1 hover:text-orange-900">
                      <Trash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Heart size={16} className="text-red-500" />
                Medical Conditions
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  data-testid="input-add-condition"
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToList('medicalConditions', newCondition, setNewCondition)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Add condition (e.g., Diabetes)"
                />
                <button
                  data-testid="button-add-condition"
                  onClick={() => addToList('medicalConditions', newCondition, setNewCondition)}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {emergencyForm.medicalConditions.map((condition, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {condition}
                    <button onClick={() => removeFromList('medicalConditions', i)} className="ml-1 hover:text-red-900">
                      <Trash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Pill size={16} className="text-blue-500" />
                Current Medications
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  data-testid="input-add-medication"
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToList('medications', newMedication, setNewMedication)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Add medication"
                />
                <button
                  data-testid="button-add-medication"
                  onClick={() => addToList('medications', newMedication, setNewMedication)}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {emergencyForm.medications.map((med, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {med}
                    <button onClick={() => removeFromList('medications', i)} className="ml-1 hover:text-blue-900">
                      <Trash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Phone size={16} className="text-green-500" />
                Emergency Contacts
              </label>
              <div className="space-y-3">
                {emergencyForm.emergencyContacts.map((contact, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <input
                        data-testid={`input-contact-name-${i}`}
                        type="text"
                        value={contact.name}
                        onChange={(e) => updateEmergencyContact(i, 'name', e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-sm"
                        placeholder="Name"
                      />
                      <input
                        data-testid={`input-contact-phone-${i}`}
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => updateEmergencyContact(i, 'phone', e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-sm"
                        placeholder="Phone"
                      />
                      <input
                        data-testid={`input-contact-relationship-${i}`}
                        type="text"
                        value={contact.relationship}
                        onChange={(e) => updateEmergencyContact(i, 'relationship', e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-sm"
                        placeholder="Relationship"
                      />
                    </div>
                    {emergencyForm.emergencyContacts.length > 1 && (
                      <button
                        onClick={() => removeEmergencyContact(i)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  data-testid="button-add-contact"
                  onClick={addEmergencyContact}
                  className="flex items-center gap-2 text-primary font-medium hover:text-blue-600"
                >
                  <Plus size={18} />
                  Add another contact
                </button>
              </div>
            </div>

            {/* Location Sharing */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Share Location in Emergencies</h4>
                  <p className="text-sm text-slate-500">Automatically share your GPS location when SOS is triggered</p>
                </div>
              </div>
              <button
                data-testid="toggle-location-sharing"
                onClick={() => setEmergencyForm(prev => ({ ...prev, shareLocationEnabled: !prev.shareLocationEnabled }))}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  emergencyForm.shareLocationEnabled ? 'bg-green-500' : 'bg-slate-300'
                }`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  emergencyForm.shareLocationEnabled ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Special Instructions for Responders</label>
              <textarea
                data-testid="textarea-special-instructions"
                value={emergencyForm.specialInstructions}
                onChange={(e) => setEmergencyForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows={3}
                placeholder="Any special instructions for emergency responders (e.g., 'I am deaf and communicate through sign language')"
              />
            </div>

            {/* Save Button */}
            <button
              data-testid="button-save-emergency-profile"
              onClick={handleSaveEmergencyProfile}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
              <Save size={20} />
              Save Emergency Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilitySettings;
