"use client";

import { Box, Typography, Tabs, Tab, Button, Popover } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Utility } from "@/utils";
import { fetcher, modifier } from "@/apis/apiClient";
import { setNotifications } from "@/redux/features/notificationsSlice";
import { RootState } from "@/redux/store";
import useSocket from "@/hooks/useSocket";
import SnackbarComponent from "./Snackbar";

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
  const [visibleNotifications, setVisibleNotifications] = useState(5);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const { decodedToken } = Utility();
  const tokenData = decodedToken();
  const patientId = tokenData?.id;

  const requestNotificationPermission = async () => {
    try {
      if (!("Notification" in window)) {
        console.warn("❌ This browser does not support notifications.");
        return;
      }

      console.log(
        "🔍 Current Notification Permission:",
        Notification.permission
      );

      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        console.log("📥 Permission granted status:", permission);
        if (permission === "granted") {
          new Notification("✅ Notifications Enabled!", {
            body: "You'll now get alerts here.",
            icon: "/notification-icon.png",
          });
        } else {
          setSnackbarMsg("Please enable browser notifications in settings.");
          setShowSnackbar(true);
        }
      }
    } catch (err) {
      console.error("⚠️ Error requesting notification permission:", err);
    }
  };

  const showBrowserNotification = (notification: Notification) => {
    console.log("🔔 Trying to show browser notification", notification);

    if (!("Notification" in window)) {
      console.warn("🚫 Notification API not supported");
      alert(notification.message); 
      return;
    }

    if (Notification.permission !== "granted") {
      console.warn("🔕 Notification permission not granted");
      requestNotificationPermission();
      alert(notification.message); 
      return;
    }

    const isTabFocused = document.hasFocus();

    if (isTabFocused) {
      console.log("🟡 Tab is focused — showing alert()");
      alert(notification.message); 
    } else {
      try {
        const n = new Notification("📢 New Notification", {
          body: notification.message || "You have a new alert!",
          icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
          tag: notification._id,
        });

        n.onclick = () => {
          window.focus();
          n.close();
        };

        setTimeout(() => n.close(), 5000);
      } catch (err) {
        console.error("❌ Notification creation failed:", err);
        alert(notification.message); // fallback
      }
    }

    // Always show Snackbar as fallback
    setSnackbarMsg(notification.message);
    // setShowSnackbar(true);
  };

  useSocket(patientId, (newNotification) => {
    console.log("📥 New Notification in Popover:", newNotification);
    dispatch(setNotifications((prev) => [newNotification, ...prev]));
    setSnackbarMsg(newNotification.message);
    // setShowSnackbar(true);
    showBrowserNotification(newNotification);
  });

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const fetchNotifications = async () => {
    if (!patientId) return;
    try {
      const response = await fetcher(
        "notification",
        `get-notifications/${patientId}`
      );

      if (Array.isArray(response)) {
        dispatch(setNotifications(response));

      
        response.forEach((notification: Notification) => {
          if (notification.status === "unread") {
            showBrowserNotification(notification);
          }
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (setUnreadCount) {
      setUnreadCount(unreadCount);
    }
  }, [unreadCount, setUnreadCount]);

  const markAsRead = async (id: string) => {
    try {
      await modifier("notification", `update-notification/${id}`, {
        status: "read",
      });
      const updated = notifications.map((n) =>
        n._id === id ? { ...n, status: "read" } : n
      );
      dispatch(setNotifications(updated));
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

  const displayedNotifications = filteredNotifications.slice(
    0,
    visibleNotifications
  );

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

      <SnackbarComponent
        alerting={showSnackbar}
        message={snackbarMsg}
        severity="info"
        // onClose={() => setShowSnackbar(false)}
      />
    </Popover>
  );
}
