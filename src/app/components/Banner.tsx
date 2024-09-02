import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import { Box, Button, CardContent, Grid, Paper, InputBase, Typography } from '@mui/material';

import styles from '../page.module.css';

const BannerComponent: React.FC = () => {
    return (
        <div className={styles.homebanner} style={{
            marginTop: '65px',
            height: '90vh',
            padding: '50px',
            position: 'relative',
            borderRadius: '30px 30px 30px 0',
            paddingTop: '90px'
        }}>
            <div style={{ width: '850px', height: '300px' }}>
                <Box
                    component="img"
                    sx={{
                        width: '48vw',
                        position: 'absolute',
                        right: '10px',
                        bottom: '0px'
                    }}
                    alt="The house from the offer."
                    src={'/assets/images/dr1.png'}
                />
                <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid xs={6}>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.53)',
                            padding: '40px',
                            borderRadius: '10px',
                            textAlign: 'left'
                        }}>
                            <h1 style={{
                                fontSize: '32px',
                                lineHeight: '48px',
                                color: '#000',
                                marginBottom: '10px',
                            }}>Request a Call</h1>
                            {/* <h2 style={{
                              fontSize: '24px',
                                lineHeight: '26px',
                                color: '#000',
                                marginTop: '20px',
                                marginBottom: '30px',
                            }}> Restoring Your Health</h2> */}
                            <p style={{
                                fontSize: '14px',
                                color: '#000',
                                fontWeight: '400',
                                lineHeight: '20px'
                            }}>You can simplyfy order a call and we will help you make an appointment with right specialist.</p>
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Name"
                                    inputProps={{ 'aria-label': 'name' }}
                                />
                            </Paper>
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Phone Number"
                                    inputProps={{ 'aria-label': 'phone number' }}
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
                        </div>
                    </Grid>
                </Grid>

                <CardContent sx={{
                    position: 'absolute',
                    bottom: -28,
                    left: 0,
                    zIndex: 1,
                    padding: 'initial'
                }}>
                    <Typography variant="h5" component="span" sx={{
                        background: '#F9F6F6',
                        padding: '15px',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        lineHeight: '2.5rem',
                        borderRadius: '1px 25px 5px 0px',
                        color: 'black'
                    }}>
                        The Best Medical
                    </Typography>
                    <Typography variant="h4" component="h4" sx={{
                        background: '#F9F6F6',
                        padding: '15px',
                        borderRadius: '1px 25px 5px 0px',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        lineHeight: '2.5rem',
                        color: 'black'
                    }}>
                        and Treatment Center For You
                    </Typography>
                </CardContent>
            </div>
        </div>
    );
};

export default BannerComponent;
