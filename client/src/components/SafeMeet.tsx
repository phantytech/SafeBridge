import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, ArrowLeft, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'wouter';
import { apiRequest } from '../lib/queryClient';
import { motion } from 'framer-motion';
import type { Meeting } from '@shared/schema';

interface SafeMeetProps {
  meetCode?: string;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

const SafeMeet: React.FC<SafeMeetProps> = ({ meetCode: initialMeetCode }) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(true);
  const [meetCode, setMeetCode] = useState<string | null>(initialMeetCode || null);
  const [inputCode, setInputCode] = useState('');
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [copied, setCopied] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnected, setPeerConnected] = useState(false);
  
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remotePeerIdRef = useRef<string | null>(null);

  // Initialize local media stream
  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      // Start with mic muted
      stream.getAudioTracks().forEach(track => track.enabled = false);
      return stream;
    } catch (err) {
      console.error('Failed to get local stream:', err);
      setError('Camera/microphone access denied. Please allow access.');
      return null;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback((stream: MediaStream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    
    // Add local tracks to peer connection
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Handle incoming tracks (remote stream)
    pc.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
        setPeerConnected(true);
        setConnectionStatus('Connected');
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN && remotePeerIdRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          targetUserId: remotePeerIdRef.current,
          candidate: event.candidate
        }));
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setConnectionStatus('Connected');
        setPeerConnected(true);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionStatus('Disconnected');
        setPeerConnected(false);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, []);

  // Handle creating an offer (initiator)
  const createOffer = useCallback(async (targetUserId: string) => {
    if (!peerConnectionRef.current) return;
    remotePeerIdRef.current = targetUserId;
    
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      wsRef.current?.send(JSON.stringify({
        type: 'offer',
        targetUserId,
        sdp: offer
      }));
    } catch (err) {
      console.error('Failed to create offer:', err);
    }
  }, []);

  // Handle receiving an offer
  const handleOffer = useCallback(async (fromUserId: string, sdp: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    remotePeerIdRef.current = fromUserId;
    
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      wsRef.current?.send(JSON.stringify({
        type: 'answer',
        targetUserId: fromUserId,
        sdp: answer
      }));
    } catch (err) {
      console.error('Failed to handle offer:', err);
    }
  }, []);

  // Handle receiving an answer
  const handleAnswer = useCallback(async (sdp: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    } catch (err) {
      console.error('Failed to handle answer:', err);
    }
  }, []);

  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error('Failed to add ICE candidate:', err);
    }
  }, []);

  // Connect to signaling server
  const connectSignaling = useCallback(async (code: string) => {
    if (!user) return;
    
    const stream = await initLocalStream();
    if (!stream) return;
    
    createPeerConnection(stream);
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/signaling`);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log('Signaling connected');
      setConnectionStatus('Waiting for peer...');
      ws.send(JSON.stringify({
        type: 'join',
        meetCode: code,
        userId: user.id
      }));
    };
    
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'joined':
          console.log('Joined room:', message.meetCode, 'Existing peers:', message.existingPeers);
          // If there are existing peers, create offer to connect
          if (message.existingPeers && message.existingPeers.length > 0) {
            await createOffer(message.existingPeers[0]);
          }
          break;
          
        case 'user-joined':
          console.log('User joined:', message.userId);
          setConnectionStatus('Peer joined, connecting...');
          // New user joined, they will send us an offer
          remotePeerIdRef.current = message.userId;
          break;
          
        case 'offer':
          console.log('Received offer from:', message.fromUserId);
          await handleOffer(message.fromUserId, message.sdp);
          break;
          
        case 'answer':
          console.log('Received answer');
          await handleAnswer(message.sdp);
          break;
          
        case 'ice-candidate':
          await handleIceCandidate(message.candidate);
          break;
          
        case 'user-left':
          console.log('User left:', message.userId);
          setPeerConnected(false);
          setRemoteStream(null);
          setConnectionStatus('Peer disconnected');
          remotePeerIdRef.current = null;
          break;
          
        case 'error':
          setError(message.message);
          break;
      }
    };
    
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setConnectionStatus('Connection error');
    };
    
    ws.onclose = () => {
      console.log('WebSocket closed');
      setConnectionStatus('Disconnected');
    };
  }, [user, initLocalStream, createPeerConnection, createOffer, handleOffer, handleAnswer, handleIceCandidate]);

  // Load existing meet if meetCode provided
  useEffect(() => {
    if (initialMeetCode && !meeting && user) {
      loadMeet(initialMeetCode);
    }
  }, [initialMeetCode, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'leave' }));
          wsRef.current.close();
        }
      } catch (err) {
        console.warn('WebSocket cleanup error:', err);
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  const loadMeet = async (code: string) => {
    try {
      const res = await apiRequest('GET', `/api/meets/${code}`);
      const data = await res.json();
      if (data.error) {
        setError('Meet not found');
        return;
      }
      setMeeting(data);
      setMeetCode(code);
      
      // Connect to signaling server
      await connectSignaling(code);
      
      // Auto-join if not the creator
      if (user && data.createdByUserId !== user.id) {
        await joinMeetApi(code);
      }
    } catch (error) {
      setError('Failed to load meet');
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
      
      // Connect to signaling server
      await connectSignaling(data.meetCode);
      
      navigate(`/meet/${data.meetCode}`);
    } catch (error) {
      console.error('Failed to create meet:', error);
    }
  };

  const joinMeetApi = async (code: string) => {
    if (!user) return;
    try {
      const res = await apiRequest('POST', `/api/meets/${code}/join`, {
        userId: user.id,
        userName: user.name
      });
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 409) {
          setError('This meeting is full. Only 1 participant can join per meeting.');
          return;
        }
        setError(data.error || 'Failed to join meet');
        return;
      }
      const data = await res.json();
      setMeeting(data);
      setError(null);
    } catch (error) {
      setError('Failed to join meet');
      console.error('Failed to join meet:', error);
    }
  };

  const handleJoinMeet = async () => {
    if (!inputCode) return;
    setMeetCode(inputCode.toLowerCase());
    await loadMeet(inputCode.toLowerCase());
    navigate(`/meet/${inputCode.toLowerCase()}`);
  };

  const endMeet = async () => {
    // Cleanup WebRTC
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'leave' }));
        wsRef.current.close();
      }
    } catch (err) {
      console.warn('WebSocket cleanup error:', err);
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (meeting) {
      try {
        await apiRequest('PATCH', `/api/meets/${meeting.id}/end`);
      } catch (error) {
        console.error('Failed to end meet:', error);
      }
    }
    
    setMeetCode(null);
    setMeeting(null);
    setRemoteStream(null);
    setLocalStream(null);
    setPeerConnected(false);
    navigate('/dashboard');
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCamOn(!isCamOn);
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
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          
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
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toLowerCase())}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500"
                data-testid="input-meet-code"
              />
              <button
                onClick={handleJoinMeet}
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
        {/* Local Video */}
        <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          {localStream && isCamOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-lg text-white text-sm font-medium">
            You {isMicOn ? '' : '(muted)'}
          </div>
        </div>

        {/* Remote Video */}
        <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          {peerConnected && remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  ?
                </div>
                <p className="text-white text-sm">{connectionStatus}</p>
                <p className="text-slate-400 text-xs mt-2">Share the link to invite someone</p>
              </div>
            </div>
          )}
          {peerConnected && (
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-lg text-white text-sm font-medium">
              Remote User
            </div>
          )}
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
            onClick={toggleMic}
            className={`p-4 rounded-full transition-colors ${isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
            data-testid="button-toggle-mic"
          >
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            onClick={toggleCamera}
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
            <Users size={20} />
          </button>

          <button
            onClick={endMeet}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors ml-4"
            data-testid="button-end-meet"
          >
            <PhoneOff size={20} />
          </button>
        </div>

        <div className="w-32 text-right">
          <span className={`text-xs ${peerConnected ? 'text-green-400' : 'text-slate-400'}`}>
            {connectionStatus}
          </span>
        </div>
      </div>

      {/* Participants Panel */}
      {showParticipants && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          className="absolute right-0 top-0 bottom-0 w-64 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto"
        >
          <h3 className="text-white font-bold mb-4">Participants ({peerConnected ? 2 : 1})</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-700 rounded-lg text-white text-sm">
              <p className="font-bold">{user?.name}</p>
              <p className="text-xs text-slate-400">You</p>
            </div>
            {peerConnected && (
              <div className="p-3 bg-slate-700 rounded-lg text-white text-sm">
                <p className="font-bold">Remote User</p>
                <p className="text-xs text-green-400">Connected</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SafeMeet;
