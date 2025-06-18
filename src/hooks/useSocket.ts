import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4005";

export default function useSocket(
  patientId: string | null,
  onNotification: (notification: any) => void
) {
  const socketRef = useRef<Socket | null>(null);

  // Memoize the callback to prevent unnecessary reconnections
  const stableOnNotification = useCallback(onNotification, []);

  console.log(patientId, "from socket hook");

  useEffect(() => {
    if (!patientId) {
      console.log("❌ No patientId provided for socket connection");
      return;
    }

    // Create socket connection
    const socket = io(`${SOCKET_URL}/notifications`, {
      transports: ["websocket"],
      query: { patientId },
      autoConnect: true,
    });

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      // Explicitly join room after connection
      socket.emit("joinRoom", patientId);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    // Room join confirmation
    socket.on("roomJoined", (data) => {
      console.log("✅ Joined room with patientId:", data.patientId);
    });

    // Notification handler
    socket.on("notification", (data: any) => {
      console.log("📥 New Socket Notification:", data);
      stableOnNotification(data);
    });

    socketRef.current = socket;

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up socket connection");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("roomJoined");
      socket.off("notification");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [patientId, stableOnNotification]);

  // Return socket instance and connection status
  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
  };
}
