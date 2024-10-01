"use client";

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import en from '@/locales/en.json';
import { AppDispatch, RootState } from '@/redux/store';
import { useGetNotifications } from '@/hooks/notification';
import { setNotifications } from '@/redux/features/notificationsSlice';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Topbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = React.useState(0); // State for tab selection
  const [readNotification, setReadNotification] = React.useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.notifications);

  //fetch api
  const { data } = useGetNotifications([], `http://localhost:3001/api/notifications/get-notifications/60d9caed6f70c40b7cdcb867`);

  console.log('data:', data); // Inspect the structure of the response
  let dataArray = Array.isArray(data) ? data : [data];

  React.useEffect(() => {
    if (dataArray && dataArray.length > 0) {
      dispatch(setNotifications(dataArray));
      console.log('working')
    }
  }, [data, dispatch]);
  console.log(notifications);



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
  const [visibleNotifications, setVisibleNotifications] = React.useState(5);

  const markAsRead = (index: number) => {
    const notificationToMove = notifications[index];
    setReadNotification((prev) => [...prev, notificationToMove.message]);

    const newUnreadNotifications = notifications.filter((_, i) => i !== index);
    dispatch(setNotifications(newUnreadNotifications));
  };
  const handleViewMore = () => {
    setVisibleNotifications(prev => prev + 5);
  };


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <AppBar sx={{ bgcolor: "#fff", padding: '0px 50px' }}>
      <Toolbar disableGutters>
        <AdbIcon sx={{ display: { xs: 'none', md: 'flex', color: '#000' }, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: '#000',
            textDecoration: 'none',
          }}
        >
          {en.topbar.title}
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none', } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none', justifyContent: 'center' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography textAlign="center" sx={{ color: '#000' }}>{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          LOGO
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'center' } }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'black', display: 'block' }}
            >
              {page}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 0, marginRight: '10px' }}>
          <Button variant="contained" sx={{
            color: '#000', backgroundColor: '#FAFAFA', width: '100%', borderRadius: 100, ':hover': {
              bgcolor: '#20ADA0', // theme.palette.primary.main
              color: 'white',
            },
          }} endIcon={<ArrowCircleRightIcon />}>{en.topbar.appointment}</Button>
        </Box>

        <Box>
          <IconButton aria-describedby={id} onClick={handleClick} sx={{
            color: '#000', backgroundColor: '#FAFAFA', padding: '10px', borderRadius: '500px', margin: '0 10px 0 5px', ':hover': {
              bgcolor: '#20ADA0',
              color: 'white',
            },
          }}>
            <NotificationsIcon sx={{ color: 'black' }} />
          </IconButton>
          <Popover
            anchorReference="anchorPosition"
            anchorPosition={{ top: 0, left: 700 }}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            sx={{ borderRadius: 'px' }}
          >
            <Box sx={{ width: 400, }}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" textColor="#20ADA0" indicatorColor="black">
                <Tab label="Unread" sx={{ color: "#20ADA0" }} />
                <Tab label="Read" sx={{ color: "#20ADA0" }} />
              </Tabs>
              <Box sx={{ p: 2 }}>
                {tabValue === 0 ? (
                  <Box>
                    {notifications.length === 0 ? (
                      <Typography>No unread Notifications</Typography>
                    ) : (
                      notifications.slice(0, visibleNotifications).map((notification, index) => (
                        <Typography key={index}>
                          {notification.message}
                          <IconButton onClick={() => markAsRead(index)}>
                            <MarkEmailReadIcon sx={{ color: "#20ADA0" }} />
                          </IconButton>
                        </Typography>
                      ))
                    )}

                    {notifications.length > visibleNotifications && (
                      <Button onClick={handleViewMore} sx={{
                        color: "black",
                        ":hover": {
                          bgcolor: "#20ADA0"
                        }
                      }}>View More</Button>
                    )}
                  </Box>
                ) : (
                  <Box>
                    {readNotification.length === 0 ? (
                      <Typography>No read notifications.</Typography>
                    ) : (
                      readNotification.slice(0, visibleNotifications).map((notification, index) => (
                        <Typography key={index}>
                          {notification}
                        </Typography>
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

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
function setPageSize(arg0: (prevSize: any) => any) {
  throw new Error('Function not implemented.');
}

