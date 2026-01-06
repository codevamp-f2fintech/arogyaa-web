"use client";

import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationPopover from "./NotificationPopover";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function NotificationBell() {
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <IconButton onClick={handleOpen}>
          <NotificationsNoneIcon fontSize="medium" />
        </IconButton>

        {unreadCount > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#00C49F",
              boxShadow: "0 0 0 2px white",
            }}
          />
        )}
      </Box>

      <NotificationPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </>
  );
}
