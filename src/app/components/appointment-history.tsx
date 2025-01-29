"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TablePagination,
  Alert,
  Box,
  Chip,
  alpha,
} from "@mui/material";

import {
  Timeline as TimelineIcon,
  EventAvailable as AppointmentIcon,
} from "@mui/icons-material";

import { Utility } from "@/utils";
import { fetcher } from "@/apis/apiClient";

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentTime: string;
  status: string;
}

const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { decodedToken } = Utility();
  const patientId = decodedToken()?.id;

  const fetchAppointments = React.useCallback(async () => {
    if (patientId) {
      try {
        const response = await fetcher(
          "appointment",
          `get-patients-appointment/${patientId}?page=1`
        );
        const results = response?.results || [];
        const count = response?.count || 0;
        setAppointments(results);
        setTotalCount(count);
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error instanceof Error ? error.message : String(error));
        setAppointments([]);
        setTotalCount(0);
      }
    }
  }, [patientId, page, rowsPerPage]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const paginatedAppointments = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return appointments.slice(startIndex, startIndex + rowsPerPage);
  }, [appointments, page, rowsPerPage]);

  return (
    <Container maxWidth="lg">
      <Box
      // sx={{
      //   // border:"2px solid red",
      //   display: "flex",
      //   alignItems: "center",
      //   mb: 3,
      //   p: 2,
      //   // backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
      //   borderRadius: 2,
      // }}
      >
        {/* <TimelineIcon sx={{ mr: 2, color: "primary.main" }} /> */}
        {/* <Typography
          variant="h6" // Change this to a larger or smaller variant, like "h5" or "h4"
          sx={{
            mb: 3,
            color: "#2C3E50",
            fontWeight: "700",
            fontSize: "1.2rem", // You can use this to set a custom font size
          }}
        >
          Appointment History
        </Typography> */}
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

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
              {[
                "Doctor's Name",
                "Appointment Time",
                "Status",
              ].map((header) => (
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
            {paginatedAppointments.map((appointment) => (
              <TableRow
                key={appointment._id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>{appointment?.doctorId?.username}</TableCell>
                <TableCell>
                  {appointment?.appointmentTime}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<AppointmentIcon />}
                    label={appointment?.status}
                    color={getStatusColor(appointment?.status)}
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
    </Container>
  );
};

export default AppointmentHistory;
