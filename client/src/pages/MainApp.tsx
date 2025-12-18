import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2, MapPin, Phone, User, AlertCircle } from 'lucide-react';
import type { Settings } from '@shared/schema';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [settings, setSettings] = useState<Settings>({
    phoneNumber: '',
    location: '',
    contactDetails: '',
    parentInfo: {
      name: '',
      email: '',
      phone: '',
    },
    emergencyContact: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/settings/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setSettings({
            phoneNumber: data.phoneNumber || '',
            location: data.location || '',
            contactDetails: data.contactDetails || '',
            parentInfo: data.parentInfo || { name: '', email: '', phone: '' },
            emergencyContact: data.emergencyContact || '',
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setFetching(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/settings/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      
      toast({
        title: 'Success',
        description: 'Your settings have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Personal Settings</h2>
        <p className="text-sm text-slate-500">Manage your profile and contact information</p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </label>
          <Input
            data-testid="input-phone"
            type="tel"
            value={settings.phoneNumber}
            onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
            placeholder="Your phone number"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </label>
          <Input
            data-testid="input-location"
            value={settings.location}
            onChange={(e) => setSettings({ ...settings, location: e.target.value })}
            placeholder="Your location (e.g., Dhaka, Bangladesh)"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contact Details
          </label>
          <Textarea
            data-testid="input-contact"
            value={settings.contactDetails}
            onChange={(e) => setSettings({ ...settings, contactDetails: e.target.value })}
            placeholder="Additional contact information"
            className="w-full min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Emergency Contact
          </label>
          <Input
            data-testid="input-emergency"
            value={settings.emergencyContact}
            onChange={(e) => setSettings({ ...settings, emergencyContact: e.target.value })}
            placeholder="Emergency contact person or number"
            className="w-full"
          />
        </div>
      </Card>

      <Card className="p-6 space-y-4 border-slate-200 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          Parent/Caregiver Information
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Name
          </label>
          <Input
            data-testid="input-parent-name"
            value={settings.parentInfo?.name || ''}
            onChange={(e) => setSettings({
              ...settings,
              parentInfo: { ...settings.parentInfo, name: e.target.value },
            })}
            placeholder="Parent or caregiver name"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <Input
            data-testid="input-parent-email"
            type="email"
            value={settings.parentInfo?.email || ''}
            onChange={(e) => setSettings({
              ...settings,
              parentInfo: { ...settings.parentInfo, email: e.target.value },
            })}
            placeholder="Parent or caregiver email"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone
          </label>
          <Input
            data-testid="input-parent-phone"
            type="tel"
            value={settings.parentInfo?.phone || ''}
            onChange={(e) => setSettings({
              ...settings,
              parentInfo: { ...settings.parentInfo, phone: e.target.value },
            })}
            placeholder="Parent or caregiver phone"
            className="w-full"
          />
        </div>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button
          data-testid="button-save-settings"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
