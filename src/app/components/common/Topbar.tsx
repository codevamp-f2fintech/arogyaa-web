"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { UserPopover } from "./user-popover";
import en from "@/locales/en.json";
import styles from "../../page.module.css";

import { AppDispatch, RootState } from "@/redux/store";
import { setNotifications } from "@/redux/features/notificationsSlice";

import { creator } from "@/apis/apiClient";
import { Utility } from "@/utils";
import SnackbarComponent from "../common/Snackbar";

import { Link } from "@mui/material";
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
  const { capitalizeFirstLetter, decodedToken, getCookies } = Utility();
  const router = useRouter();
  const pathname = usePathname();
  const token = getCookies().token;

  console.log("token>>", token);

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

        {/* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            className={styles.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none", justifyContent: "center" },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography className={styles.menuItem}>{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          LOGO
        </Typography> */}

        <Box
          sx={{
            flexGrow: 1,
            display: {
              xs: "none",
              md: "flex",
              justifyContent: "center",
            },
          }}
        >
          {/* {pages.map((page) => (
            <Button
              key={page}
              onClick={handleCloseNavMenu}
              className={styles.menuItemButton}
            >
              {page}
            </Button>
          ))} */}
        </Box>
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
                color: "white", // Ensures the text is white, not overridden by background
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
        {/* <Box>
          <IconButton
            aria-describedby={id}
            onClick={handleClick}
            sx={{
              color: "#000",
              backgroundColor: "#20ADA0",
              padding: "10px",
              borderRadius: "500px",
              margin: "0 10px 0 5px",
              ":hover": {
                bgcolor: "#20ADA0",
                color: "white",
              },
            }}
          >
            <NotificationsIcon sx={{ color: "white" }} />
          </IconButton>
          <Popover
            anchorReference="anchorPosition"
            anchorPosition={{ top: 0, left: 700 }}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            sx={{ borderRadius: "px" }}
          >
            <Box
              sx={{
                width: 400,
                position: "fixed",
                right: "40px",
                top: "80px",
                zIndex: 1300,
                backgroundColor: "white",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                textColor="inherit"
                indicatorColor="primary"
                sx={{
                  backgroundColor: "#20ADA0",
                  color: "white",
                }}
              >
                <Tab label="Unread" sx={{ color: "white" }} />
                <Tab label="Read" sx={{ color: "white" }} />
              </Tabs>
              <Box sx={{ p: 2 }}>
                {tabValue === 0 ? (
                  <Box>
                    {notifications.length === 0 ? (
                      <Typography>No unread notifications</Typography>
                    ) : (
                      notifications
                        .slice(0, visibleNotifications)
                        .map((notification, index) => (
                          <Typography
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #f0f0f0",
                              padding: "8px 0",
                            }}
                          >
                            {notification.message}
                            <IconButton onClick={() => markAsRead(index)}>
                              <MarkEmailReadIcon sx={{ color: "#20ADA0" }} />
                            </IconButton>
                          </Typography>
                        ))
                    )}
                    {notifications.length > visibleNotifications && (
                      <Button
                        onClick={handleViewMore}
                        sx={{
                          color: "#20ADA0",
                          textTransform: "capitalize",
                          ":hover": {
                            bgcolor: "#f0f0f0",
                          },
                        }}
                      >
                        View More
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Box>
                    {readNotification.length === 0 ? (
                      <Typography>No read notifications.</Typography>
                    ) : (
                      readNotification
                        .slice(0, visibleNotifications)
                        .map((notification, index) => (
                          <Typography
                            key={index}
                            sx={{
                              borderBottom: "1px solid #f0f0f0",
                              padding: "8px 0",
                            }}
                          >
                            {notification}
                          </Typography>
                        ))
                    )}
                    {readNotification.length > visibleNotifications && (
                      <Button
                        onClick={handleViewMore}
                        sx={{
                          color: "#20ADA0",
                          textTransform: "capitalize",
                          ":hover": {
                            bgcolor: "#f0f0f0",
                          },
                        }}
                      >
                        View More
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Popover>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
