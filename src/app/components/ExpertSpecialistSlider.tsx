import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import { Box, Button, Grid, Paper, Typography } from '@mui/material';

import en from '@/locales/en.json';

const ExpertSpecialistSlider: React.FC = () => {
    return (
        <Box sx={{
            paddingTop: '50px', paddingBottom: '50px'
        }}>
            <Box sx={{
                marginBottom: '30px'
            }}>
                <Typography variant="h5" component="h5" sx={{
                    fontSize: '1rem',
                    color: '#20ADA0',
                    fontWeight: '700',
                    textAlign: 'center'
                }}>
                    {en.homepage.expertSpecialistSlider.title1}
                </Typography>
                <Typography variant="h2" component="h2" sx={{
                    fontSize: '2.5rem',
                    color: 'black',
                    fontWeight: '700',
                    textAlign: 'center'
                }}>
                    {en.homepage.expertSpecialistSlider.title2}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Paper sx={{
                        //abt_typo_card starts here
                        height: '245px',
                        textAlign: 'center',
                        padding: '30px',
                        borderRadius: '30px'
                    }}>
                        <Box component="img" sx={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '100%',
                            background: '#20ada0',
                            margin: '0 auto',
                        }}
                            alt="The house from the offer."
                            src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
                        />
                        <Typography variant="h4" component="h4" sx={{
                            fontSize: '1.2rem',
                            color: '#20ADA0',
                            fontWeight: 'bold',
                            marginTop: '5px',
                            marginBottom: '5px',
                        }}>{en.homepage.expertSpecialistSlider.drName}</Typography>
                        <Typography variant="h6" component="h6" sx={{
                            fontSize: '0.9rem',
                            color: '#000',
                            fontWeight: '600',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>{en.homepage.expertSpecialistSlider.field}</Typography>
                        <Typography variant="h6" component="p" sx={{
                            fontSize: '0.8rem',
                            color: '#000',
                            fontWeight: '300',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>{en.homepage.expertSpecialistSlider.experiance}</Typography>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" sx={{
                            marginTop: 2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius: '100px',
                            ':hover': {
                                bgcolor: '#20ADA0', // theme.palette.primary.main
                                color: 'white',
                            },
                        }} endIcon={<ArrowCircleRightIcon />}>{en.homepage.expertSpecialistSlider.buttonText}</Button>
                    </Box>
                </Grid>

                <Grid item xs>
                    <Paper sx={{
                        height: '315px',
                        textAlign: 'center',
                        padding: '30px',
                        borderRadius: '30px',
                    }}>
                        <Box component="img" sx={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: '#20ada0',
                            margin: '0 auto',
                        }}
                            alt="The house from the offer."
                            src={'/assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
                        />
                        <Typography variant="h4" component="h4" sx={{
                            fontSize: '1.2rem',
                            color: '#20ADA0',
                            fontWeight: 'bold',
                            marginTop: '5px',
                            marginBottom: '5px',
                        }}>
                            {en.homepage.expertSpecialistSlider.drName}
                        </Typography>
                        <Typography variant="h6" component="h6" sx={{
                            fontSize: '0.9rem',
                            color: '#000',
                            fontWeight: '600',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>
                            {en.homepage.expertSpecialistSlider.field}
                        </Typography>
                        <Typography variant="h6" component="p" sx={{
                            fontSize: '0.8rem',
                            color: '#000',
                            fontWeight: '300',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>
                            {en.homepage.expertSpecialistSlider.experiance}<br />
                            {en.homepage.expertSpecialistSlider.randomText}  <br />
                            {en.homepage.expertSpecialistSlider.randomText}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs>
                    <Paper sx={{
                        height: '315px',
                        textAlign: 'center',
                        padding: '30px',
                        borderRadius: '30px',
                    }}>
                        <Box component="img" sx={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: '#20ada0',
                            margin: '0 auto',
                        }}
                            alt="The house from the offer."
                            src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
                        />
                        <Typography variant="h4" component="h4" sx={{
                            fontSize: '1.2rem',
                            color: '#20ADA0',
                            fontWeight: 'bold',
                            marginTop: '5px',
                            marginBottom: '5px',
                        }}>
                            {en.homepage.expertSpecialistSlider.drName}
                        </Typography>
                        <Typography variant="h6" component="h6" sx={{
                            fontSize: '0.9rem',
                            color: '#000',
                            fontWeight: '600',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>
                            {en.homepage.expertSpecialistSlider.field}
                        </Typography>
                        <Typography variant="h6" component="p" sx={{
                            fontSize: '0.8rem',
                            color: '#000',
                            fontWeight: '300',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>
                            {en.homepage.expertSpecialistSlider.experiance}<br />
                            {en.homepage.expertSpecialistSlider.randomText} <br />
                            {en.homepage.expertSpecialistSlider.randomText}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs>
                    <Paper sx={{
                        height: '315px',
                        textAlign: 'center',
                        padding: '30px',
                        borderRadius: '30px'
                    }}>
                        <Box component="img" sx={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: '#20ada0',
                            margin: '0 auto',
                        }}
                            alt="The house from the offer."
                            src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
                        />
                        <Typography variant="h4" component="h4" sx={{
                            fontSize: '1.2rem',
                            color: '#20ADA0',
                            fontWeight: 'bold',
                            marginTop: '5px',
                            marginBottom: '5px',
                        }}>
                            {en.homepage.expertSpecialistSlider.drName}
                        </Typography>
                        <Typography variant="h6" component="h6" sx={{
                            fontSize: '0.9rem',
                            color: '#000',
                            fontWeight: '600',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}>
                            {en.homepage.expertSpecialistSlider.field}
                        </Typography>
                        <Typography variant="h6" component="p" sx={{
                            fontSize: '0.8rem',
                            color: '#000',
                            fontWeight: '300',
                            marginTop: '20px',
                            marginBottom: '10px',
                        }}>
                            {en.homepage.expertSpecialistSlider.experiance}<br />
                            {en.homepage.expertSpecialistSlider.randomText} <br />
                            {en.homepage.expertSpecialistSlider.randomText}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ExpertSpecialistSlider;
