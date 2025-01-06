'use client';

import React from 'react';
import { CssBaseline, Container, Typography, Box, Button, useTheme, useMediaQuery } from '@mui/material';

const NotFoundPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isSmallScreen ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#edf7fd',
            borderRadius: '16px',
            padding: theme.spacing(4),
            boxShadow: 3,
            maxWidth: '800px',
            width: '90%',
          }}
        >
          {/* Left Side: Illustration */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: isSmallScreen ? theme.spacing(2) : 0,
            }}
          >
            <img
              src="./img/plug.png"
              alt="Plug Illustration"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Box>

          {/* Right Side: Text and Button */}
          <Box
            sx={{
              flex: 1,
              textAlign: isSmallScreen ? 'center' : 'left',
              paddingLeft: isSmallScreen ? 0 : theme.spacing(4),
            }}
          >
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: '#449ac8' }}>
              404<br /> Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ marginTop: theme.spacing(2), color: '#555' }}>
              The page you are looking for does not exist.
            </Typography>
            <Button
              href="/"
              variant="outlined"
              sx={{
                marginTop: theme.spacing(4),
                paddingX: theme.spacing(3),
                paddingY: theme.spacing(1.5),
                borderColor: '#449ac8',
                color: '#449ac8',
                '&:hover': {
                  borderColor: '#3171b8',
                  backgroundColor: 'rgba(68, 154, 200, 0.04)',
                },
              }}
            >
              Go Back Home
            </Button>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default NotFoundPage;
