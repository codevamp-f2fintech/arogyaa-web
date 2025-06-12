import { useEffect } from "react";
import { io } from "socket.io-client";
import { Utility } from "@/utils";

const socket = io("http://localhost:4005/notifications", {
  transports: ["websocket"],
});

interface NotificationSocketProps {
  onNewNotification: (notification: any) => void;
}

export default function NotificationSocket({ onNewNotification }: NotificationSocketProps) {
  useEffect(() => {
    const decoded = Utility().decodedToken();
    const userId = decoded?.patientId || decoded?.userId || decoded?._id;

    if (!userId) {
      console.warn("❌ No valid userId found in token.");
      return;
    }

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("joinRoom", userId);
    };

    const handleNotification = (data: any) => {
      console.log("🔔 New Notification Received:", data);
      onNewNotification(data);
    };

    socket.on("connect", handleConnect);
    socket.on("notification", handleNotification);
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification", handleNotification);
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [onNewNotification]);

  return null;
}
