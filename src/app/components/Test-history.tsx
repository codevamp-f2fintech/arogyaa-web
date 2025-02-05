"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
  Button,
} from "@mui/material";
import { Science as TestIcon } from "@mui/icons-material";

import { fetcher, modifier } from "@/apis/apiClient";
import { Utility } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SnackbarComponent from "./common/Snackbar";
import ImagePicker from "./common/ImagePicker";

interface Test {
  _id: string;
  patientId: string;
  doctorId: string;
  name: string;
  description: string;
  category: string;
  photo: string;
  status: string;
}

const TestHistory: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testImage, setTestImage] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [testImagePreview, setTestImagePreview] = useState<string | null>(null);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const dispatch: AppDispatch = useDispatch();
  const testFileInputRef = useRef<HTMLInputElement>(null);
  const { snackbarAndNavigate } = Utility();

  const { decodedToken } = Utility();
  const patientId = decodedToken()?.id;

  const fetchTests = React.useCallback(async () => {
    if (patientId) {
      try {
        const response = await fetcher(
          "test",
          `get-tests-by-patientId/${patientId}?page=${
            page + 1
          }&limit=${rowsPerPage}`
        );
        const results = response?.results || [];
        const count = response?.count || 0;
        setTests(results);
        setTotalCount(count);
        setError(null);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setError(error instanceof Error ? error.message : String(error));
        setTests([]);
        setTotalCount(0);
      }
    }
  }, [patientId, page, rowsPerPage]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (category: string) => {
    switch (category.toLowerCase()) {
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

  const paginatedTests = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return tests.slice(startIndex, startIndex + rowsPerPage);
  }, [tests, page, rowsPerPage]);

  const handleOpenModal = (testId: string) => {
    setSelectedTestId(testId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTestId(null);
  };

  //   const handleUpload = useCallback(async () => {
  //     console.log(image, selectedTestId, "img");
  //     if (selectedTestId && image) {
  //       try {
  //         const response = await modifier("test", "update-test",{
  //             id: selectedTestId,
  //             photo: image
  //         });
  // console.log(response)
  //       } catch (error) {
  //         console.error("Error fetching tests:", error);
  //       }
  //     }
  //     // setIsUploading(true);
  //     // try {
  //     //   console.log("button pressed");
  //     //   // Your existing upload logic here
  //     //   await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate upload
  //     // } finally {
  //     //   setIsUploading(false);
  //     // }
  //   }, [image]);

  const handleUpload = useCallback(async () => {
    if (!selectedTestId || !testImage) return;

    try {
      setIsUploading(true);

      const headers = {
        "Content-Type": "multipart/form-data",
      };
      const response = await modifier(
        "test",
        "update-test",
        {
          _id: selectedTestId,
          photo: testImage,
        },
        headers
      );

      console.log("Upload success:", response);
      snackbarAndNavigate(
        dispatch,
        true,
        "success",
        "Image uploaded successfully"
      );

      // Close modal after successful upload
      handleCloseModal();
    } catch (error) {
      console.error("Error uploading image:", error);
      snackbarAndNavigate(dispatch, true, "error", "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }, [testImage, selectedTestId]);

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <TableRow>
              {["Name", "Description", "Status", "Photo", "Action"].map(
                (header) => (
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
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTests.map((test) => (
              <TableRow
                key={test._id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>{test.name}</TableCell>
                <TableCell>{test.description}</TableCell>
                <TableCell>{test.status}</TableCell>

                <TableCell>
                  {test.photo ? (
                    <img
                      src={test.photo}
                      alt={test.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(test._id)}>
                    {" "}
                    upload{" "}
                  </Button>
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

      {openModal && selectedTestId && (
        <ImagePicker
          open={openModal}
          onClose={handleCloseModal}
          handleUpload={handleUpload}
          fileInputRef={testFileInputRef}
          image={testImage}
          setImage={setTestImage}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
          isUploading={isUploading}
          imagePreview={testImagePreview}
          setImagePreview={setTestImagePreview}
        />
      )}

      <SnackbarComponent
        alerting={snackbar.snackbarAlert}
        severity={snackbar.snackbarSeverity}
        message={snackbar.snackbarMessage}
      />
    </Container>
  );
};

export default TestHistory;
