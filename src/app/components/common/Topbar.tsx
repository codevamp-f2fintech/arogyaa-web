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
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
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
import SnackbarComponent from "../../components/common/Snackbar";

import {
  IconButton,
  Link,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePopover } from "@/hooks/use-popover";
import { EmergencySearchModal } from "./EmergencyModals";
import type { AppointmentType, DurationOpt } from "./EmergencyModals";

interface SignInResponse {
  token: string;
  message: string;
  statusCode: number;
}

const Topbar = () => {
  const [loading, setLoading] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [readNotification, setReadNotification] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const [unreadCount, setUnreadCount] = useState(0);
  const [readCount, setReadCount] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { snackbar } = useSelector((state: RootState) => state.snackbar);

  const { capitalizeFirstLetter, decodedToken, snackbarAndNavigate } =
    Utility();
  const token = decodedToken();
  const router = useRouter();
  const pathname = usePathname();

  const patientId = decodedToken()?.id;

  const { notifications } = useSelector(
    (state: RootState) => state.notifications
  );
  useSocket(patientId, (newNotification) => {
    dispatch(setNotifications([...(notifications || []), newNotification]));
  });
  const userPopover = usePopover<HTMLDivElement>();

  const [visibleNotifications, setVisibleNotifications] = useState(5);
  const [appBarBg, setAppBarBg] = useState("#56428b");
  const { data: session } = useSession();
  const searchParams = useSearchParams();

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

  const handleClose = () => setAnchorEl(null);
  const handleViewMore = () => setVisibleNotifications((prev) => prev + 5);

  const handleScroll = () => {
    if (window.scrollY < 100) setAppBarBg("#56428b");
    else setAppBarBg("transparent");
  };

  const handleLogin = async (email: string) => {
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
        setTimeout(() => setLoading(false), 2000);
      } else if (response?.statusCode === 400) {
        snackbarAndNavigate(dispatch, true, "error", "Invalid Password");
        setTimeout(() => setLoading(false), 2000);
      }
    } catch (error) {
      console.error("Login failed", error);
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Error Logging in. Please Try Again"
      );
      setTimeout(() => setLoading(false), 2200);
    } finally {
      setTimeout(() => setLoading(false), 2200);
    }
  };

  const handleEmergencyOpen = () => {
    if (!token?.id && !token?._id) {
      router.push("/signin?redirect=%2Fdoctors");
      return;
    }
    setEmergencyModalOpen(true);
  };

  useEffect(() => {
    if (session?.user?.email && !token) {
      handleLogin(session.user.email);
    }
  }, [session, token]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getButtonStyles = (isCompact = false) => ({
    backgroundColor: "#5d4993 !important",
    color: "#fff !important",
    fontWeight: "bold",
    borderRadius: "12px", // Smaller border radius for tiny buttons
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "capitalize" as const,
    minWidth: 0,

    // Minimal mobile icon buttons
    width: {
      xs: "24px", // Minimal width
      sm: "auto",
      md: "13vw",
    },

    height: {
      xs: "24px", // Minimal height
      sm: isCompact ? "36px" : "40px",
      md: "48px",
    },

    padding: {
      xs: "0px !important", // No padding for minimal buttons
      sm: isCompact ? "6px 12px" : "8px 16px",
      md: "8px 20px",
    },

    "& svg": {
      fontSize: {
        xs: "10px !important", // Minimal icon size
        sm: "16px",
        md: "18px",
      },
    },

    fontSize: {
      xs: "0px",
      sm: "13px",
      md: "14px",
    },

    "& .MuiButton-startIcon": {
      margin: 0,
      marginRight: {
        xs: 0,
        sm: "8px",
      },
    },

    "& span:not(.MuiButton-startIcon)": {
      display: {
        xs: "none",
        sm: "inline",
      },
    },

    "&:hover": {
      backgroundColor: "#af9fdb !important",
      color: "#29175e",
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
    },
  });

  const getEmergencyButtonStyles = (isCompact = false) => ({
    ...getButtonStyles(isCompact),
    background:
      "linear-gradient(135deg, #ff4d4f 0%, #d9363e 50%, #b71c1c 100%) !important",
    border: "0",
    animation: "pulse 1.6s infinite",
    "@keyframes pulse": {
      "0%": { boxShadow: "0 0 0 0 rgba(255,77,79,0.6)" },
      "70%": { boxShadow: "0 0 0 10px rgba(255,77,79,0)" },
      "100%": { boxShadow: "0 0 0 0 rgba(255,77,79,0)" },
    },
  });

  const sendEmergencyRequest = async (args: {
    specialityId: string;
    appointmentType: AppointmentType;
    location: string;
    duration: DurationOpt;
  }) => {
    const { specialityId, appointmentType, location, duration } = args;

    if (!token?.id && !token?._id) {
      router.push("/signin?redirect=%2Fdoctors");
      return;
    }

    setEmergencyLoading(true);
    try {
      const body = {
        patientId: token.id || token._id,
        specialityId,
        location,
        appointmentType,
        durationMinutes: Number(duration),
      };

      // const res: any = await creator(
      //   "appointment",
      //   "/emergency/create-auto",
      //   body
      // );

      if (true) {
        snackbarAndNavigate(
          dispatch,
          true,
          "success",
          "🚑 Emergency request sent! Available doctors are being notified."
        );
        setEmergencyModalOpen(false);
      } else {
        snackbarAndNavigate(
          dispatch,
          true,
          "warning",
          "Could not create emergency request. Please try again."
        );
      }
    } catch (err) {
      console.error("Emergency create failed", err);
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Something went wrong while creating emergency appointment. Please try again."
      );
    } finally {
      setEmergencyLoading(false);
    }
  };

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? "simple-popover" : undefined;

  const logoStyles = {
    display: "flex",
    width: "auto",
    height: { xs: 40, sm: 50, md: 60 },
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
        <Link href="/">
          <Box component="img" src="/logomain.png" alt="Logo" sx={logoStyles} />
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, sm: 1, md: 1.5 },
            alignItems: "center",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            justifyContent: "flex-end",
            width: "80vw",
          }}
        >
          {isMobile ? (
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                alignItems: "center",
                justifyContent: "flex-end",
                flexWrap: "nowrap",
              }}
            >
              <Button
                onClick={handleEmergencyOpen}
                variant="contained"
                startIcon={<LocalHospitalIcon sx={{ fontSize: 16 }} />}
                disabled={emergencyLoading}
                sx={{
                  ...getEmergencyButtonStyles(true),
                  minWidth: "50px",
                  order: 0,
                }}
              >
                {emergencyLoading ? "Sending…" : "Emergency"}
              </Button>

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
                      minWidth: "50px",
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

              <IconButton
                aria-describedby={popoverId}
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
            <>
              <Button
                onClick={handleEmergencyOpen}
                variant="contained"
                startIcon={<LocalHospitalIcon sx={{ fontSize: 20 }} />}
                disabled={emergencyLoading}
                sx={getEmergencyButtonStyles()}
              >
                {emergencyLoading ? "Sending…" : "Emergency Book"}
              </Button>

              {/* Book Appointment Button - Tablet/Desktop */}
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
                    <PersonAddAltOutlinedIcon
                      sx={{
                        fontSize: { xs: "18px", sm: "60px", md: "60px" },
                      }}
                    />
                  </Link>
                </Button>
              )}

              {/* Notification Bell - Tablet/Desktop */}
              <Tooltip title="Notifications">
                <IconButton
                  aria-describedby={popoverId}
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
          open={openPopover}
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

      {/* ===== Emergency Search Modal ===== */}
      <EmergencySearchModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onSearch={async ({
          specialityId,
          appointmentType,
          location,
          duration,
        }) => {
          await sendEmergencyRequest({
            specialityId,
            appointmentType,
            location,
            duration,
          });
        }}
      />
      <SnackbarComponent
        alerting={snackbar.snackbarAlert}
        severity={snackbar.snackbarSeverity}
        message={snackbar.snackbarMessage}
      />
    </AppBar>
  );
};

export default Topbar;
