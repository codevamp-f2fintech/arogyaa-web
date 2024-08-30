import { Box, Grid, Paper, Typography } from '@mui/material/';
import styled from 'styled-components';


const AboutUS = styled(Box)`
  text-align:center;
  background:#F9F6F6;
  padding-bottom:40px;
  padding-top:80px;
 .abt_typogrphy h4{
 font-size:2.5rem;
 text-align:left;
 color:black;
 line-height:4rem;
 font-weight:600;
 }
 .abt_typogrphy p{
  font-size:1rem;
 text-align:left;
 color:black;
 line-height:2rem;
 font-weight:300;
 margin-top:10px;
 }
 .abt_typogrphy h4 span{
color:#20ADA0;
 }
.abt_typo_card{
background:white;
padding:20px;
border-radius:20px;
color:white;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
}
.abt_typo_card.green{
background:#20ADA0;
padding:20px;
color:white;
}
.abt_typo_card h4{
color:black;
text-align:center;
margin-top:10px;
margin-bottom:15px;
}
.abt_typo_card p{
color:black;
text-align:center;
margin-top:15px;
margin-bottom:10px;
}
.abt_typo_card.green h4{
color:white;
}
.abt_typo_card.green p{
color:white;
}
.abt_wraper_c{
margin-top:50px;
}
    `;

const AboutUs = () => {
    return (

        <AboutUS>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>

                <Grid xs={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <Box
                        component="img"
                        sx={{

                            width: '100%',


                        }}
                        alt="The house from the offer."
                        src={'../assets/images/online-doctor-with-white-coat.png'}
                    />
                </Grid>
                <Grid xs={8} className="abt_typogrphy">
                    <Typography variant="h4" component="h4" className='h1_section_title'>About<span> Arogya</span></Typography>
                    <Typography variant="h6" component="p" className='h1_section_title'>Arogya is the largest multi-channel digital healthcare platform in India, created with a vision of eliminating flexibility blockages from the healthcare industry. We believe in making healthcare affordable to everyone by combining analytic excellence, affordable cost, and extensive research with advanced technology.</Typography>

                    <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }} className="abt_wraper_c">
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper className="abt_typo_card green">
                                <Typography variant="h4" component="h4" className=''>15 +</Typography>
                                <Typography variant="h6" component="p" className=''>years of experianced Doctors</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper className="abt_typo_card ">
                                <Typography variant="h4" component="h4" className=''>50 +</Typography>
                                <Typography variant="h6" component="p" className=''>Specialities</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper className="abt_typo_card ">
                                <Typography variant="h4" component="h4" className=''>24x7</Typography>
                                <Typography variant="h6" component="p" className=''>Avialibility</Typography>
                            </Paper>
                        </Grid>

                    </Grid>


                </Grid>
            </Grid>
        </AboutUS>

    );
};

export default AboutUs;
