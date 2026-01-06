import React from 'react';
import { Card, CardContent, CardActions, Avatar, Box, Typography, Chip, Button } from '@mui/material';
import { Event, VerifiedUser } from '@mui/icons-material';

interface DoctorRecommendation {
    id: string;
    name: string;
    specialization: string;
    qualifications: string;
    experience: string;
    consultationFee: string | number;
    availability: string[];
    location: string;
    contact: string;
    bookingId: string;
    profilePicture?: string;
    isVerified?: boolean;
    tags?: string[];
}

const DoctorCard = ({ doctor, darkMode, onBookAppointment }: {
    doctor: DoctorRecommendation;
    darkMode: boolean;
    onBookAppointment: (doctor: DoctorRecommendation) => void;
}) => {
    return (
        <Card
            sx={{
                mb: 1,
                borderRadius: 1,
                backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
                overflow: 'hidden',
                maxWidth: 300,
            }}
        >
            <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                        src={doctor.profilePicture || "/assets/images/online-doctor-with-white-coat.png"}
                        alt={doctor.name}
                        sx={{ width: 40, height: 40, border: '1px solid #29175e' }}
                    />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333' }}>
                            {doctor.name}
                        </Typography>
                        {doctor.isVerified && (
                            <VerifiedUser sx={{ color: '#2ecc71', fontSize: 20 }} />
                        )}
                        <Typography variant="caption" sx={{ color: darkMode ? '#ddd' : '#666' }}>
                            {doctor.specialization}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#bbb' : '#555' }}>
                        {doctor.qualifications} | {doctor.experience}
                    </Typography>
                </Box>
                <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#bbb' : '#555' }}>
                        ₹{typeof doctor.consultationFee === 'number' ? doctor.consultationFee : doctor.consultationFee}
                    </Typography>
                    <Chip
                        label={doctor.availability[0] || 'N/A'}
                        size="small"
                        sx={{ fontSize: '0.6rem', height: 18, bgcolor: '#29175e', color: 'white' }}
                    />
                </Box>
            </CardContent>
            <CardActions sx={{ p: 1, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<Event />}
                    onClick={() => onBookAppointment(doctor)}
                    sx={{
                        backgroundColor: '#29175e',
                        '&:hover': { backgroundColor: '#1a0f3a' },
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        padding: '2px 8px'
                    }}
                >
                    Book
                </Button>
            </CardActions>
        </Card>
    );
};

export default DoctorCard;
