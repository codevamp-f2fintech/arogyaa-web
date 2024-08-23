"use client";
import styles from './page.module.css';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Grid from '@mui/material/Unstable_Grid2';
import styled from 'styled-components';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useState } from "react";
import { InputBase, Paper } from '@mui/material';
const Footersection = styled(Box)`
padding:50px 0px;
margin-top:150px;
border-top:1px solid #dbdbdb;
border-bottom:1px solid #dbdbdb;
h4.ftr_list_menu{
  font-size: 18px;
    color: #000;
    line-height:24px;
    font-weight: 700;
    margin-bottom:10px;
}
`;
const FooterList = styled(Box)`
h6{
  font-size: 13px;
    color: #000;
    line-height:28px;
    font-weight: 300;
    margin-bottom:0px;
    cursor:pointer;
}
    .social_icon{
    color:white;
    }
`;
const Copyright = styled(Box)`
padding:20px 0px;
padding-bottom:0px;
background:inherit;
// border-top:1px solid dbdbdb;
p{
  font-size: 14px;
    color: gray;
    line-height:20px;
    font-weight: 300;
    margin-bottom:10px;
    cursor:pointer;
}
`;
function Footer() {

    return (
        <>
            <Footersection sx={{ marginTop:'50px'}}>
              
                    <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>

                        <Grid xs={5} sx={{ textAlign: 'left', marginTop: '20px' }}>
                          
                            <FooterList>
                                <Box sx={{display:'flex', alignItems:'center'}}>
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
                                <Typography variant="h4" component="h4" sx={{marginTop:'10px', marginBottom:'10px'}}>
                                The Best Medical
                                and Treatment Center For You
                                </Typography>
                                <Typography variant="h6" component="h6">
                                   Arogya 2024
                                </Typography>
                               

                            </FooterList>
                        </Grid>
                      
                        <Grid xs={2} sx={{ textAlign: 'left', marginTop: '20px' }}>
                            <Typography variant="h4" component="h4" className='ftr_list_menu'>
                                Contact Us
                            </Typography>
                            <FooterList>
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
                            </FooterList>
                        </Grid>
                      
                        <Grid xs={2} sx={{ textAlign: 'left', marginTop: '20px' }}>
                            <Typography variant="h4" component="h4" className='ftr_list_menu'>
                                Pages
                            </Typography>
                            <FooterList>
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
                            </FooterList>
                        </Grid>
                        <Grid xs={3} sx={{ textAlign: 'left', marginTop: '20px' }}>
                            <Typography variant="h4" component="h4" className='ftr_list_menu'>
                                Social
                            </Typography>
                            <FooterList className='social_icon'>
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

                            </FooterList>
                        </Grid>
                    </Grid>

               
            </Footersection>
            <Copyright>
              
                    <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>

                        <Grid xs={5} sx={{ textAlign: 'left', }}>
                            <Typography variant="body2" component="p" className=''>
                                © Copyright 2024, All rights reserved with Arogya HealtCare
                            </Typography>
                        </Grid>
                        <Grid xs={7} sx={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                            <Typography variant="body2" component="p" className='' sx={{ marginRight: 3 }}>
                                Privacy Policy
                            </Typography>
                            <Typography variant="body2" component="p" className='' sx={{ marginRight: 3 }}>
                                terms & Conditions
                            </Typography>
                            <Typography variant="body2" component="p" className=''>
                                FAQ
                            </Typography>
                        </Grid>
                    </Grid>

                
            </Copyright>
        </>
    );
}
export default Footer;