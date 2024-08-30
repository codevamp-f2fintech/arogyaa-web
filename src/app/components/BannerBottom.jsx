import { Box, Button, InputBase, CardContent, Grid, Paper, Typography } from '@mui/material/';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import styled from 'styled-components';

import styles from '../page.module.css';

const HealthPriority = styled(Box)`
padding-top:50px;
padding-bottom:50px;
margin-top:100px;
border-radius:30px;
     .banner2_c_title{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: -66px;
    margin-right: -16px;
  }
  .banner2_c_title span{
      background: #F9F6F6;
    padding:15px;
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 2.5rem;
       border-radius:  0px 0px 0px 25px}
  
  
  .banner2_c_title h4{
      background: #F9F6F6;
    padding: 15px;
  border-radius: 0px 0px 0px 25px;
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 2.5rem;}
  
    `;

const Banner2Card = styled.div`
background-color:rgba(255, 255, 255, 0.53);
padding: 40px;
border-radius: 10px;
text-align: left;
max-width:400px;
margin-right:40px;

/* Nesting styles for child elements */
h1 {
  font-size: 32px;
  line-height:48px;
  color: #000;
  margin-bottom: 10px;
}
h2 {
  font-size: 24px;
  line-height:26px;
  color: #000;
  margin-top: 20px;
  margin-bottom: 30px;
}

p {
  font-size: 14px;
  color: #000;
  font-weight: 400;
  line-height: 20px;
}`;

const BannerBottom = () => {
    return (

        <HealthPriority className={styles.banner2}>

            <Box
                component="img"
                sx={{

                    width: '48vw',
                    position: 'absolute',
                    left: '10px',
                    bottom: '0px'

                }}
                alt="The house from the offer."
                src={'../assets/images/doctor-with-his-arms-crossed-white-background.png'}
            />
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ height: '100%' }}>
                <Grid xs={6}></Grid>
                <Grid xs={6} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'flex-end' }} >

                    <CardContent className="banner2_c_title">
                        <Typography variant="h5" component="span">
                            Make your health a priority
                        </Typography>
                        <Typography variant="h4" component="h4">
                            Don&apos;t Overlook it
                        </Typography>

                    </CardContent>
                    <Button variant="contained" sx={{
                        position: 'absolute',
                        right: '374px',
                        top: '86px',
                        width: 'auto', color: '#20ADA0', background: '#fff', ':hover': {
                            bgcolor: '#20ADA0', // theme.palette.primary.main
                            color: 'white',
                        },
                    }} endIcon={<ArrowCircleRightIcon />}>Book online</Button>
                    <Banner2Card>
                        <h1>Request a Call</h1>
                        {/* <h2> Restoring Your Health</h2> */}
                        <p>You can simplyfy order a call and we will help you make an appointment with right specialist.</p>
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}
                        >

                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Name"
                                inputProps={{ 'aria-label': 'search google maps' }}
                            />
                        </Paper>
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}
                        >

                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Phone Number"
                                inputProps={{ 'aria-label': 'search google maps' }}
                            />
                        </Paper>

                        <Box sx={{ flex: 1, marginTop: '20px' }}>

                            <Button variant="contained" sx={{
                                width: '100%', color: '#20ADA0', background: '#fff', ':hover': {
                                    bgcolor: '#20ADA0', // theme.palette.primary.main
                                    color: 'white',
                                },
                            }} endIcon={<ArrowCircleRightIcon />}>Send Request</Button>
                        </Box>


                    </Banner2Card>

                </Grid>


            </Grid>


        </HealthPriority>
    );
};

export default BannerBottom;
