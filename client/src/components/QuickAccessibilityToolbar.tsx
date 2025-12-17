import { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Accessibility, 
  Type, 
  Contrast, 
  Mic, 
  X,
  Plus,
  Minus,
  Volume2,
  Eye
} from 'lucide-react';

const QuickAccessibilityToolbar = () => {
  const { settings, updateSetting, isToolbarVisible, setToolbarVisible } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isToolbarVisible) return null;

  const quickActions = [
    {
      id: 'text-increase',
      icon: Plus,
      label: 'Increase Text',
      action: () => {
        const newSize = Math.min(settings.textSizeMultiplier + 0.25, 2);
        updateSetting('textSizeMultiplier', newSize);
      },
      active: false
    },
    {
      id: 'text-decrease',
      icon: Minus,
      label: 'Decrease Text',
      action: () => {
        const newSize = Math.max(settings.textSizeMultiplier - 0.25, 1);
        updateSetting('textSizeMultiplier', newSize);
      },
      active: false
    },
    {
      id: 'contrast',
      icon: Contrast,
      label: 'High Contrast',
      action: () => updateSetting('highContrast', !settings.highContrast),
      active: settings.highContrast
    },
    {
      id: 'voice',
      icon: Mic,
      label: 'Voice Control',
      action: () => updateSetting('voiceControlEnabled', !settings.voiceControlEnabled),
      active: settings.voiceControlEnabled
    },
    {
      id: 'screen-reader',
      icon: Volume2,
      label: 'Screen Reader',
      action: () => updateSetting('screenReaderMode', !settings.screenReaderMode),
      active: settings.screenReaderMode
    },
    {
      id: 'simplified',
      icon: Eye,
      label: 'Simplified',
      action: () => updateSetting('simplifiedMode', !settings.simplifiedMode),
      active: settings.simplifiedMode
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Toolbar */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 mb-2 min-w-[200px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-sm">Quick Settings</span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {settings.textSizeMultiplier}x
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                data-testid={`quick-${action.id}`}
                onClick={action.action}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  action.active 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
                title={action.label}
              >
                <action.icon size={20} />
                <span className="text-[10px] font-medium text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <button
          data-testid="button-toggle-accessibility-toolbar"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            isExpanded 
              ? 'bg-primary text-white rotate-0' 
              : 'bg-white text-primary hover:bg-primary hover:text-white'
          }`}
        >
          <Accessibility size={24} />
        </button>
        
        {isToolbarVisible && (
          <button
            data-testid="button-close-accessibility-toolbar"
            onClick={() => {
              setToolbarVisible(false);
              setIsExpanded(false);
            }}
            className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors self-end"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickAccessibilityToolbar;
