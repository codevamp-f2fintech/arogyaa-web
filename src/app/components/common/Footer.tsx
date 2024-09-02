import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import AdbIcon from '@mui/icons-material/Adb';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { InputBase, Paper } from '@mui/material';

const Footer = () => {
    return (
        <>
            <Box sx={{
                marginTop: '50px',
                padding: '50px 0px',
                borderTop: '1px solid #dbdbdb',
                borderBottom: '1px solid #dbdbdb'
            }}>

                <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid xs={5} sx={{ textAlign: 'left', marginTop: '20px' }}>
                        <Box sx={{
                            '& h6': {
                                fontSize: '13px',
                                color: '#000',
                                lineHeight: '28px',
                                fontWeight: 300,
                                marginBottom: 0,
                                cursor: 'pointer',
                            }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AdbIcon sx={{ display: { xs: 'none', md: 'flex', color: '#20ADA0' }, mr: 1 }} />
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    href="#app-bar-with-responsive-menu"
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'none', md: 'flex' },
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: '#20ADA0',
                                        textDecoration: 'none',
                                    }}
                                >
                                    AROGYA
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="h4" sx={{ marginTop: '10px', marginBottom: '10px', color: 'black' }}>
                                The Best Medical
                                and Treatment Center For You
                            </Typography>
                            <Typography variant="h6" component="h6">
                                Arogya 2024
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid xs={2} sx={{ textAlign: 'left', marginTop: '20px' }}>
                        <h4 style={{
                            fontSize: '18px',
                            color: '#000',
                            lineHeight: '24px',
                            fontWeight: 700,
                            marginBottom: '10px',
                        }}>
                            Contact Us
                        </h4>
                        <Box sx={{
                            '& h6': {
                                fontSize: '13px',
                                color: '#000',
                                lineHeight: '28px',
                                fontWeight: 300,
                                marginBottom: 0,
                                cursor: 'pointer',
                            }
                        }}>
                            <Typography variant="h6" component="h6">
                                Opening hours: 09:00 - 20:00
                            </Typography>
                            <Typography variant="h6" component="h6">
                                Search for clinics
                            </Typography>
                            <Typography variant="h6" component="h6">
                                Search for hospitals
                            </Typography>
                            <Typography variant="h6" component="h6">
                                Read about medicines
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid xs={2} sx={{ textAlign: 'left', marginTop: '20px' }}>
                        <h4 style={{
                            fontSize: '18px',
                            color: '#000',
                            lineHeight: '24px',
                            fontWeight: 700,
                            marginBottom: '10px',
                        }}>
                            Pages
                        </h4>
                        <Box sx={{
                            '& h6': {
                                fontSize: '13px',
                                color: '#000',
                                lineHeight: '28px',
                                fontWeight: 300,
                                marginBottom: 0,
                                cursor: 'pointer',
                            }
                        }}>
                            <Typography variant="h6" component="h6">
                                Search for doctors
                            </Typography>
                            <Typography variant="h6" component="h6">
                                Search for clinics
                            </Typography>
                            <Typography variant="h6" component="h6">
                                Search for hospitals
                            </Typography>
                            <Typography variant="h6" component="h6">
                                Read about medicines
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid xs={3} sx={{ textAlign: 'left', marginTop: '20px' }}>
                        <h4 style={{
                            fontSize: '18px',
                            color: '#000',
                            lineHeight: '24px',
                            fontWeight: 700,
                            marginBottom: '10px',
                        }}>
                            Social
                        </h4>
                        <Box color={'white'}>
                            <InstagramIcon sx={{ marginRight: '15px', cursor: 'pointer', color: '#20ADA0' }} />
                            <FacebookIcon sx={{ margin: '0 15px', cursor: 'pointer', color: '#20ADA0' }} />
                            <XIcon sx={{ margin: '0 15px', cursor: 'pointer', color: '#20ADA0' }} />
                            <YouTubeIcon sx={{ margin: '0 15px', cursor: 'pointer', color: '#20ADA0' }} />
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}
                            >

                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Enter Email"
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                />


                            </Paper>
                            <Button variant="contained" sx={{ color: 'white', background: '#20ADA0', width: '100%', marginTop: '10px' }} >Subscribe</Button>
                        </Box>
                    </Grid>
                </Grid>


            </Box>
            <Box sx={{
                padding: '20px 0px',
                paddingBottom: '0px',
                background: 'inherit'
            }}>
                <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid xs={5} sx={{ textAlign: 'left', }}>
                        <Typography variant="body2" component="p" sx={{
                            fontSize: '14px',
                            color: 'gray',
                            lineHeight: '20px',
                            fontWeight: 300,
                            marginBottom: '10px',
                            cursor: 'pointer'
                        }}>
                            © Copyright 2024, All rights reserved with Arogya HealtCare
                        </Typography>
                    </Grid>
                    <Grid xs={7} sx={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body2" component="p" sx={{
                            marginRight: 3,
                            fontSize: '14px',
                            color: 'gray',
                            lineHeight: '20px',
                            fontWeight: 300,
                            marginBottom: '10px',
                            cursor: 'pointer',
                        }}>
                            Privacy Policy
                        </Typography>
                        <Typography variant="body2" component="p" sx={{
                            marginRight: 3,
                            fontSize: '14px',
                            color: 'gray',
                            lineHeight: '20px',
                            fontWeight: 300,
                            marginBottom: '10px',
                            cursor: 'pointer',
                        }}>
                            Terms & Conditions
                        </Typography>
                        <Typography variant="body2" component="p" sx={{
                            fontSize: '14px',
                            color: 'gray',
                            lineHeight: '20px',
                            fontWeight: 300,
                            marginBottom: '10px',
                            cursor: 'pointer',
                        }}>
                            FAQ
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Footer;