"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Badge from "@mui/material/Badge";
import NotificationPopover from "./NotificationPopover";
import { UserPopover } from "./user-popover";
import en from "@/locales/en.json";
import styles from "../../page.module.css";

import { AppDispatch, RootState } from "@/redux/store";
import { setNotifications } from "@/redux/features/notificationsSlice";
import useSocket from "@/hooks/useSocket";

import { creator } from "@/apis/apiClient";
import { Utility } from "@/utils";
import SnackbarComponent from "./Snackbar";

import {
  IconButton,
  Link,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePopover } from "@/hooks/use-popover";
import { Notifications } from "@/types/notifications";

interface SignInResponse {
  token: string;
  message: string;
  statusCode: number;
}

const Topbar = () => {
  const [loading, setLoading] = useState(false);
  const [readNotification, setReadNotification] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const [unreadCount, setUnreadCount] = useState(0);
  const [readCount, setReadCount] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { capitalizeFirstLetter, decodedToken, getCookies } = Utility();
  const token = decodedToken();
  const router = useRouter();
  const pathname = usePathname();

  const patientId = decodedToken()?.id;

  useSocket(patientId, (newNotification) => {
    dispatch(setNotifications([...(notifications || []), newNotification]));
  });
  const userPopover = usePopover<HTMLDivElement>();
  const { notifications } = useSelector(
    (state: RootState) => state.notifications
  );

  const [visibleNotifications, setVisibleNotifications] = useState(5);
  const [appBarBg, setAppBarBg] = useState("#56428b");
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const { snackbarAndNavigate } = Utility();
  const rawRedirect = searchParams.get("redirect");
  const decodedRedirect = rawRedirect ? decodeURIComponent(rawRedirect) : null;

  const markAsRead = (index: number) => {
    const notificationToMove = notifications[index];
    setReadNotification((prev) => [...prev, notificationToMove.message]);

    const newUnreadNotifications = notifications.filter((_, i) => i !== index);
    dispatch(setNotifications(newUnreadNotifications));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!token?.id && !token?._id) {
      router.push("/signin");
      return;
    }

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewMore = () => {
    setVisibleNotifications((prev) => prev + 5);
  };

  const handleScroll = () => {
    if (window.scrollY < 100) {
      setAppBarBg("#56428b");
    } else {
      setAppBarBg("transparent");
    }
  };

  const handleLogin = async (email) => {
    try {
      const response: SignInResponse = await creator("patient", "/login", {
        email: email,
        password: "arrogyapatient",
      });

      if (response?.statusCode === 200) {
        document.cookie = `token=${response.token}; path=/; max-age=${
          1 * 24 * 60 * 60
        }; secure; samesite=strict`;

        snackbarAndNavigate(
          dispatch,
          true,
          "success",
          response?.message || "Login Successful",
          () => router.push(decodedRedirect || "/doctors")
        );
      } else if (response?.statusCode === 409) {
        snackbarAndNavigate(dispatch, true, "error", "Patient Not Found");
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else if (response?.statusCode === 400) {
        snackbarAndNavigate(dispatch, true, "error", "Invalid Password");
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Login failed", error);
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Error Logging in. Please Try Again"
      );
      setTimeout(() => {
        setLoading(false);
      }, 2200);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2200);
    }
  };

  // Handler for the new button
  // const handleNewButtonClick = () => {
  //   console.log("New button clicked!");
  //   // Example: router.push("/some-page");
  // };

  useEffect(() => {
    if (session?.user?.email && !token) {
      handleLogin(session.user.email);
    }
  }, [session, token]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Common button styles with responsive sizing
  const getButtonStyles = (isCompact = false) => ({
    backgroundColor: "#5d4993 !important",
    color: "#fff !important",
    fontWeight: "bold",
    borderRadius: "20px",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    textTransform: "capitalize" as const,
    minWidth: 0, // Allow buttons to shrink
    padding: {
      xs: isCompact ? "4px 8px" : "6px 12px",
      sm: isCompact ? "6px 12px" : "8px 16px",
      md: "8px 20px",
    },
    height: {
      xs: "36px",
      sm: "40px",
      md: "48px",
    },
    fontSize: {
      xs: "11px",
      sm: "13px",
      md: "14px",
    },
    "&:hover": {
      backgroundColor: "#af9fdb !important",
      color: "#29175e",
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
    },
  });

  // Logo responsive styles
  const logoStyles = {
    display: "flex",
    width: "auto",
    height: {
      xs: 40,
      sm: 50,
      md: 60,
    },
    maxWidth: "auto",
    mr: { xs: 0.5, sm: 1, md: 1.5 },
  };

  return (
    <AppBar
      className={styles.appBar}
      sx={{
        backgroundColor: appBarBg,
        boxShadow: "none",
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          minHeight: { xs: 56, sm: 64, md: 64 },
          gap: { xs: 0.5, sm: 1, md: 1.5 },
        }}
      >
        {/* Logo */}
        <Link href="/">
          <Box component="img" src="/logomain.png" alt="Logo" sx={logoStyles} />
        </Link>

        {/* Spacer to push all buttons to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* All buttons container - positioned on the right */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, sm: 1, md: 1.5 },
            alignItems: "center",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            justifyContent: "flex-end",
          }}
        >
          {/* Mobile layout: Stack buttons or use smaller sizes */}
          {isMobile ? (
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {/* Top Doctors Button - Mobile */}
              {/* <Button
                onClick={handleNewButtonClick}
                variant="contained"
                startIcon={<PersonOutlineIcon sx={{ fontSize: "16px" }} />}
                sx={{
                  ...getButtonStyles(true),
                  order: 1,
                  flexShrink: 1,
                  minWidth: "80px",
                }}
              >
                Top Dr's
              </Button> */}

              {/* Appointment Button - Mobile */}
              {pathname !== "/doctors" &&
                !pathname.startsWith("/doctors/profile/") && (
                  <Button
                    onClick={() => router.push("/doctors")}
                    variant="contained"
                    startIcon={<EventIcon sx={{ fontSize: "16px" }} />}
                    sx={{
                      ...getButtonStyles(true),
                      order: 2,
                      flexShrink: 1,
                      minWidth: "90px",
                    }}
                  >
                    Book
                  </Button>
                )}

              {/* User/Login Button - Mobile */}
              {session || decodedToken()?.id ? (
                <Button
                  variant="contained"
                  onClick={userPopover.handleOpen}
                  ref={userPopover.anchorRef}
                  startIcon={<PersonOutlineIcon sx={{ fontSize: "16px" }} />}
                  sx={{
                    ...getButtonStyles(true),
                    order: 3,
                    flexShrink: 1,
                    maxWidth: "100px",
                  }}
                >
                  {(
                    session?.user?.name ||
                    capitalizeFirstLetter(decodedToken()?.patientName)
                  )?.split(" ")[0] || "User"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    ...getButtonStyles(true),
                    order: 3,
                    flexShrink: 1,
                    minWidth: "70px",
                  }}
                >
                  <Link
                    href="/signin"
                    underline="none"
                    sx={{
                      color: "white",
                      textDecoration: "none",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    Login
                    <PersonAddAltOutlinedIcon sx={{ fontSize: "16px" }} />
                  </Link>
                </Button>
              )}

              {/* Notification Bell - Mobile */}
              <IconButton
                aria-describedby={id}
                onClick={handleClick}
                sx={{
                  padding: "6px",
                  borderRadius: "50%",
                  order: 4,
                }}
              >
                <Badge
                  variant={unreadCount > 0 ? "dot" : undefined}
                  color="success"
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-dot": {
                      backgroundColor: "#00BFA5",
                      height: 8,
                      minWidth: 8,
                      top: 2,
                      right: 2,
                    },
                  }}
                >
                  <NotificationsIcon sx={{ color: "#fff", fontSize: "24px" }} />
                </Badge>
              </IconButton>
            </Box>
          ) : (
            // Tablet and Desktop layout
            <>
              {/* Top Doctors Button - Tablet/Desktop */}
              {/* <Button
                onClick={handleNewButtonClick}
                variant="contained"
                startIcon={<PersonOutlineIcon />}
                sx={getButtonStyles()}
              >
                Top Doctor's
              </Button> */}

              {/* Appointment Button - Tablet/Desktop */}
              {pathname !== "/doctors" &&
                !pathname.startsWith("/doctors/profile/") && (
                  <Button
                    onClick={() => router.push("/doctors")}
                    variant="contained"
                    startIcon={<EventIcon />}
                    sx={getButtonStyles()}
                  >
                    {en.topbar.appointment}
                  </Button>
                )}

              {/* User/Login Button - Tablet/Desktop */}
              {session || decodedToken()?.id ? (
                <Button
                  variant="contained"
                  onClick={userPopover.handleOpen}
                  ref={userPopover.anchorRef}
                  startIcon={<PersonOutlineIcon sx={{ fontSize: "18px" }} />}
                  sx={getButtonStyles()}
                >
                  {session?.user?.name ||
                    capitalizeFirstLetter(decodedToken()?.patientName)}
                </Button>
              ) : (
                <Button variant="contained" sx={getButtonStyles()}>
                  <Link
                    href="/signin"
                    underline="none"
                    sx={{
                      color: "white",
                      textDecoration: "none",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Login
                    <PersonAddAltOutlinedIcon sx={{ fontSize: "18px" }} />
                  </Link>
                </Button>
              )}

              {/* Notification Bell - Tablet/Desktop */}
              <Tooltip title="Notifications">
                <IconButton
                  aria-describedby={id}
                  onClick={handleClick}
                  sx={{
                    padding: { sm: "8px", md: "10px" },
                    borderRadius: "50%",
                    margin: "0 8px 0 4px",
                  }}
                >
                  <Badge
                    variant={unreadCount > 0 ? "dot" : undefined}
                    color="success"
                    overlap="circular"
                    sx={{
                      "& .MuiBadge-dot": {
                        backgroundColor: "#00BFA5",
                        height: 10,
                        minWidth: 10,
                        top: 4,
                        right: 1,
                      },
                    }}
                  >
                    <NotificationsIcon
                      sx={{ color: "#fff", fontSize: "28px" }}
                    />
                  </Badge>
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>

        {/* Notification Popover */}
        <NotificationPopover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          notifications={notifications}
          readNotifications={readNotification}
          markAsRead={markAsRead}
          setUnreadCount={setUnreadCount}
          setReadCount={setReadCount}
        />

        {/* User Popover */}
        {(session || decodedToken()?.id) && (
          <UserPopover
            anchorEl={userPopover.anchorRef.current}
            onClose={userPopover.handleClose}
            open={userPopover.open}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
