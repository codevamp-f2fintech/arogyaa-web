"use client";

import type React from "react";
import jsPDF from "jspdf";
import { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  Box,
  Button,
} from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Refresh,
  ReceiptLong,
  CreditCard,
  AccountBalance,
  AccountBalanceWallet,
  Payment,
  AttachMoney,
  CurrencyRupee,
  Euro,
  CurrencyBitcoin,
} from "@mui/icons-material";

import { fetcher, creator } from "@/apis/apiClient";
import { Utility } from "@/utils";

const BillingHistory: React.FC = () => {
  const { decodedToken } = Utility();
  const patientId = decodedToken()?.id;

  const [billingData, setBillingData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // 🎨 Logo Styles
  const logoStyles = {
    height: 50,
    width: "auto",
    objectFit: "contain",
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Chip
            icon={<CheckCircle />}
            label="Success"
            color="success"
            size="small"
          />
        );
      case "pending":
        return (
          <Chip
            icon={<HourglassEmpty />}
            label="Pending"
            color="warning"
            size="small"
          />
        );
      case "failed":
        return (
          <Chip icon={<Cancel />} label="Failed" color="error" size="small" />
        );
      case "refunded":
        return (
          <Chip icon={<Refresh />} label="Refunded" color="info" size="small" />
        );
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "card":
        return (
          <CreditCard
            sx={{ color: "#B497D6", fontSize: 20, marginRight: 0.2 }}
          />
        );
      case "upi":
        return (
          <AccountBalanceWallet
            sx={{ color: "#B497D6", fontSize: 20, marginRight: 0.2 }}
          />
        );
      case "net_banking":
        return (
          <AccountBalance
            sx={{ color: "#B497D6", fontSize: 20, marginRight: 0.2 }}
          />
        );
      default:
        return (
          <Payment sx={{ color: "#B497D6", fontSize: 20, marginRight: 0.2 }} />
        );
    }
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case "USD":
        return (
          <AttachMoney
            sx={{ color: "#B497D6", fontSize: 16, marginRight: 0.5 }}
          />
        );
      case "INR":
        return (
          <CurrencyRupee
            sx={{ color: "#B497D6", fontSize: 16, marginRight: 0.5 }}
          />
        );
      case "EUR":
        return (
          <Euro sx={{ color: "#B497D6", fontSize: 16, marginRight: 0.5 }} />
        );
      case "BTC":
        return (
          <CurrencyBitcoin
            sx={{ color: "#B497D6", fontSize: 10, marginRight: 1 }}
          />
        );
      default:
        return (
          <AttachMoney
            sx={{ color: "#B497D6", fontSize: 10, marginRight: 1 }}
          />
        );
    }
  };

  const fetchBillingData = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const response = await fetcher(
        "payment",
        `get-payments-by-patientId/${patientId}?page=${
          page + 1
        }&limit=${rowsPerPage}`
      );

      if (!response || !response.results) {
        throw new Error("No data found");
      }

      setBillingData(response.results || []);
      setTotalCount(response.count || 0);
      setError(null);
    } catch (error) {
      console.error("Error fetching billing data:", error);
      setError(error instanceof Error ? error.message : String(error));
      setBillingData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, [patientId, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePayNow = async (bill: any) => {
    setIsProcessing(true);
    setMessage("");
    try {
      const consultationFee = bill.amount;

      if (!consultationFee || consultationFee <= 0) {
        setIsProcessing(false);
        return;
      }

      const paymentData = {
        patientId: bill.patientId?._id || bill.patientId,
        doctorId: bill.doctorId?._id || bill.doctorId,
        appointmentId: bill.appointmentId,
        amount: Number(consultationFee),
        currency: bill.currency || "INR",
        transactionMethod: "card",
        patientName: "",
        doctorName: "",
      };

      const res = await creator("payment", "/initiate-payment", paymentData);

      if (res?.txnid && res?.html) {
        const container = document.createElement("div");
        container.innerHTML = res.html;
        document.body.appendChild(container);
        container.querySelector("form")?.submit();
      } else {
        console.error(
          "❌ Payment initiation failed: No txnid or HTML in response"
        );
        setMessage("Payment initiation failed.");
      }
    } catch (error: any) {
      console.error("🚨 Error during Pay Now:", error);
      setMessage(error.message || "Error initiating payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = async (bill: any) => {
    try {
      const doc = new jsPDF();

      // 🎨 Add Gradient Background Header
      doc.setFillColor(123, 86, 206); // purple shade
      doc.rect(0, 0, 210, 40, "F"); // top header bar

      // ✅ Add Logo on header
      const logo = new Image();
      logo.src = "/logomain.png"; // must be in /public folder
      doc.addImage(logo, "PNG", 15, 8, 25, 25);

      // Title
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Receipt", 105, 25, { align: "center" });

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Doctor & Patient Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Doctor:", 20, 55);
      doc.setFont("helvetica", "normal");
      doc.text(`${bill.doctorId?.username || "N/A"}`, 60, 55);

      doc.setFont("helvetica", "bold");
      doc.text("Patient:", 20, 65);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${bill.patientId?.username || bill.patientName || "N/A"}`,
        60,
        65
      );

      // Transaction Details Box
      doc.setFillColor(245, 245, 255); // light background
      doc.roundedRect(15, 80, 180, 60, 5, 5, "F"); // reduced height since status removed

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Transaction ID:", 25, 95);
      doc.setFont("helvetica", "normal");
      doc.text(`${bill.transactionId}`, 90, 95);

      doc.setFont("helvetica", "bold");
      doc.text("Payment Date:", 25, 110); // ✅ updated label
      doc.setFont("helvetica", "normal");
      doc.text(`${new Date(bill.createdAt).toLocaleString()}`, 90, 110);

      doc.setFont("helvetica", "bold");
      doc.text("Amount:", 25, 125);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(46, 125, 50);
      doc.text(`${bill.amount} INR`, 90, 125);

      // Footer bar
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(123, 86, 206);
      doc.rect(0, 160, 210, 20, "F"); // shifted up because status removed
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text("Thank you for using Arogyaa!", 105, 173, { align: "center" });

      // Save PDF
      doc.save(`receipt_${bill.transactionId}.pdf`);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 4,
          borderRadius: 2,
          backgroundColor: "#7b56ce",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Doctor",
                "Method",
                "Transaction Id",
                "Date",
                "Amount",
                "Status",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={5} align="center" style={{ color: "red" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : billingData.length > 0 ? (
              billingData.map((bill) => (
                <TableRow key={bill._id} hover>
                  <TableCell align="center">
                    {bill.doctorId?.username || "N/A"}
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    {bill.status === "success" ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        {getPaymentIcon(bill.transactionMethod)}
                        <span>{bill.transactionMethod}</span>
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {bill.status === "success" ? bill.transactionId : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell align="center">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#fff",
                        backgroundColor:
                          bill.amount >= 500
                            ? "rgba(46, 125, 50, 0.1)"
                            : "rgba(211, 47, 47, 0.1)",
                        minWidth: "80px",
                      }}
                    >
                      {getCurrencyIcon(bill.currency)}
                      {bill.amount}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {bill.status === "success" ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {getStatusChip(bill.status)}

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDownloadReceipt(bill)}
                          sx={{
                            borderColor: "#fff",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: "bold",
                            borderRadius: "18px",
                            px: 1.5,
                            py: 0.3,
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.1)",
                            },
                          }}
                          startIcon={<ReceiptLong sx={{ fontSize: 18 }} />} // 📄 Add receipt icon
                        >
                          Download Receipt
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ mt: 1 }}>
                        {(() => {
                          const now = new Date(); // Current date and time
                          const billDate = new Date(bill.createdAt);
                          const isPast = now > billDate;

                          return isPast ? (
                            <Box sx={{ color: "#fff", fontStyle: "italic" }}>
                              Payment window has expired
                            </Box>
                          ) : (
                            <Button
                              variant="contained"
                              size="medium"
                              onClick={() => handlePayNow(bill)}
                              disabled={isProcessing}
                              sx={{
                                background:
                                  "linear-gradient(90deg, #9e6df7 0%, #7b56ce 100%)",
                                boxShadow: "0 6px 20px rgba(123, 86, 206, 0.5)",
                                color: "#fff",
                                fontWeight: "bold",
                                textTransform: "none",
                                borderRadius: "18px",
                                px: 1.7,
                                whiteSpace: "nowrap",
                                py: 0.5,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg, #7b56ce 0%, #9e6df7 100%)",
                                  boxShadow:
                                    "0 4px 15px rgba(123, 86, 206, 0.4)",
                                },
                                "&:disabled": {
                                  background:
                                    "linear-gradient(90deg, #cfcfcf 0%, #ddd 100%)",
                                  color: "#666",
                                  boxShadow: "none",
                                  whiteSpace: "nowrap",
                                },
                              }}
                            >
                              {isProcessing ? "Processing..." : "Pay Now"}
                            </Button>
                          );
                        })()}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.5,
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  >
                    <ReceiptLong sx={{ fontSize: 18, color: "#fff" }} />
                    No Billing History
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-select": {
              fontWeight: 500,
            },
          }}
        />
      </TableContainer>

      {message && (
        <Box
          sx={{
            mt: 2,
            textAlign: "center",
            color: message.includes("successful") ? "green" : "red",
          }}
        >
          {message}
        </Box>
      )}
    </Container>
  );
};

export default BillingHistory;
