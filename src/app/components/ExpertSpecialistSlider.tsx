import { Box, Button, Grid, Paper, Typography } from '@mui/material/';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import styled from 'styled-components';

const MeetSpecialitiest = styled(Box)`
padding-top:50px;
padding-bottom:50px;
    .met_title{
    margin-bottom:30px;
    }
    .met_title h2{
    font-size:2.5rem;
    color:black;
    font-weight:700;
text-align:center;
    }
    .met_title h5{
       font-size:1rem;
    color:#20ADA0;
    font-weight:700; 
    text-align:center;
    }
    .dr_cir_canv{
        width: 100px;
    height: 100px;
    border-radius: 100%;
    background: #20ada0;}
    .abt_typo_card{
    text-align:center;
    padding:30px;
    }
    .abt_typo_card {
    border-radius:30px;}
    .abt_typo_card h6{
           font-size:1rem;
    color:#20ADA0;
    font-weight:500; 
    }
    .abt_typo_card .t1{
    font-size:1.2rem;
    color:#20ADA0;
    font-weight:bold;
    margin-top:5px;
    margin-bottom:5px; 
    }
    .abt_typo_card .t2{
       font-size:.9rem;
    color:#000;
    font-weight:600; 
        margin-top:10px;
    margin-bottom:10px; 
    }
    .abt_typo_card .t3{
      font-size:.8rem;
    color:#000;
    font-weight:300; 
       margin-top:10px;
    margin-bottom:10px; 
    }
    `;

const ExpertSpecialistSlider = () => {
    return (

        <MeetSpecialitiest className="met_sp_container">

            <Box className="met_title">
                <Typography variant="h5" component="h5">
                    Meet Our
                </Typography>
                <Typography variant="h2" component="h2">
                    Expert Specialist
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Paper className="abt_typo_card" sx={{ height: '245px' }}>
                        <Box component="img" sx={{ width: '100%', }} className="dr_cir_canv"
                            alt="The house from the offer."
                            src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
                        />
                        <Typography variant="h4" component="h4" className='t1'>Dr. Nidhi</Typography>
                        <Typography variant="h6" component="h6" className='t2'>Physician</Typography>
                        <Typography variant="h6" component="p" className='t3'>15 years of experiance</Typography>

                    </Paper>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" sx={{
                            marginTop: 2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius: '100px', ':hover': {
                                bgcolor: '#20ADA0', // theme.palette.primary.main
                                color: 'white',
                            },
                        }} endIcon={<ArrowCircleRightIcon />}>See All Doctors</Button>
                    </Box>
                </Grid>
                <Grid item xs>
                    <Paper className="abt_typo_card green" sx={{ height: '315px' }}>
                        <Box component="img" sx={{ width: '100%', }} className="dr_cir_canv"
                            alt="The house from the offer."
                            src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
                        />
                        <Typography variant="h4" component="h4" className='t1'>Dr. Nidhi</Typography>
                        <Typography variant="h6" component="h6" className='t2'>Physician</Typography>
                        <Typography variant="h6" component="p" className='t3'>15 years of experiance<br />
                            Lorem Ipsum <br />
                            Lorem Ipsum
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className="abt_typo_card green" sx={{ height: '315px' }}>
                        <Box component="img" sx={{ width: '100%', }} className="dr_cir_canv"
                            alt="The house from the offer."
                            src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
                        />
                        <Typography variant="h4" component="h4" className='t1'>Dr. Nidhi</Typography>
                        <Typography variant="h6" component="h6" className='t2'>Physician</Typography>
                        <Typography variant="h6" component="p" className='t3'>15 years of experiance<br />
                            Lorem Ipsum <br />
                            Lorem Ipsum
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className="abt_typo_card green" sx={{ height: '315px' }}>
                        <Box component="img" sx={{ width: '100%', }} className="dr_cir_canv"
                            alt="The house from the offer."
                            src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
                        />
                        <Typography variant="h4" component="h4" className='t1' >Dr. Nidhi</Typography>
                        <Typography variant="h6" component="h6" className='t2'>Physician</Typography>
                        <Typography variant="h6" component="p" className='t3' sx={{ marginTop: '20px' }}>15 years of experiance<br />
                            Lorem Ipsum <br />
                            Lorem Ipsum
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

        </MeetSpecialitiest>
    );
};

export default ExpertSpecialistSlider;
