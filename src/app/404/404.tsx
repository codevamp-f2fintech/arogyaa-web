import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import './error.css';
import Typography from '@mui/material/Typography';


const Error404 = () => {
  return (
    <div>
       <React.Fragment>
      <CssBaseline />
      <Container className='error-404' maxWidth="xl" sx={{
         display: 'flex',
         overflow: 'hidden',
        //  background:'linear-gradient(20deg,white,#2c3ce3)',
         height: '100vh'
      }}>
        <div className="circle">
          
        <img className='plug-img' src='./img/plug.png'/>
        <Typography variant="h2" component="h2" sx={{
          textAlign:'center',
          fontWeight:'bold',
          marginTop:'12vh',
          marginLeft:'-27vh',
          textWrap:'nowrap',
          fontSize:'50px'
        }}>
        404<br/> Page Not Found
        </Typography><Typography variant="h6" component="h6" sx={{
          textAlign:'center',
          fontWeight:'bold',
          marginTop:'12vh',
          marginLeft:'-22vh',
          textWrap:'nowrap',
          fontSize:'50px'
        }}>
        
        </Typography>
        <Typography variant="h6" component="h6" sx={{
          textAlign:'center',
          textWrap:'nowrap',
          marginTop:'35vh',
          marginLeft:'-46vh',
          fontSize:'16px'
          
        }}>
        We’re sorry,<br/> the page you have looked for does not exist in our website!
        </Typography>

        <img className='soket-img' src='./img/soket.png'/>
        
        </div>
        
        
        
      </Container>
    </React.Fragment>
    </div>
  )
}

export default Error404
