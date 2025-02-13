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
import { Utility } from "@/utils";

const PatientOverview: React.FC<{ user: any }> = ({ user }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { capitalizeFirstLetter } = Utility();

  const patientData = [
    {
      id: "1",
      field: "Gender",
      value: capitalizeFirstLetter(user?.gender) || "N/A",
      icon: <PersonIcon sx={{ color: "#20ADA0" }} />,
    },
    {
      id: "2",
      field: "Date of Birth",
      value: "10/03/1987", 
      icon: <CalendarTodayIcon sx={{ color: "#20ADA0" }} />,
    },
    {
      id: "3",
      field: "Previous Visit",
      value: "25/11/2024", 
      icon: <CalendarTodayIcon sx={{ color: "#20ADA0" }} />,
    },
    {
      id: "4",
      field: "Next Visit",
      value: "14/02/2025",
      icon: <CalendarTodayIcon sx={{ color: "#20ADA0" }} />,
    },
    {
      id: "5",
      field: "Allergies",
      value: "Pet, Pollen", 
      icon: <HealingIcon sx={{ color: "#20ADA0" }} />,
    },
  ];

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
      <Box
        sx={{
          backgroundColor: "#20ADA0", 
          borderRadius: 2,
          padding: "20px",
          marginTop: 4,
          marginBottom: 4,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#fff", 
            marginBottom: 2,
          }}
        >
          Patient Overview
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            overflow: "hidden",
            border: "1px solid #e0e0e0",
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
                {["", ""].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      padding: "16px 24px",
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
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "#e8f7f7",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      padding: "12px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {item.icon}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.field}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "12px 24px",
                      fontWeight: 500,
                    }}
                  >
                    {item.value}
                  </TableCell>
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
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#f9f9f9",
            }}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default PatientOverview;
