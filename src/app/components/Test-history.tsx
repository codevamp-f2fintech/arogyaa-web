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

import { Science as TestIcon } from "@mui/icons-material";

const TestHistory: React.FC = () => {
  const testData = [
    {
      id: "1",
      testName: "Blood Test",
      testDate: "2025-01-15T10:00:00",
      status: "completed",
    },
    {
      id: "2",
      testName: "X-Ray",
      testDate: "2025-01-20T12:30:00",
      status: "scheduled",
    },
    {
      id: "3",
      testName: "MRI Scan",
      testDate: "2025-02-05T14:00:00",
      status: "pending",
    },
    {
      id: "4",
      testName: "CT Scan",
      testDate: "2025-03-10T09:00:00",
      status: "cancelled",
    },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Function to get status chip color
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

  // Paginate the static test data
  const paginatedTests = testData.slice(
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
              {["Test Name", "Test Date", "Status"].map((header) => (
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
            {paginatedTests.map((test) => (
              <TableRow
                key={test.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>{test.testName}</TableCell>
                <TableCell>
                  {new Date(test.testDate).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<TestIcon />}
                    label={test.status}
                    color={getStatusColor(test.status)}
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
          count={testData.length}
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

export default TestHistory;