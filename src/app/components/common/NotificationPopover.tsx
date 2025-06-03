"use client";

import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Popover,
} from "@mui/material";
import { useEffect, useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Utility } from "@/utils";
import { fetcher, modifier } from "@/apis/apiClient";

interface Notification {
  _id: string;
  message: string;
  status: "read" | "unread";
}

interface NotificationPopoverProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  setUnreadCount?: (count: number) => void; 
}

export default function NotificationPopover({
  open,
  anchorEl,
  onClose,
  setUnreadCount,
}: NotificationPopoverProps) {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visibleNotifications, setVisibleNotifications] = useState(5);

  const fetchNotifications = async () => {
    const { decodedToken } = Utility();
    const patientId = decodedToken()?._id || decodedToken()?.id;

    if (!patientId) {
      console.warn("No patient ID found, skipping fetch.");
      return;
    }

    try {
      const response = await fetcher("notification", `get-notifications/${patientId}`);
      setNotifications(response);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (setUnreadCount) {
      setUnreadCount(unreadCount);
    }
  }, [unreadCount, setUnreadCount]);

  const markAsRead = async (id: string) => {
    try {
      await modifier("notification", `update-notification/${id}`, { status: "read" });

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "read" } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewMore = () => {
    setVisibleNotifications((prev) => prev + 5);
  };

  const renderEmptyState = (text: string) => (
    <Box
      sx={{
        textAlign: "center",
        py: 5,
        opacity: 0.6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <NotificationsNoneIcon sx={{ fontSize: 40, color: "#b0b0b0" }} />
      <Typography variant="body1">{text}</Typography>
    </Box>
  );

  const filteredNotifications = notifications.filter((n) =>
    tabValue === 0 ? n.status === "unread" : n.status === "read"
  );

  const displayedNotifications = filteredNotifications.slice(0, visibleNotifications);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          width: 360,
          mt: 0.5,
          ml: 18,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        },
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{
          borderBottom: "1px solid #eee",
          backgroundColor: "#f9f9f9",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Tab label={`Unread (${unreadCount})`} />
        <Tab label="Read" />
      </Tabs>

      <Box sx={{ maxHeight: 400, overflowY: "auto", px: 2, py: 1 }}>
        {filteredNotifications.length === 0 ? (
          renderEmptyState(
            tabValue === 0 ? "No unread notifications" : "No read notifications"
          )
        ) : (
          <>
            {displayedNotifications.map((notification) => (
              <Box
                key={notification._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #f0f0f0",
                  py: 1,
                  gap: 1,
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (notification.status === "unread") {
                    markAsRead(notification._id);
                  }
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: notification.status === "unread" ? "#111" : "#666",
                    fontWeight: notification.status === "unread" ? 600 : 400,
                  }}
                >
                  {notification.message}
                </Typography>
              </Box>
            ))}
            {filteredNotifications.length > visibleNotifications && (
              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Button variant="text" onClick={handleViewMore}>
                  View More
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Popover>
  );
}
