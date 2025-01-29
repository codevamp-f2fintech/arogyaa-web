"use client";

import React, { useState } from "react";
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
} from "@mui/material";

const BillingHistory: React.FC = () => {
  const billingData = [
    {
      id: "1",
      serviceName: "Consultation",
      date: "2025-01-15T10:00:00",
      amount: "$50.00",
      status: "Paid",
    },
    {
      id: "2",
      serviceName: "MRI Scan",
      date: "2025-01-20T12:30:00",
      amount: "$300.00",
      status: "Pending",
    },
    {
      id: "3",
      serviceName: "X-Ray",
      date: "2025-02-05T14:00:00",
      amount: "$100.00",
      status: "Paid",
    },
    {
      id: "4",
      serviceName: "Blood Test",
      date: "2025-03-10T09:00:00",
      amount: "$25.00",
      status: "Unpaid",
    },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "unpaid":
        return "error";
      default:
        return "default";
    }
  };

  const paginatedBilling = billingData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <TableRow>
              {["Service Name", "Date", "Amount", "Status"].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBilling.map((bill) => (
              <TableRow
                key={bill.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>{bill.serviceName}</TableCell>
                <TableCell>{new Date(bill.date).toLocaleString()}</TableCell>
                <TableCell>{bill.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={bill.status}
                    color={getStatusColor(bill.status)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={billingData.length}
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
    </Container>
  );
};

export default BillingHistory;