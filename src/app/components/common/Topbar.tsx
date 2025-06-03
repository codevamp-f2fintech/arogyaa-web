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

import { creator } from "@/apis/apiClient";
import { Utility } from "@/utils";
import SnackbarComponent from "../common/Snackbar";

import { IconButton, Link, Tooltip } from "@mui/material";
import { usePopover } from "@/hooks/use-popover";

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

  const { capitalizeFirstLetter, decodedToken, getCookies } = Utility();
  const router = useRouter();
  const pathname = usePathname();
  const token = getCookies().token;

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
  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  const token = decodedToken();

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

  useEffect(() => {
    if (session?.user?.email && !token) {
      handleLogin(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  console.log("session>>", session?.user?.name, decodedToken());

  return (
    <AppBar
      className={styles.appBar}
      sx={{
        backgroundColor: appBarBg,
        boxShadow: "none",
        transition: "background-color 0.3s ease",
        // "&.MuiAppBar-root": {
        //   // Additional custom styles for the AppBar root
        //   backgroundColor: "#56428b", // This will override the transparent background if not scrolled
        // },
      }}
    >
      <Toolbar disableGutters>
        <Link href="/">
          <Box
            component="img"
            src="/logomain.png"
            alt="Logo"
            sx={{
              display: "flex",
              width: "auto",
              height: { xs: 45, sm: 60, md: 65 },
              maxWidth: "auto",
              mr: 1,
            }}
          />
        </Link>

        <Box
          sx={{
            flexGrow: 1,
            display: {
              xs: "none",
              md: "flex",
              justifyContent: "center",
            },
          }}
        ></Box>
        <Box className={styles.appointmentButtonContainer}>
          {pathname !== "/doctors" &&
            !pathname.startsWith("/doctors/profile/") && (
              <Button
                onClick={() => router.push("/doctors")}
                variant="contained"
                startIcon={<EventIcon />}
                sx={{
                  backgroundColor: "#5d4993 !important",
                  color: "#fff !important",
                  fontWeight: "bold",
                  borderRadius: "20px",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  textTransform: "capitalize",
                  padding: {
                    xs: "0",
                    md: "5px 16px",
                  },
                  height: {
                    xs: "3vh",
                    md: "6vh",
                    sm: "4vh",
                  },
                  width: {
                    xs: "35vw",
                    md: "15vw",
                    sm: "30vw",
                  },
                  fontSize: {
                    xs: "10px",
                    md: "15px",
                  },
                  "&:hover": {
                    backgroundColor: "#af9fdb !important",
                    color: "#29175e",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                {en.topbar.appointment}
              </Button>
            )}
        </Box>

        {/* Notification Bell */}
        <Box>
          <Tooltip title="Notifications">
            <IconButton
              aria-describedby={id}
               onClick={handleClick}
              sx={{
                padding: "10px",
                borderRadius: "50%",
                margin: "0 10px 0 5px",
              }}
            >
              <Badge
                badgeContent={unreadCount > 0 ? unreadCount : null}
                color="error"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    height: 18,
                    minWidth: 18,
                    top: 4,
                    right: 4,
                  },
                }}
              >
                <NotificationsIcon sx={{ color: "white" }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <NotificationPopover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            notifications={notifications}
            readNotifications={readNotification}
            markAsRead={markAsRead}
            setUnreadCount={setUnreadCount}
          />
        </Box>

        {session || decodedToken()?.id ? (
          <Box>
            <Button
              variant="contained"
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              startIcon={
                <PersonOutlineIcon
                  sx={{
                    fontSize: "18px",
                  }}
                />
              }
              sx={{
                backgroundColor: "#5d4993 !important",
                color: "#fff !important",
                fontWeight: "bold",
                borderRadius: "20px",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                textTransform: "capitalize",
                padding: {
                  xs: "0",
                  md: "5px 16px",
                },
                height: {
                  xs: "3vh",
                  md: "6vh",
                  sm: "4vh",
                },
                width: {
                  xs: "35vw",
                  md: "15vw",
                  sm: "30vw",
                },
                fontSize: {
                  xs: "10px",
                  md: "15px",
                },
                "&:hover": {
                  backgroundColor: "#af9fdb !important",
                  color: "#29175e",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              {session?.user?.name ||
                capitalizeFirstLetter(decodedToken()?.patientName)}
            </Button>

            <UserPopover
              anchorEl={userPopover.anchorRef.current}
              onClose={userPopover.handleClose}
              open={userPopover.open}
            />
          </Box>
        ) : (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#5d4993 !important",
              color: "#fff !important",
              fontWeight: "bold",
              borderRadius: "20px",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              textTransform: "capitalize",
              padding: {
                xs: "0",
                md: "6px 16px",
              },
              height: {
                xs: "3vh",
                md: "6vh",
                sm: "4vh",
              },
              width: {
                xs: "15vw",
                md: "7vw",
                sm: "30vw",
              },
              fontSize: {
                xs: "10px",
                md: "15px",
              },
              "&:hover": {
                backgroundColor: "#af9fdb !important",
                color: "#29175e",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <Link
              href="/signin"
              underline="none"
              sx={{
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              Login
            </Link>
            <PersonAddAltOutlinedIcon sx={{ fontSize: "18px" }} />
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
