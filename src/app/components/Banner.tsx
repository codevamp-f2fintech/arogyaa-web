import { Box, Button, CardContent, Grid, Paper, InputBase, Typography } from '@mui/material/';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import styles from '../page.module.css';
import styled from 'styled-components';


const HomeBanner = styled('div')(({ theme }) => ({
    marginTop: '65px',

    // backgroundImage: ' linear-gradient(to left, #95E1D0 , #40BA9D), url('../assets/images/icons8-circle-10.png')',
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    height: '90vh', // Adjust the height as needed

    padding: '50px',
    position: 'relative',
    borderRadius: '30px 30px 30px 0;',
    paddingTop: '90px',
    // background-image: linear-gradient(to right, red , yellow);
}));


const BannerCard1 = styled.div`
    background-color:rgba(255, 255, 255, 0.53);
    padding: 40px;
    border-radius: 10px;
    text-align: left;
  
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
const BannerCard2 = styled.div`
    background-color:rgba(212, 255, 232, 0.9);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    height:100%;
      border: 4px solid white;
      border-radius: 10px;
  
    /* Nesting styles for child elements */
    h1 {
      font-size: 24px;
      color: #000;
      margin-bottom: 10px;
    }
  
    p {
    font-size: 14px;
      color: #000;
      font-weight: 400;
      line-height: 20px;
      margin-bottom:20px;
    }`;

const BannerContent = styled.div`
     
      width: 850px;
      height: 300px;
    
    .banner_abs_text{
  position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      padding: initial;
    }
    .banner_abs_text span{
        background: #F9F6F6;
      padding:15px;
      border-radius: 1px 25px 5px 0px;
      font-size: 2.5rem;
      font-weight: bold;
      line-height: 2.5rem;
          border-radius: 1px 25px 5px 0px;}
    
    
    .banner_abs_text h4{
        background: #F9F6F6;
      padding: 15px;
      border-radius: 1px 25px 5px 0px;
      font-size: 2.5rem;
      font-weight: bold;
      line-height: 2.5rem;}
    
      `;

const BannerComponent = () => {
    return (
        <HomeBanner className={styles.homebanner}>
            <BannerContent>
                <Box
                    component="img"
                    sx={{

                        width: '48vw',
                        position: 'absolute',
                        right: '10px',
                        bottom: '0px'

                    }}
                    alt="The house from the offer."
                    src={'../assets/images/dr1.png'}
                />
                <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid xs={6}>

                        <BannerCard1>
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


                        </BannerCard1>

                    </Grid>
                </Grid>

                <CardContent className="banner_abs_text">
                    <Typography variant="h5" component="span" color='black'>
                        The Best Medical
                    </Typography>
                    <Typography variant="h4" component="h4" color='black'>
                        and Treatment Center For You
                    </Typography>
                </CardContent>

            </BannerContent>

        </HomeBanner>
    );
};

export default BannerComponent;
