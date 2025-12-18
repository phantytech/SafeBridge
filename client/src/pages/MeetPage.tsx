import React from 'react';
import { useLocation } from 'wouter';
import SafeMeet from '../components/SafeMeet';
import { useAuth } from '../context/AuthContext';

interface MeetPageProps {
  meetCode: string;
}

const MeetPage: React.FC<MeetPageProps> = ({ meetCode }) => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-slate-900">
      <SafeMeet meetCode={meetCode} />
    </div>
  );
};

export default MeetPage;
