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
  Paper,
  TablePagination,
  Alert,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  EventAvailable as AppointmentIcon,
  CalendarMonth,
  Phone,
  WhatsApp,
} from "@mui/icons-material";
import { Utility } from "@/utils";
import { fetcher } from "@/apis/apiClient";

interface Doctor {
  username: string;
  email: string;
  contact: string;
}

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: Doctor;
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
          `get-patients-appointment/${patientId}?page=${
            page + 1
          }&limit=${rowsPerPage}`
        );
        if (!response || !response.results) {
          throw new Error("No data found");
        }
        setAppointments(response.results || []);
        setTotalCount(response.count || 0);
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error instanceof Error ? error.message : String(error));
        setAppointments([]);
        setTotalCount(0);
      }
    }
  }, [patientId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
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

  const headerStyle = {
    fontWeight: 600,
    textTransform: "uppercase",
    color: "#fff",
  };

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#7b56ce", mt: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Doctor</TableCell>
              {/* <TableCell sx={headerStyle}>Email</TableCell> */}
              <TableCell sx={headerStyle}>Contact</TableCell>
              <TableCell sx={headerStyle}>Date</TableCell>
              <TableCell sx={headerStyle}>Time</TableCell>
              <TableCell sx={headerStyle}>Hospital</TableCell>
              <TableCell sx={headerStyle}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map((appointment) => (
                <TableRow
                  key={appointment._id}
                  hover
                  sx={{
                    "& td": {
                      py: 2,
                      borderBottom: "1px solid #ffffff66",
                      color: "#fff",
                    },
                  }}
                >
                  <TableCell>
                    {appointment?.doctorId?.username || "N/A"}
                  </TableCell>
                  {/* <TableCell>{appointment?.doctorId?.email || "N/A"}</TableCell> */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{appointment?.doctorId?.contact || "N/A"}</span>
                      {appointment?.doctorId?.contact && (
                        <Tooltip title="Message on WhatsApp">
                          <a
                            href={`https://wa.me/91${appointment?.doctorId?.contact}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#25D366",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <WhatsApp fontSize="small" />
                          </a>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    {appointment?.appointmentDate
                      ? new Date(appointment.appointmentDate)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </TableCell>

                  <TableCell>{appointment?.appointmentTime || "N/A"}</TableCell>
                  <TableCell>{appointment?.hospitalName || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      icon={<AppointmentIcon />}
                      label={appointment?.status || "N/A"}
                      color={getStatusColor(appointment?.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                      color: "#fff",
                    }}
                  >
                    <CalendarMonth sx={{ fontSize: 18, color: "#fff" }} />
                    No Appointment Booked
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
              color: "#fff",
            },
          }}
        />
      </TableContainer>
    </Container>
  );
};

export default AppointmentHistory;
