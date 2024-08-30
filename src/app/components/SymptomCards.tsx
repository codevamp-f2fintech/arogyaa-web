import { Box, Button, CardMedia, CardContent, Grid, Paper, Typography } from '@mui/material/';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import styled from 'styled-components';

import { symptomsList } from "@/data";

const Symptoms = styled(Box)`
 text-align:center;
    // background-image: url(../assets/images/icy-medical-checkup.png);
    // background-repeat: no-repeat;
    // background-size: 50%;
    // background-position: center;
    background-color: #F9F6F6;
    border-radius: 0 0 50% 50%;

h5{
  font-size: 16px;
  color: #000;
  line-height:20px;
  font-weight: 700;
  margin-top:10px;
  margin-bottom:10px;
}
      h2.h1_section_title{
        font-size: 2.5rem;
    color: #000;
    line-height: 40px;
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 40px;
    text-align: center;}
  
      h2.h1_section_title .title_span{
        font-size: 1rem;
    color: #20ADA0;
  }
  `;

const SymptomCards = () => {
    return (
        <Symptoms>
            <Typography variant="h2" component="h2" className='h1_section_title'><span className='title_span'>Common</span><br /> Health Concerns </Typography>

            <Grid container spacing={4} columns={{ xs: 4, sm: 8, md: 12 }}>
                {symptomsList.map((item, index) => (
                    <Grid xs={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}
                        key={index}
                    >
                        <Paper className="abt_typo_card" sx={{ padding: 2, borderRadius: '30px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <CardMedia
                                component="img"
                                sx={{ borderRadius: 100, overflow: 'hidden', width: '100px', height: '100px', border: '3px solid white' }}
                                image={item.image}
                                alt={item.title}
                            />
                            <CardContent>
                                <Typography variant="h5" component="h5">
                                    {item.title}
                                </Typography>


                                <Button variant="contained" sx={{
                                    marginTop: 2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius: '100px', ':hover': {
                                        bgcolor: '#20ADA0', // theme.palette.primary.main
                                        color: 'white',
                                    },
                                }} endIcon={<ArrowCircleRightIcon />}>{item.Consult}</Button>
                            </CardContent>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>

                <Grid xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button variant="contained" sx={{ color: 'white', background: '#20ADA0' }} endIcon={<ArrowCircleRightIcon />}>See All Symptoms</Button>
                </Grid>
            </Grid>
        </Symptoms>

    )
};

export default SymptomCards;
