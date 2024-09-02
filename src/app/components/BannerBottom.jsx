import { Box, Button, InputBase, CardContent, Grid, Paper, Typography } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import styles from '../page.module.css';

const BannerBottom = () => {
    return (
        <Box
            sx={{
                paddingTop: '50px',
                paddingBottom: '50px',
                marginTop: '100px',
                borderRadius: '30px',
                position: 'relative',
                backgroundColor: '#F9F6F6'
            }}
            className={styles.banner2}
        >
            <Box
                component="img"
                sx={{
                    width: '48vw',
                    position: 'absolute',
                    left: '10px',
                    bottom: '0px',
                }}
                alt="Doctor"
                src="/assets/images/doctor-with-his-arms-crossed-white-background.png"
            />
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ height: '100%' }}>
                <Grid item xs={6}></Grid>
                <Grid
                    item xs={6}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        position: 'relative',
                    }}
                >
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            marginTop: '-66px',
                            marginRight: '-16px',
                            background: '#F9F6F6',
                            borderRadius: '0 0 0 25px',
                            padding: '15px',
                        }}
                    >
                        <Typography variant="h5" component="span" sx={{
                            background: '#F9F6F6',
                            padding: '10px',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            lineHeight: '1.5rem',
                            borderRadius: '1px 25px 5px 0px',
                            color: 'black'
                        }}>
                            Make your health a priority
                        </Typography>
                        <Typography variant="h4" component="h4" sx={{
                            background: '#F9F6F6',
                            padding: '6px',
                            borderRadius: '1px 25px 5px 0px',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            lineHeight: '2.5rem',
                            color: 'black'
                        }}>
                            Don&apos;t Overlook it
                        </Typography>
                    </CardContent>

                    <Button
                        variant="contained"
                        sx={{
                            position: 'absolute',
                            right: '580px',
                            top: '40px',
                            width: '23%',
                            color: '#20ADA0',
                            backgroundColor: '#fff',
                            ':hover': {
                                bgcolor: '#20ADA0',
                                color: 'white',
                            },
                        }}
                        endIcon={<ArrowCircleRightIcon />}
                    >
                        Book online
                    </Button>

                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.53)',
                            padding: '40px',
                            borderRadius: '10px',
                            textAlign: 'left',
                            maxWidth: '400px',
                            marginRight: '40px',
                        }}
                    >
                        <h1 style={{
                            fontSize: '32px',
                            lineHeight: '48px',
                            color: '#000',
                            marginBottom: '10px',
                        }}>Request a Call</h1>
                        <p style={{
                            fontSize: '14px',
                            color: '#000',
                            fontWeight: '400',
                            lineHeight: '20px'
                        }}
                        >
                            You can simply order a call and we will help you make an appointment with the right specialist.
                        </p>
                        <Paper
                            component="form"
                            sx={{
                                p: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: 3,
                            }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Name"
                                inputProps={{ 'aria-label': 'Name' }}
                            />
                        </Paper>
                        <Paper
                            component="form"
                            sx={{
                                p: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: 3,
                            }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Phone Number"
                                inputProps={{ 'aria-label': 'Phone Number' }}
                            />
                        </Paper>
                        <Box sx={{ flex: 1, marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    width: '100%',
                                    color: '#20ADA0',
                                    backgroundColor: '#fff',
                                    ':hover': {
                                        bgcolor: '#20ADA0',
                                        color: 'white',
                                    },
                                }}
                                endIcon={<ArrowCircleRightIcon />}
                            >
                                Send Request
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
};

export default BannerBottom;
