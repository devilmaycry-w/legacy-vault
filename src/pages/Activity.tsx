import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../services/firebase"; // Make sure the path is correct for your project
import { Clock, User, Image as ImageIcon, FileText, Trash2 } from "lucide-react";

// Helper to display the right icon for activity type
function getTypeIcon(type: string) {
  switch (type) {
    case "photo":
      return <ImageIcon className="w-5 h-5 text-[#e9883e]" />;
    case "video":
      return <FileText className="w-5 h-5 text-[#e9883e]" />;
    case "text":
      return <FileText className="w-5 h-5 text-[#e9883e]" />;
    case "member":
      return <User className="w-5 h-5 text-[#e9883e]" />;
    case "delete":
      return <Trash2 className="w-5 h-5 text-red-400" />;
    default:
      return <Clock className="w-5 h-5 text-[#b8a99d]" />;
  }
}

// Helper to format Firestore timestamps
function formatTime(timestamp: any) {
  if (!timestamp) return "Unknown time";
  // Firestore Timestamp object has seconds property
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
    <div className="max-w-2xl mx-auto p-8 bg-[rgba(56,47,41,0.8)] rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-semibold mb-6 font-serif">Activity Log</h1>
      {loading ? (
        <div className="text-center text-[#b8a99d]">Loading…</div>
      ) : (
        <ul className="space-y-6">
          {activities.length === 0 ? (
            <div className="text-center text-[#b8a99d]">No recent activity found.</div>
          ) : (
            activities.map((activity: any) => (
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
