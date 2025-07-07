"use client";

import type React from "react";
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
                      getStatusChip(bill.status)
                    ) : (
                      <Box sx={{ mt: 1 }}>
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
                              boxShadow: "0 4px 15px rgba(123, 86, 206, 0.4)",
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
