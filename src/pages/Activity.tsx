import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Clock, User, Image as ImageIcon, FileText, Trash2 } from 'lucide-react';

const DEFAULT_AVATAR = "/default-avatar.png";

// Helper: returns fallback if val is empty/undefined/null
function safeDisplay(val: string | undefined | null, fallback: string) {
  return val && val.trim() ? val : fallback;
}

// Optionally, format Firestore timestamps
function formatTime(timestamp: any) {
  if (!timestamp) return "Unknown time";
  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + " minutes ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hours ago";
  if (diff < 172800) return "Yesterday";
  return date.toLocaleString();
}

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

const Activity: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const q = query(
          collection(db, "activities"),
          orderBy("timestamp", "desc"),
          limit(20)
        );
        const querySnapshot = await getDocs(q);
        const activityList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(activityList);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-[rgba(56,47,41,0.8)] rounded-xl shadow-lg mt-6 sm:mt-10">
      <h1 className="text-2xl font-semibold mb-4 sm:mb-6 font-serif text-center">Activity Log</h1>
      {loading ? (
        <div className="text-center text-[#b8a99d]">Loading…</div>
      ) : (
        <ul className="space-y-4 sm:space-y-6">
          {activities.length === 0 ? (
            <div className="text-center text-[#b8a99d]">No recent activity found.</div>
          ) : (
            activities.map((activity: any) => (
              <li
                key={activity.id}
                className="flex items-start sm:items-center flex-col sm:flex-row bg-[#181411] rounded-xl p-4 shadow w-full"
              >
                {/* Avatar with fallback to initial */}
                {!activity.avatar || activity.avatar === DEFAULT_AVATAR ? (
                  <div className="w-12 h-12 rounded-full mr-0 sm:mr-4 mb-2 sm:mb-0 border-2 border-[#e9883e] flex items-center justify-center bg-[#e9883e] text-[#181411] font-bold text-xl uppercase shrink-0">
                    {safeDisplay(activity.user, "U")[0]}
                  </div>
                ) : (
                  <img
                    src={activity.avatar}
                    alt={safeDisplay(activity.user, "Unknown user")}
                    className="w-12 h-12 rounded-full mr-0 sm:mr-4 mb-2 sm:mb-0 border-2 border-[#e9883e] object-cover shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                )}

                {/* Details */}
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1 text-base">
                    <span className="font-semibold text-[#e9883e] break-all">
                      {safeDisplay(activity.user, "Unknown User")}
                    </span>
                    <span className="text-[#b8a99d] break-all">
                      {safeDisplay(activity.action, "performed an action")}
                    </span>
                    {safeDisplay(activity.target, "") && (
                      <span className="ml-1 font-semibold text-white break-all">
                        {safeDisplay(activity.target, "")}
                      </span>
                    )}
                    <span className="ml-2">{getTypeIcon(activity.type)}</span>
                  </div>
                  <div className="text-xs text-[#b8a99d] flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
      <div className="mt-8 text-center text-xs text-[#b8a99d]">
        Showing recent activity. More detailed audit logs coming soon!
      </div>
    </div>
  );
};

export default Activity;
