import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase"; // adjust if your firebase config is elsewhere

// Helper to safely assign values or omit fields if empty
function safeField(val: string | undefined | null, fallback?: string) {
  return val && val.trim() ? val : fallback ? fallback : undefined;
}

// Call this function wherever you want to log an activity
export async function logActivity({
  user,
  avatar,
  action,
  target,
  type,
}: {
  user?: string;
  avatar?: string;
  action?: string;
  target?: string;
  type?: string;
}) {
  try {
    await addDoc(collection(db, "activities"), {
      user: safeField(user, "Unknown User"),
      avatar: safeField(avatar, "/default-avatar.png"),
      action: safeField(action, "performed an action"),
      target: safeField(target),
      type: safeField(type),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
