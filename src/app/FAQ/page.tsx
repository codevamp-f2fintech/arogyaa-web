import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';

import FAQs from '../components/FAQ';

const SimpleContainer: React.FC= ()=> {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{
          display: 'flex',
          backgroundColor: '#449AC8',
          color: 'white',
          marginTop: '-13vh'
        }}>
          <Box sx={{
            flex: '0 0 54%',
            paddingLeft: '25vh',
            paddingTop: '25vh'
          }}>
            <Typography variant="h2" sx={{
              fontWeight: 'bold'
            }} >
              FAQs
            </Typography>
            <Typography>
              Have a question? Here you will find the answers most valued by <br />our partners.
              along with access to step-by-step instructions<br /> and support.
            </Typography>
          </Box>
          <Box sx={{
            flex: '0 0 46%',
          }}>
            <img src='./img/faq-img.png' style={{ height: '80vh' }} />
          </Box>
        </Box>
        <Box sx={{
          display: 'flex'
        }}>
          <Box sx={{
            flex: '0 0 40%',
            marginTop: '10vh',
            paddingLeft: '20vh'
          }}>
            <a href='' style={{ textDecoration: 'none', color: '#449AC8', fontWeight: 'bold', lineHeight: '32px' }}>About us</a><br />
            <a href='' style={{ textDecoration: 'none', color: '#449AC8', fontWeight: 'bold', lineHeight: '32px' }}>Guest relations</a><br />
            <a href='' style={{ textDecoration: 'none', color: '#449AC8', fontWeight: 'bold', lineHeight: '32px' }}>One key</a><br />
            <a href='' style={{ textDecoration: 'none', color: '#449AC8', fontWeight: 'bold', lineHeight: '32px' }}>Property listing</a><br />
            <a href='' style={{ textDecoration: 'none', color: '#449AC8', fontWeight: 'bold', lineHeight: '32px' }}>ranking and metrics</a><br />
            <a href='' style={{ textDecoration: 'none', color: '#449AC8', fontWeight: 'bold', lineHeight: '32px' }}>Reservations and rates</a>
          </Box>
          <Box sx={{
            flex: '0 0 60%',
            paddingRight: '10vh'
          }}>
            <Typography variant='h5' sx={{
              fontWeight: 'bold',
              marginBottom: '-1vh',
              marginTop: '7vh'
            }}>
              About Us
            </Typography>
            <FAQs />
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}
export default SimpleContainer;