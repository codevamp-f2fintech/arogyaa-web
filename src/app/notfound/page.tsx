import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';

const Error404: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container className='error-404' maxWidth="xl" sx={{
        display: 'flex',
        overflow: 'hidden',
        height: '100vh'
      }}>
        <Box sx={{
          display: "flex",
          width: "500px",
          height: "500px",
          backgroundColor: "#edf7fd",
          borderRadius: "50%",
          marginLeft: "60vh",
          marginTop: "10vh",
          color: "#449ac8"
        }}>
          <img style={{ maxHeight: '30vh', marginLeft: '-25vh', marginTop: '47vh' }} src='./img/plug.png' />
          <Typography variant="h2" component="h2" sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: '12vh',
            marginLeft: '-27vh',
            textWrap: 'nowrap',
            fontSize: '50px'
          }}>
            404<br /> Page Not Found
          </Typography><Typography variant="h6" component="h6" sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: '12vh',
            marginLeft: '-22vh',
            textWrap: 'nowrap',
            fontSize: '50px'
          }}>
          </Typography>
          <Typography variant="h6" component="h6" sx={{
            textAlign: 'center',
            textWrap: 'nowrap',
            marginTop: '35vh',
            marginLeft: '-46vh',
            fontSize: '16px'
          }}>
            We’re sorry,<br /> the page you have looked for does not exist in our website!
          </Typography>
          <img style={{ maxHeight: '20vh', marginLeft: '-25vh', marginTop: '50vh' }} src='./img/soket.png' />
          <Button href='/' style={{ marginLeft: '-459px', marginTop: '70vh', height: '7vh' }} variant="outlined">Go back to home</Button>
        </Box>
      </Container>
    </React.Fragment>
  )
}
export default Error404;
