import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";
import { Button, Typography, CircularProgress, Box } from '@mui/material';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { green } from '@mui/material/colors';

import { creator, modifier } from '@/apis/apiClient';
import { Utility } from '@/utils';
import { AppDispatch } from '@/redux/store';

interface PaymentFormProps {
    setShowPaymentForm: (show: boolean) => void;
    appointmentId: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ setShowPaymentForm, appointmentId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [paymentSucceeded, setPaymentSucceeded] = useState<boolean>(false);

    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const { snackbarAndNavigate } = Utility();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        try {
            const data = await creator('payment', '/create-payment-intent', { amount: 500, currency: 'usd' });
            const clientSecret = data.data;

            const cardElement = elements.getElement(CardElement);
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement!,
                },
            });
            if (paymentResult.error) {
                setMessage(paymentResult.error.message || 'Payment failed.');
                setPaymentSucceeded(false);
            } else {
                if (paymentResult.paymentIntent?.status === 'succeeded') {
                    const data = await modifier('appointment', '/update-appointment',
                        {
                            _id: appointmentId,
                            status: "scheduled"
                        }
                    );
                    snackbarAndNavigate(
                        dispatch,
                        true,
                        "success",
                        "Appointment Booked Successfully",
                        () => router.push('/profile')
                    );
                    setMessage('Payment succeeded!');
                    setPaymentSucceeded(true);
                }
            }
        } catch (error: any) {
            setMessage(error.message || 'An error occurred.');
            setPaymentSucceeded(false);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                width: '100%',
                background: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: 3,
                bgcolor: 'background.paper',
                border: `2px solid ${green[500]}`,
            }}
        >
            {/* Stripe Card Element */}
            <Box sx={{ width: '100%', marginBottom: '1rem' }}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                color: '#424770',
                                fontSize: '16px',
                                fontFamily: 'Arial, sans-serif',
                                '::placeholder': {
                                    color: '#9e9e9e', // Slightly darker placeholder color
                                },
                            },
                            invalid: {
                                color: '#ff4d4f',   // Color for invalid inputs
                            },
                        },
                        // Hide icon brands if you want a cleaner look
                        hidePostalCode: true,
                    }}
                />
            </Box>

            {/* Pay Button / Loader */}
            <Box
                display="grid"
                gap='20px'
                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                padding="20px"
            >
                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{
                        width: '90%',
                        padding: '8px 20px',
                        '&:hover': {
                            backgroundColor: green[700],
                        },
                    }}
                    disabled={!stripe || isProcessing}
                >
                    {isProcessing ?
                        <CircularProgress color="success" size={18} />
                        : 'Pay Now'}
                </Button>
                <Button
                    onClick={() => setShowPaymentForm(false)}
                    variant="contained"
                    sx={{
                        minWidth: "110px",
                        color: "#fff",
                        background: "#20ADA0",
                        ":hover": {
                            bgcolor: "#20ADA0",
                            color: "white",
                        },
                    }}
                >
                    Cancel
                </Button>
            </Box>

            {/* Payment Message (Success or Error) */}
            {message && (
                <Typography
                    variant="body2"
                    sx={{
                        color: paymentSucceeded ? green[500] : 'red',
                        marginTop: '1rem',
                        textAlign: 'center',
                        width: '100%',
                    }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
}

export default PaymentForm;
