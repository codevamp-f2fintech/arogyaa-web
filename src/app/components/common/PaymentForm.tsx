import React, { useCallback, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { creator } from "@/apis/apiClient";
import { Payment, Cancel } from "@mui/icons-material";

interface PaymentFormProps {
  setShowPaymentForm: (show: boolean) => void;
  paymentInfo: {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    amount: number;
    currency: string;
    transactionMethod: string;
    status: string;
    patientName: string;
    doctorName: string;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  setShowPaymentForm,
  paymentInfo,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handlePayU = useCallback(async () => {
    setIsProcessing(true);
    try {
      const res = await creator("payment", "/initiate-payment", paymentInfo);
      if (res && res.txnid && res.html) {
        const container = document.createElement("div");
        container.innerHTML = res.html;
        document.body.appendChild(container);
        container.querySelector("form")?.submit();
        setMessage("Payment initiation was successful! Redirecting...");
      } else {
        setMessage("Unable to initiate PayU payment.");
      }
    } catch (err: any) {
      console.error("PayU Error", err);
      setMessage(err.message || "Payment failed.");
    } finally {
      setIsProcessing(false);
    }
  }, [paymentInfo, router]);

  return (
    <Paper
      elevation={10}
      sx={{
        padding: "30px",
        maxWidth: "800px",
        margin: "20px auto",
        borderRadius: "16px",
        border: "2px solid #4CAF50",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#4CAF50",
          mb: 2,
          textAlign: "center",
        }}
      >
        Payment Details (PayU)
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 9 }}>
        <Button
          variant="contained"
          onClick={handlePayU}
          disabled={isProcessing}
          sx={{ background: "#20ADA0" }}
          startIcon={<Payment />}
        >
          {isProcessing ? "Processing..." : "Pay with PayU"}
        </Button>

        {/* <Button
          onClick={() => setShowPaymentForm(false)}
          variant="contained"
          sx={{ background: "#ccc" }}
          startIcon={<Cancel />}
        >
          Cancel
        </Button> */}
      </Box>

      {message && (
        <Typography
          variant="body2"
          sx={{
            color: message.includes("successful") ? "green" : "red",
            textAlign: "center",
            mt: 2,
          }}
        >
          {message}
        </Typography>
      )}
    </Paper>
  );
};

export default PaymentForm;
