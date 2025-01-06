"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popover from "@mui/material/Popover";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { UserPopover } from "./user-popover";
import en from "@/locales/en.json";
import styles from "../../page.module.css";

import { AppDispatch, RootState } from "@/redux/store";
import { useGetNotifications } from "@/hooks/notification";
import { setNotifications } from "@/redux/features/notificationsSlice";
import { Utility } from "@/utils";
import { Link } from "@mui/material";
import { usePopover } from "@/hooks/use-popover";

const pages = ["Products", "Pricing", "Blog"];

const Topbar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0); // State for tab selection
  const [readNotification, setReadNotification] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const { capitalizeFirstLetter, decodedToken } = Utility();
  const router = useRouter();

  const userPopover = usePopover<HTMLDivElement>();

  const { notifications } = useSelector(
    (state: RootState) => state.notifications
  );
  const handleClick2 = () => {
    router.push("/doctor");
  };

  //fetch api
  // const { data } = useGetNotifications(
  //   [],
  //   `http://localhost:3004/api/notifications/get-notifications/60d9caed6f70c40b7cdcb867`
  // );

  let dataArray = [1, 2, 3, 4, 5];

  // useEffect(() => {
  //   if (dataArray && dataArray.length > 0) {
  //     dispatch(setNotifications(dataArray));
  //   }
  // }, [data, dispatch]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [visibleNotifications, setVisibleNotifications] = useState(5);

  const markAsRead = (index: number) => {
    const notificationToMove = notifications[index];
    setReadNotification((prev) => [...prev, notificationToMove.message]);

    const newUnreadNotifications = notifications.filter((_, i) => i !== index);
    dispatch(setNotifications(newUnreadNotifications));
  };

  const handleViewMore = () => {
    setVisibleNotifications((prev) => prev + 5);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <AppBar className={styles.appBar}>
      <Toolbar disableGutters>
        <AdbIcon
          sx={{ display: { xs: "none", md: "flex", color: "#000" }, mr: 1 }}
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "#000",
            textDecoration: "none",
          }}
        >
          {en.topbar.title}
        </Typography>

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
            display: { xs: "none", md: "flex", justifyContent: "center" },
          }}
        >
          {pages.map((page) => (
            <Button
              key={page}
              onClick={handleCloseNavMenu}
              className={styles.menuItemButton}
            >
              {page}
            </Button>
          ))}
        </Box>

        <Box className={styles.appointmentButtonContainer}>
          <Button
            onClick={handleClick2} // Handle button click
            variant="outlined"
            className={styles.appointmentButton}
            endIcon={<ArrowCircleRightIcon />}
          >
            {en.topbar.appointment} {/* Button label */}
          </Button>
        </Box>

        <Box>
          <IconButton
            aria-describedby={id}
            onClick={handleClick}
            sx={{
              color: "#000",
              backgroundColor: "#FAFAFA",
              padding: "10px",
              borderRadius: "500px",
              margin: "0 10px 0 5px",
              ":hover": {
                bgcolor: "#20ADA0",
                color: "white",
              },
            }}
          >
            <NotificationsIcon sx={{ color: "black" }} />
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
            <Box sx={{ width: 400 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                textColor="#20ADA0"
                indicatorColor="black"
              >
                <Tab label="Unread" sx={{ color: "#20ADA0" }} />
                <Tab label="Read" sx={{ color: "#20ADA0" }} />
              </Tabs>
              <Box sx={{ p: 2 }}>
                {tabValue === 0 ? (
                  <Box>
                    {notifications.length === 0 ? (
                      <Typography>No unread Notifications</Typography>
                    ) : (
                      notifications
                        .slice(0, visibleNotifications)
                        .map((notification, index) => (
                          <Typography key={index}>
                            {notification.message}
                            <IconButton onClick={() => markAsRead(index)}>
                              <MarkEmailReadIcon sx={{ color: "#20ADA0" }} />
                            </IconButton>
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
                          color: "black",
                          ":hover": {
                            bgcolor: "#20ADA0",
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
                          <Typography key={index}>{notification}</Typography>
                        ))
                    )}
                    {readNotification.length > visibleNotifications && (
                      <Button onClick={handleViewMore}>View More</Button>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Popover>
        </Box>

        {/* <Avatar src="/static/images/avatar/2.jpg" /> */}
        {decodedToken()?.id ? (
          <Box className={styles.avatarContainer}>
            <IconButton className={styles.avatarButton}>
              <Avatar
                alt={capitalizeFirstLetter(decodedToken()?.patientName)}
                src={decodedToken()?.patientName}
                onClick={userPopover.handleOpen}
                ref={userPopover.anchorRef}
                sx={{ cursor: "pointer" }}
              />
            </IconButton>
            <UserPopover
              anchorEl={userPopover.anchorRef.current}
              onClose={userPopover.handleClose}
              open={userPopover.open}
            />
          </Box>
        ) : (
          <Button>
            <Link href="/signin" underline="none">
              SignUp / SignIn
            </Link>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
