import { Box, Grid, Paper, Typography } from '@mui/material';

import en from '@/locales/en.json';

const AboutUs: React.FC = () => {
    return (
        <Box sx={{
            textAlign: 'center',
            background: '#F9F6F6',
            paddingBottom: '40px',
            paddingTop: '80px'
        }}>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid xs={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <Box
                        component="img"
                        sx={{ width: '100%' }}
                        alt="The house from the offer."
                        src={'../assets/images/online-doctor-with-white-coat.png'}
                    />
                </Grid>
                <Grid xs={8} sx={{ textAlign: 'left' }}>
                    <Typography variant="h4" component="h4" sx={{
                        fontSize: '2.5rem',
                        color: 'black',
                        lineHeight: '4rem',
                        fontWeight: 600,
                    }}>
                        {en.homepage.aboutUs.title1}  <span style={{ color: '#20ADA0' }}>{en.homepage.aboutUs.title2}</span>
                    </Typography>
                    <Typography variant="h6" component="p" sx={{
                        fontSize: '1rem',
                        color: 'black',
                        lineHeight: '2rem',
                        fontWeight: 300,
                        marginTop: '10px',
                    }}>{en.homepage.aboutUs.description}
                    </Typography>

                    <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ marginTop: '50px' }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper sx={{
                                background: '#20ADA0',
                                padding: '20px',
                                borderRadius: '20px',
                                color: 'white',
                                boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h4" component="h4" sx={{ color: 'white', marginTop: '10px', marginBottom: '15px' }}>
                                    {en.homepage.aboutUs.cardTitle1}
                                </Typography>
                                <Typography variant="h6" component="p" sx={{ color: 'white', marginTop: '15px', marginBottom: '10px' }}>
                                    {en.homepage.aboutUs.cardDescription1}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper sx={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '20px',
                                color: 'black',
                                boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h4" component="h4" sx={{ color: 'black', marginTop: '10px', marginBottom: '15px' }}>
                                    {en.homepage.aboutUs.cardTitle2}
                                </Typography>
                                <Typography variant="h6" component="p" sx={{ color: 'black', marginTop: '15px', marginBottom: '10px' }}>
                                    {en.homepage.aboutUs.cardDescription2}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper sx={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '20px',
                                color: 'black',
                                boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h4" component="h4" sx={{ color: 'black', marginTop: '10px', marginBottom: '15px' }}>
                                    {en.homepage.aboutUs.cardTitle3}
                                </Typography>
                                <Typography variant="h6" component="p" sx={{ color: 'black', marginTop: '15px', marginBottom: '10px' }}>
                                    {en.homepage.aboutUs.cardDescription3}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AboutUs;
