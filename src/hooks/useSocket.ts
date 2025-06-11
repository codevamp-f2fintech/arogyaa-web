import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4005";

export default function useSocket(
  patientId: string | null,
  onNotification: (notification: any) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!patientId) return;
    const socket = io(`${SOCKET_URL}/notifications`, {
      transports: ["websocket"],
    });

    socket.emit("joinRoom", patientId);

    socket.on("notification", (data: any) => {
      console.log("📥 New Socket Notification:", data);
      onNotification(data);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [patientId, onNotification]);

  return socketRef.current;
}
