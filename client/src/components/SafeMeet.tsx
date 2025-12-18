import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, Share2, Captions, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'wouter';
import { apiRequest } from '../lib/queryClient';
import { motion } from 'framer-motion';
import type { Meeting } from '@shared/schema';

interface SafeMeetProps {
  meetCode?: string;
}

const SafeMeet: React.FC<SafeMeetProps> = ({ meetCode: initialMeetCode }) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(true);
  const [meetCode, setMeetCode] = useState<string | null>(initialMeetCode || null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [copied, setCopied] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Load existing meet if meetCode provided
  useEffect(() => {
    if (initialMeetCode && !meeting) {
      loadMeet(initialMeetCode);
    }
  }, [initialMeetCode]);

  const loadMeet = async (code: string) => {
    try {
      const res = await apiRequest('GET', `/api/meets/${code}`);
      const data = await res.json();
      if (data.error) {
        console.error('Meet not found');
        return;
      }
      setMeeting(data);
      // Auto-join if not the creator
      if (user && data.createdByUserId !== user.id) {
        await joinMeet(code);
      }
    } catch (error) {
      console.error('Failed to load meet:', error);
    }
  };

  const createMeet = async () => {
    if (!user) return;
    try {
      const res = await apiRequest('POST', '/api/meets', {
        createdByUserId: user.id,
        createdByName: user.name
      });
      const data = await res.json();
      setMeetCode(data.meetCode);
      setMeeting(data);
      // Navigate to meet URL
      navigate(`/meet/${data.meetCode}`);
    } catch (error) {
      console.error('Failed to create meet:', error);
    }
  };

  const joinMeet = async (code?: string) => {
    if (!user || !meetCode && !code) return;
    const codeToUse = code || meetCode;
    try {
      const res = await apiRequest('POST', `/api/meets/${codeToUse}/join`, {
        userId: user.id,
        userName: user.name
      });
      const data = await res.json();
      setMeeting(data);
      setMeetCode(codeToUse);
      // Navigate to meet URL if not already there
      if (!initialMeetCode) {
        navigate(`/meet/${codeToUse}`);
      }
    } catch (error) {
      console.error('Failed to join meet:', error);
    }
  };

  const endMeet = async () => {
    if (!meeting) return;
    try {
      await apiRequest('PATCH', `/api/meets/${meeting.id}/end`);
      setMeetCode(null);
      setMeeting(null);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to end meet:', error);
    }
  };

  const copyToClipboard = () => {
    if (meetCode) {
      const url = `${window.location.origin}/meet/${meetCode}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!meetCode) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Start SafeMeet</h2>
          <p className="text-slate-300 mb-8 max-w-md">Create a new meeting or join one with a code</p>
          
          <div className="space-y-4">
            <button
              onClick={createMeet}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              data-testid="button-create-meet"
            >
              Create New Meet
            </button>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter meet code..."
                value={meetCode || ''}
                onChange={(e) => setMeetCode(e.target.value.toLowerCase())}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500"
                data-testid="input-meet-code"
              />
              <button
                onClick={joinMeet}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                data-testid="button-join-meet"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 rounded-3xl overflow-hidden flex flex-col relative">
      {/* Video Grid */}
      <div className="flex-1 relative p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900">
        {/* User Video */}
        <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          {isCamOn ? (
            <Webcam className="w-full h-full object-cover" mirrored={true} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-lg text-white text-sm font-medium">
            You (Sign Language)
          </div>
        </div>

        {/* Remote Video Placeholder */}
        <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {meeting?.participants?.[0]?.name.charAt(0).toUpperCase() || '?'}
              </div>
              <p className="text-white text-sm">
                {meeting?.participants?.[0]?.name || 'Waiting for participants...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-20 bg-slate-800 border-t border-slate-700 flex items-center justify-between px-8">
        <div className="flex items-center gap-4 text-white">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft size={18} className="text-slate-300" />
          </button>
          <span className="font-bold">SafeMeet</span>
          <span className="text-slate-400 text-sm">Code: {meetCode?.toUpperCase()}</span>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            data-testid="button-copy-link"
            title="Copy meet link"
          >
            <Copy size={18} className={copied ? 'text-green-400' : 'text-slate-300'} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-full transition-colors ${isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
            data-testid="button-toggle-mic"
          >
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            onClick={() => setIsCamOn(!isCamOn)}
            className={`p-4 rounded-full transition-colors ${isCamOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
            data-testid="button-toggle-video"
          >
            {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors"
            data-testid="button-participants"
          >
            <span className="text-sm font-bold">{(meeting?.participants?.length || 0) + 1}</span>
          </button>

          <button
            onClick={endMeet}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors ml-4"
            data-testid="button-end-meet"
          >
            <PhoneOff size={20} />
          </button>
        </div>

        <div className="w-32"></div>
      </div>

      {/* Participants Panel */}
      {showParticipants && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          className="absolute right-0 top-0 bottom-0 w-64 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto"
        >
          <h3 className="text-white font-bold mb-4">Participants ({(meeting?.participants?.length || 0) + 1})</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-700 rounded-lg text-white text-sm">
              <p className="font-bold">{user?.name}</p>
              <p className="text-xs text-slate-400">You</p>
            </div>
            {meeting?.participants?.map((p, i) => (
              <div key={i} className="p-3 bg-slate-700 rounded-lg text-white text-sm">
                <p className="font-bold">{p.name}</p>
                <p className="text-xs text-slate-400">Joined {new Date(p.joinedAt).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SafeMeet;
