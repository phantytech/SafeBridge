export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'parent' | 'police';
  parentId?: string; // For users linked to a parent
  phone?: string;
}

export interface Alert {
  id: string;
  userId: string;
  userName: string;
  location: { lat: number; lng: number; address: string };
  timestamp: string;
  status: 'active' | 'resolved';
  phone: string;
}

// Mock Data
export const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Rahim Ahmed',
    location: { lat: 23.8103, lng: 90.4125, address: 'Gulshan 1, Dhaka' },
    timestamp: new Date().toISOString(),
    status: 'active',
    phone: '+8801711000000'
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Fatima Begum',
    location: { lat: 23.7940, lng: 90.4043, address: 'Banani, Dhaka' },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'resolved',
    phone: '+8801911000000'
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Rahim Ahmed', email: 'user@safebridge.bd', role: 'user', parentId: 'p1', phone: '+8801711000000' },
  { id: 'p1', name: 'Kabir Ahmed', email: 'parent@safebridge.bd', role: 'parent' },
  { id: 'pol1', name: 'DMP Control Room', email: 'police@safebridge.bd', role: 'police' }
];
