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
  Box,
  Typography,
  alpha,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Healing as HealingIcon,
} from "@mui/icons-material";

const PatientOverview: React.FC<{ user: any }> = ({ user }) => {
  const patientData = [
    {
      id: "1",
      field: "Gender",
      value: user?.gender || "N/A",
      icon: <PersonIcon sx={{ color: "#20ADA0" }} />,
    },
    {
      id: "2",
      field: "Date of Birth",
      value: "10/03/1987", // Replace with dynamic data if available
      icon: <CalendarTodayIcon sx={{ color: "#20ADA0" }} />,
    },
    {
      id: "3",
      field: "Previous Visit",
      value: "25/11/2020", // Replace with dynamic data if available
      icon: <CalendarTodayIcon sx={{ color: "#20ADA0" }} />,
    },
    {
      id: "4",
      field: "Next Visit",
      value: "09/12/2020", // Replace with dynamic data if available
      icon: <CalendarTodayIcon sx={{ color: "#20ADA0" }} />,
    },
    {
      id: "5",
      field: "Allergies",
      value: "Hayfever, Crayfish", // Replace with dynamic data if available
      icon: <HealingIcon sx={{ color: "#20ADA0" }} />,
    },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = patientData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
              {["Field", "Value"].map((header) => (
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
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {item.icon}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.field}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={patientData.length}
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

export default PatientOverview;