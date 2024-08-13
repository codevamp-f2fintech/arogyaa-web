import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Timer from '../components/Timer';




export default function Maintenance() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl" sx={{
        backgroundColor:'#449ac8',
        height:'100vh',
        overflow:'hidden'
      }}>
        <Box sx={{ maxWidth: 875 , maxHeight:700, marginLeft:'30vh', marginTop:'5vh',boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;'}}>
        <Card variant="outlined">
        <Typography variant="h2" component="h2" sx={{
            textAlign:'center',
            paddingTop:'10vh',
            fontWeight:'bold',
            
            
        }}>
            We're taking time out for <br/>Maintenance
        </Typography>
        <Typography variant="h6" component="h2" sx={{
            textAlign:'center',
        }}>
            We hope to be back soon
        </Typography>
        <Timer/>
        <img style={{marginLeft:'70vh', height:'50vh',marginTop:'-20vh',marginRight:'-10vh'}} src='./img/maintainance.png'></img>
        </Card>
        </Box>
      </Container>
    </React.Fragment>
  );
}
