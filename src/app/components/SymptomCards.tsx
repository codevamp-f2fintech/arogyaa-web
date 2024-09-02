import { Box, Button, CardMedia, CardContent, Grid, Paper, Typography } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import { symptomsList } from "@/data";

const SymptomCards = () => {
    return (
        <Box sx={{
            textAlign: 'center',
            backgroundColor: '#F9F6F6',
            borderRadius: '0 0 50% 50%',
            padding: '50px 20px',
        }}>
            <Typography variant="h2" component="h2" sx={{
                fontSize: '2.5rem',
                color: '#000',
                lineHeight: '40px',
                fontWeight: '700',
                marginTop: '20px',
                marginBottom: '40px',
                textAlign: 'center',
            }}>
                <span style={{
                    fontSize: '1rem', color: '#20ADA0'
                }}>Common</span>
                <br />
                Health Concerns </Typography>

            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                {symptomsList.map((item, index) => (
                    <Grid xs={3} sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        // border: '2px solid black'
                    }}
                        key={index}
                    >
                        <Paper sx={{
                            padding: 2, borderRadius: '30px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
                            background: 'white',
                            // border:'2px solid black',
                            color: 'white',
                            boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'
                        }}>
                            <CardMedia
                                component="img"
                                sx={{ borderRadius: 100, overflow: 'hidden', width: '100px', height: '100px', border: '3px solid white' }}
                                image={item.image}
                                alt={item.title}
                            />
                            <CardContent>
                                <Typography variant="h5" component="h5" sx={{
                                    fontSize: '16px',
                                    color: '#000',
                                    lineHeight: '20px',
                                    fontWeight: '700',
                                    marginTop: '10px',
                                    marginBottom: '10px'
                                }}>
                                    {item.title}
                                </Typography>


                                <Button variant="contained" sx={{
                                    marginTop: 2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius: '100px',
                                    ':hover': {
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
                    <Button variant="contained" sx={{
                        color: 'white',
                        background: '#20ADA0',
                        ':hover': {
                            bgcolor: '#20ADA0',
                            color: 'white',
                        },
                    }} endIcon={<ArrowCircleRightIcon />}>See All Symptoms</Button>
                </Grid>
            </Grid>
        </Box >
    );
};

export default SymptomCards;
