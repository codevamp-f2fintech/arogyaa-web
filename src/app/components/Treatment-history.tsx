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

const TreatmentHistory: React.FC = () => {
  const treatmentData = [
    {
      id: "1",
      treatmentName: "Physiotherapy",
      date: "2025-01-10T10:00:00",
      doctor: "Dr. Smith",
      status: "Completed",
    },
    {
      id: "2",
      treatmentName: "Dental Cleaning",
      date: "2025-02-15T11:00:00",
      doctor: "Dr. Allen",
      status: "Pending",
    },
    {
      id: "3",
      treatmentName: "Chemotherapy",
      date: "2025-03-01T09:00:00",
      doctor: "Dr. Johnson",
      status: "Ongoing",
    },
    {
      id: "4",
      treatmentName: "Eye Surgery",
      date: "2025-04-05T14:00:00",
      doctor: "Dr. Carter",
      status: "Scheduled",
    },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "ongoing":
        return "info";
      case "scheduled":
        return "default";
      default:
        return "default";
    }
  };

  const paginatedTreatments = treatmentData.slice(
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
              {["Treatment Name", "Date", "Doctor", "Status"].map((header) => (
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
            {paginatedTreatments.map((treatment) => (
              <TableRow
                key={treatment.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>{treatment.treatmentName}</TableCell>
                <TableCell>
                  {new Date(treatment.date).toLocaleString()}
                </TableCell>
                <TableCell>{treatment.doctor}</TableCell>
                <TableCell>
                  <Chip
                    label={treatment.status}
                    color={getStatusColor(treatment.status)}
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
          count={treatmentData.length}
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

export default TreatmentHistory;
