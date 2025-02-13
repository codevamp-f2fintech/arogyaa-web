"use client";

import React, { useState, useEffect } from "react";
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
  alpha,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Refresh,
} from "@mui/icons-material";
import {
  CreditCard,
  AccountBalance,
  AccountBalanceWallet,
  Payment,
} from "@mui/icons-material";
import {
  AttachMoney,
  CurrencyRupee,
  Euro,
  CurrencyBitcoin,
} from "@mui/icons-material";

import { fetcher } from "@/apis/apiClient";
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

  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return (
          <Chip
            icon={<CheckCircle />}
            label="Paid"
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
    switch (method.toLowerCase()) {
      case "card":
        return (
          <CreditCard sx={{ color: "#20ADA0", fontSize: 20, marginRight: 0.2 }} />
        );
      case "upi":
        return (
          <AccountBalanceWallet
            sx={{ color: "#20ADA0", fontSize: 20, marginRight: 0.2  }}
          />
        );
      case "net_banking":
        return (
          <AccountBalance
            sx={{ color: "#20ADA0", fontSize: 20, marginRight: 0.2 }}
          />
        );
      default:
        return (
          <Payment sx={{ color: "#20ADA0", fontSize: 20,  marginRight: 0.2  }} />
        );
    }
  };
  const getCurrencyIcon = (currency: string) => {
    switch (currency.toUpperCase()) {
      case "USD":
        return (
          <AttachMoney
            sx={{ color: "#20ADA0", fontSize: 15, marginRight: 1 }}
          />
        );
      case "INR":
        return (
          <CurrencyRupee
            sx={{ color: "#20ADA0", fontSize: 10, marginRight: 1 }}
          />
        );
      case "EUR":
        return <Euro sx={{ color: "#20ADA0", fontSize: 10, marginRight: 1 }} />;
      case "BTC":
        return (
          <CurrencyBitcoin
            sx={{ color: "#20ADA0", fontSize: 10, marginRight: 1 }}
          />
        );
      default:
        return (
          <AttachMoney
            sx={{ color: "#20ADA0", fontSize: 10, marginRight: 1 }}
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg">
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 4,
          borderRadius: 2,
        }}
      >
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "auto", my: 3 }} />
        ) : error ? (
          <Typography
            color="error"
            sx={{ textAlign: "center", py: 3, fontWeight: 500 }}
          >
            {error}
          </Typography>
        ) : (
          <>
            <Table>
              <TableHead
                sx={{
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <TableRow sx={{ textAlign: "center" }}>
                  {[
                    "Doctor's Name",
                    "Payment Method",
                    "Date",
                    "Amount",
                    "Status",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        color: "text.secondary",
                        textAlign: "center",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {billingData.length > 0 ? (
                  billingData.map((bill) => (
                    <TableRow key={bill._id} hover>
                      <TableCell align="center">
                        {bill.doctorId?.username || "N/A"}
                      </TableCell>
                      <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          {getPaymentIcon(bill.transactionMethod)}
                          <span>
                            {bill.transactionMethod.replace("_", " ")}
                          </span>
                        </span>
                      </TableCell>

                      <TableCell align="center">
                        {new Date(bill.date).toLocaleString()}
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
                            color:
                              bill.amount >= 500
                                ? "#20ADA0"
                                : bill.amount >= 100
                                ? "#20ADA0"
                                : "#20ADA0",
                            backgroundColor:
                              bill.amount >= 500
                                ? "rgba(46, 125, 50, 0.1)"
                                : "rgba(211, 47, 47, 0.1)",
                            minWidth: "80px",
                          }}
                        >
                          {getCurrencyIcon(bill.currency)}
                          {bill.amount} {bill.currency}
                        </span>
                      </TableCell>

                      <TableCell align="center">
                        {getStatusChip(bill.status)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No billing records found.
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
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-select":
                  {
                    fontWeight: 500,
                  },
              }}
            />
          </>
        )}
      </TableContainer>
    </Container>
  );
};

export default BillingHistory;
