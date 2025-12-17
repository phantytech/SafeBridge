import { useState, useEffect, useCallback } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

interface VoiceCommandSystemProps {
  onNavigate: (tab: string) => void;
  onEmergency: () => void;
}

const VoiceCommandSystem = ({ onNavigate, onEmergency }: VoiceCommandSystemProps) => {
  const { settings } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(''), 3000);
  }, []);

  const processCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Emergency commands
    if (lowerCommand.includes('emergency') || lowerCommand.includes('help') || lowerCommand.includes('999') || lowerCommand.includes('sos')) {
      onEmergency();
      showFeedback('Activating emergency mode...');
      return;
    }
    
    // Navigation commands
    if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      onNavigate('app');
      showFeedback('Going to Dashboard');
      return;
    }
    
    if (lowerCommand.includes('meet') || lowerCommand.includes('video') || lowerCommand.includes('call')) {
      onNavigate('meet');
      showFeedback('Opening SafeMeet');
      return;
    }
    
    if (lowerCommand.includes('accessibility') || lowerCommand.includes('accessible')) {
      onNavigate('accessibility');
      showFeedback('Opening Accessibility Settings');
      return;
    }
    
    if (lowerCommand.includes('caregiver') || lowerCommand.includes('helper') || lowerCommand.includes('assistant')) {
      onNavigate('caregiver');
      showFeedback('Opening Caregiver Mode');
      return;
    }
    
    if (lowerCommand.includes('settings') || lowerCommand.includes('options') || lowerCommand.includes('preferences')) {
      onNavigate('settings');
      showFeedback('Opening Settings');
      return;
    }
    
    // Accessibility commands
    if (lowerCommand.includes('contrast')) {
      showFeedback('Toggle high contrast in settings');
      return;
    }
    
    if (lowerCommand.includes('bigger') || lowerCommand.includes('larger')) {
      showFeedback('Increase text size in accessibility settings');
      return;
    }
    
    showFeedback(`Command not recognized: "${command}"`);
  }, [onNavigate, onEmergency, showFeedback]);

  useEffect(() => {
    if (!settings.voiceControlEnabled) {
      if (recognition) {
        recognition.stop();
      }
      setIsListening(false);
      return;
    }

    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptResult = event.results[current][0].transcript;
      setTranscript(transcriptResult);
      
      if (event.results[current].isFinal) {
        processCommand(transcriptResult);
        setTranscript('');
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        showFeedback('Microphone access denied. Please enable in browser settings.');
      }
    };

    recognitionInstance.onend = () => {
      if (settings.voiceControlEnabled && isListening) {
        try {
          recognitionInstance.start();
        } catch (e) {
          // Already started
        }
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
    };
  }, [settings.voiceControlEnabled, isListening, processCommand, showFeedback]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      showFeedback('Voice control paused');
    } else {
      try {
        recognition.start();
        setIsListening(true);
        showFeedback('Listening for commands...');
      } catch (e) {
        showFeedback('Could not start voice recognition');
      }
    }
  };

  if (!settings.voiceControlEnabled) return null;

  if (!isSupported) {
    return (
      <div className="fixed top-24 right-6 z-50 bg-orange-100 text-orange-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <span className="text-sm font-medium">Voice control not supported in this browser</span>
      </div>
    );
  }

  return (
    <>
      {/* Voice Control Button */}
      <button
        data-testid="button-voice-control"
        onClick={toggleListening}
        className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all ${
          isListening 
            ? 'bg-primary text-white animate-pulse' 
            : 'bg-white text-slate-600 hover:bg-slate-50'
        }`}
      >
        {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        <span className="font-medium text-sm">
          {isListening ? 'Listening...' : 'Voice Off'}
        </span>
      </button>

      {/* Transcript Display */}
      {transcript && (
        <div className="fixed top-40 right-6 z-50 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-lg max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <Volume2 size={16} />
            <span className="text-xs text-slate-300">Hearing:</span>
          </div>
          <p className="text-sm">{transcript}</p>
        </div>
      )}

      {/* Feedback Display */}
      {feedback && (
        <div className="fixed top-40 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg max-w-xs">
          <p className="text-sm font-medium">{feedback}</p>
        </div>
      )}
    </>
  );
};

export default VoiceCommandSystem;
