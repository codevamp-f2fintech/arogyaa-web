import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export function useRealTimeNotification(userId, onNewNotification) {
  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      socket.emit("joinRoom", userId); // Join after connected
    };

    socket.on("connect", handleConnect);

    socket.on("newNotification", (data) => {
      console.log("Received notification:", data);
      onNewNotification(data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newNotification");
      socket.off("disconnect");
    };
  }, [userId, onNewNotification]);
}
