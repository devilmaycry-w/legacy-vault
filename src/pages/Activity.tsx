import React from 'react';
import { Clock, User, Image as ImageIcon, FileText, Trash2 } from 'lucide-react';

const mockActivities = [
  {
    id: 1,
    user: 'Sophia Carter',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    action: 'uploaded a new photo',
    target: 'Family Picnic.jpg',
    type: 'photo',
    time: '10 minutes ago',
  },
  {
    id: 2,
    user: 'Ethan Carter',
    avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg',
    action: 'added a memory',
    target: 'Grandpa\'s Story',
    type: 'text',
    time: '1 hour ago',
  },
  {
    id: 3,
    user: 'Mia Carter',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
    action: 'deleted a video',
    target: 'Summer Trip.mp4',
    type: 'video',
    time: '3 hours ago',
  },
  {
    id: 4,
    user: 'Sophia Carter',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    action: 'joined the vault',
    target: '',
    type: 'member',
    time: 'Yesterday',
  },
];

function getTypeIcon(type: string) {
  switch (type) {
    case 'photo':
      return <ImageIcon className="w-5 h-5 text-[#e9883e]" />;
    case 'video':
      return <FileText className="w-5 h-5 text-[#e9883e]" />;
    case 'text':
      return <FileText className="w-5 h-5 text-[#e9883e]" />;
    case 'member':
      return <User className="w-5 h-5 text-[#e9883e]" />;
    case 'delete':
      return <Trash2 className="w-5 h-5 text-red-400" />;
    default:
      return <Clock className="w-5 h-5 text-[#b8a99d]" />;
  }
}

const Activity: React.FC = () => (
  <div className="max-w-2xl mx-auto p-8 bg-[rgba(56,47,41,0.8)] rounded-xl shadow-lg mt-10">
    <h1 className="text-2xl font-semibold mb-6 font-serif">Activity Log</h1>
    <ul className="space-y-6">
      {mockActivities.map((activity) => (
        <li key={activity.id} className="flex items-center bg-[#181411] rounded-xl p-4 shadow">
          <img
            src={activity.avatar}
            alt={activity.user}
            className="w-12 h-12 rounded-full mr-4 border-2 border-[#e9883e]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-[#e9883e]">{activity.user}</span>
              <span className="text-[#b8a99d]">{activity.action}</span>
              {activity.target && (
                <span className="ml-1 font-semibold text-white">{activity.target}</span>
              )}
              <span className="ml-2">{getTypeIcon(activity.type)}</span>
            </div>
            <div className="text-xs text-[#b8a99d] flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {activity.time}
            </div>
          </div>
        </li>
      ))}
    </ul>
    <div className="mt-8 text-center text-xs text-[#b8a99d]">
      Showing recent activity. More detailed audit logs coming soon!
    </div>
  </div>
);

export default Activity;
