import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Payment,
  Cancel
} from "@mui/icons-material";
import { green } from "@mui/material/colors";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import { AppDispatch } from "@/redux/store";
import { creator, modifier } from "@/apis/apiClient";
import { Utility } from "@/utils";

interface PaymentFormProps {
  setShowPaymentForm: (show: boolean) => void;
  paymentInfo: object | undefined;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  setShowPaymentForm,
  paymentInfo,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [paymentSucceeded, setPaymentSucceeded] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { snackbarAndNavigate } = Utility();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!stripe || !elements) return;

      setIsProcessing(true);
      try {
        const createPaymentData = await creator(
          "payment",
          "/create-payment-intent",
          paymentInfo
        );

        if (!createPaymentData || createPaymentData.statusCode !== 201) {
          setMessage("Error initiating payment.");
          setPaymentSucceeded(false);
          return;
        }

        const clientSecret = createPaymentData.data?.clientSecret;
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setMessage("Card element not found.");
          setPaymentSucceeded(false);
          return;
        }

        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

        if (paymentResult.error) {
          setMessage(paymentResult.error.message || "Payment failed.");
          setPaymentSucceeded(false);
        } else if (paymentResult.paymentIntent?.status === "succeeded") {
          const updateData = await modifier(
            "appointment",
            "/update-appointment",
            {
              _id: paymentInfo?.appointmentId,
              status: "scheduled",
            });
          if (updateData?.statusCode === 200) {
            snackbarAndNavigate(
              dispatch,
              true,
              "success",
              "Appointment Booked Successfully",
              () => router.push("/profile")
            );
            setMessage("Payment succeeded!");
            setPaymentSucceeded(true);
          } else {
            setMessage("Payment succeeded, but failed to update appointment.");
            setPaymentSucceeded(false);
          }
        } else {
          setMessage("Payment not completed.");
          setPaymentSucceeded(false);
        }
      } catch (error: any) {
        setMessage(error.message || "An error occurred.");
        setPaymentSucceeded(false);
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements, paymentInfo, dispatch, router, snackbarAndNavigate]
  );

  return (
    <Paper
      elevation={10}
      sx={{
        padding: "30px",
        maxWidth: "800px",
        margin: "20px auto",
        borderRadius: "16px",
        background: "#fff",
        border: "2px solid #4CAF50",
        boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#4CAF50",
          marginBottom: "1px",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Payment Details
      </Typography>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          marginBottom: "20px",
          "& .MuiTabs-flexContainer": {
            justifyContent: "space-around",
          },
        }}
      >
        <Tab icon={<CreditCard />} label="Card" iconPosition="start" />
      </Tabs>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <Box
          sx={{
            width: "100%",
            padding: "16px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "inset 0px 3px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ccc",
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  color: "#424770",
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                  "::placeholder": {
                    color: "#9e9e9e",
                  },
                },
                invalid: {
                  color: "#ff4d4f",
                },
              },
              hidePostalCode: true,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              minWidth: "90px",
              color: "#fff",
              background: "#20ADA0",
              borderRadius: "4px",
              marginLeft: "20px",
            }}
            disabled={!stripe || isProcessing}
            startIcon={<Payment />}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
          <Button
            onClick={() => setShowPaymentForm(false)}
            variant="contained"
            sx={{
              minWidth: "90px",
              color: "#fff",
              background: "#20ADA0",
              borderRadius: "8px",
              marginLeft: "20px",
              fontWeight: "bold",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
            }}
            startIcon={<Cancel sx={{ fontSize: 20 }} />}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Payment Message (Success or Error) */}
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: paymentSucceeded ? green[500] : "red",
            marginTop: "1rem",
            textAlign: "center",
            width: "100%",
            fontWeight: "bold",
          }}
        >
          {message}
        </Typography>
      )}
    </Paper>
  );
};

export default PaymentForm;
