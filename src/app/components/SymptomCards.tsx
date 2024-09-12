/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Box, Button, CardContent, Grid, Paper, Typography } from '@mui/material';
import Image from 'next/image';

import { setSymptoms, setLoading } from '@/redux/features/symptomsSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { useGetSymptoms } from '@/hooks/symptoms';
import { icons } from "@/data";

const SymptomCards: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { symptoms } = useSelector((state: RootState) => state.symptoms);

    const [pageSize, setPageSize] = useState({
        page: 1,
        size: 8
    });

    // Fetch data from the API
    const { data } = useGetSymptoms([], `http://localhost:3001/api/symptoms/get-symptoms`);

    useEffect(() => {
        if (data && data.length > 0) {
            dispatch(setSymptoms(data));
        }
    }, [data]);

    const handleFetchNext = () => {
        setPageSize(prevSize => ({
            ...prevSize,
            size: prevSize.size + 5,
        }));
        dispatch(setLoading(true));
    };

    // Display data logic
    const displayData = symptoms.length > 0 ? symptoms : [];
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                {displayData.slice(0, pageSize.size).map((item) => {
                    const icon = icons.find((icon) => icon.title === item.name)?.path;

                    return (
                        <Grid item xs={3} sm={3} md={3} key={item.id}> {/* Updated to xs={3} for 4 in a row */}
                            <Paper elevation={3} sx={{
                                padding: '20px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                    <Image
                                        src={`${icon}`} // Assuming 'icon' is the correct field for the image path
                                        width={100}
                                        height={100}
                                        alt={`${icon}`} 
                                    />
                                <CardContent sx={{ textAlign: 'center' }}> {/* Centering the text */}
                                    <Typography variant="h5" component="h5" sx={{
                                        fontSize: '16px',
                                        color: '#000',
                                        lineHeight: '20px',
                                        fontWeight: '700',
                                        marginTop: '10px',
                                        marginBottom: '10px'
                                    }}>
                                        {item.name}
                                    </Typography>

                                    <Button variant="contained" sx={{
                                        marginTop: 2,
                                        width: 'auto',
                                        color: '#fff',
                                        background: '#20ADA0',
                                        borderRadius: '100px',
                                        ':hover': {
                                            bgcolor: '#20ADA0',
                                            color: 'white',
                                        },
                                    }} endIcon={<ArrowCircleRightIcon />}>Consult Now</Button>
                                </CardContent>
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>

            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                <Grid xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button variant="contained" sx={{
                        color: 'white',
                        background: '#20ADA0',
                        ':hover': {
                            bgcolor: '#20ADA0',
                            color: 'white',
                        },
                    }} endIcon={<ArrowCircleRightIcon />} onClick={handleFetchNext}>
                        Load More
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SymptomCards;
