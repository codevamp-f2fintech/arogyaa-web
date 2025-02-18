"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  alpha,
  MenuItem,
  Select,
  IconButton,
  Modal,
} from "@mui/material";
import {
  CheckCircle,
  Visibility,
  AddCircle,
  HourglassEmpty,
  LocalHospital,
} from "@mui/icons-material";
import { fetcher, modifier } from "@/apis/apiClient";
import { Utility } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SnackbarComponent from "./common/Snackbar";
import ImagePicker from "./common/ImagePicker";
import CreateTreatmentDialog from "./common/CreateTreatmentDialog";

interface Treatment {
  _id: string;
  patientId: string;
  name: string;
  description: string;
  status: string;
  type: string;
  photo: string;
}
const statuses = ["in progress", "completed"];

const TreatmentHistory: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(
    null
  );
  const [viewImageModal, setViewImageModal] = useState(false);
  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);
  const [treatmentImage, setTreatmentImage] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [treatmentImagePreview, setTreatmentImagePreview] = useState<
    string | null
  >(null);
  const treatmentFileInputRef = useRef<HTMLInputElement>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  // global state for snackbar from Redux
  const { snackbar } = useSelector((state: RootState) => state.snackbar);

  const dispatch: AppDispatch = useDispatch();

  const { snackbarAndNavigate, decodedToken, capitalizeFirstLetter } =
    Utility();
  const patientId = decodedToken()?.id;

  // Function to fetch treatment data from API
  const fetchTreatments = useCallback(async () => {
    if (patientId) {
      try {
        const response = await fetcher(
          "treatment",
          `get-treatments-by-patientId/${patientId}?page=${
            page + 1
          }&limit=${rowsPerPage}`
        );
        if (!response) {
          throw new Error("No response from the API");
        }
        setTreatments(response.results || []);
        setTotalCount(response.count || 0);
        setError(null);
      } catch (error) {
        console.error("Error fetching treatments:", error);
        setError(error instanceof Error ? error.message : String(error));
        setTreatments([]);
        setTotalCount(0);
      }
    }
  }, [patientId, page, rowsPerPage]);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  // Handle table pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Define the snackbar close handler
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
  };
  // Open modal for uploading image
  const handleOpenModal = (treatmentId: string) => {
    setSelectedTreatmentId(treatmentId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTreatmentId(null);
  };

  // Upload treatment image
  const handleUpload = useCallback(async () => {
    if (!selectedTreatmentId || !treatmentImage) return;

    try {
      setIsUploading(true);

      const headers = {
        "Content-Type": "multipart/form-data",
      };
      const response = await modifier(
        "treatment",
        "update-treatment",
        {
          _id: selectedTreatmentId,
          photo: treatmentImage,
        },
        headers
      );

      if (!response) {
        throw new Error("No response from the API");
      }
      snackbarAndNavigate(
        dispatch,
        true,
        "success",
        "Image uploaded successfully"
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error uploading image:", error);
      snackbarAndNavigate(dispatch, true, "error", "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }, [treatmentImage, selectedTreatmentId]);

  // Open image viewer modal
  const handleOpenViewImageModal = (imageUrl: string) => {
    setViewImageUrl(imageUrl);
    setViewImageModal(true);
  };
  const handleCloseViewImageModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setViewImageModal(false);
    setViewImageUrl(null);
  };

  //status change handler
  const handleStatusChange = useCallback(
    async (treatmentId: string, newStatus: string) => {
      if (!treatmentId) return;

      try {
        const response = await modifier("treatment", "update-treatment", {
          _id: treatmentId,
          status: newStatus,
        });
        if (!response) {
          throw new Error("No status changes from the API");
        }
        snackbarAndNavigate(
          dispatch,
          true,
          "success",
          "Status updated successfully"
        );
        fetchTreatments();
      } catch (error) {
        console.error("Error updating status:", error);
        snackbarAndNavigate(dispatch, true, "error", "Failed to update status");
      }
    },
    [dispatch, fetchTreatments]
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          onClick={() => setOpenCreateDialog(true)}
          sx={{
            background: "#20ADA0 !important",
            color: "white",
            fontWeight: "bold",
            padding: "6px 15px",
            marginLeft: "4px",
            marginTop: "-12px",
            borderRadius: "20px",
            fontSize: "14px",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AddCircle sx={{ fontSize: 20 }} />
          Create
        </Button>
      </Box>
      <CreateTreatmentDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        fetchTreatments={fetchTreatments}
      />
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
            <TableRow sx={{ textAlign: "center" }}>
              {["Name", "Description", "Status", "Type", "Photo"].map(
                (header) => (
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
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={5} align="center" style={{ color: "red" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : treatments.length > 0 ? (
              treatments.map((treatment) => (
                <TableRow
                  key={treatment._id}
                  hover
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: alpha("#f5f5f5", 0.4),
                    },
                    "&:hover": {
                      backgroundColor: alpha("#f0f0f0", 0.7),
                    },
                    transition: "background-color 0.2s ease-in-out",
                    textAlign: "center",
                  }}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    {capitalizeFirstLetter(treatment.name)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {capitalizeFirstLetter(treatment.description)}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: 150,
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <Select
                      value={treatment.status}
                      onChange={(e) =>
                        handleStatusChange(treatment._id, e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      displayEmpty
                      sx={{
                        borderRadius: "20px",
                        width: "100%",
                        height: "36px",
                        textAlign: "center",
                        backgroundColor:
                          treatment.status.toLowerCase() === "in progress"
                            ? "#cce5ff"
                            : treatment.status.toLowerCase() === "completed"
                            ? "#d4edda"
                            : "#f8f9fa",
                        color:
                          treatment.status.toLowerCase() === "in progress"
                            ? "#0056b3"
                            : treatment.status.toLowerCase() === "completed"
                            ? "#2D9735"
                            : "#000",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "& .MuiSelect-select": {
                          borderRadius: "20px",
                          padding: "6px 14px !important",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          boxSizing: "border-box",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          paddingRight: "28px !important",
                        },
                        "& .MuiSelect-icon": {
                          fontSize: "1.2rem",
                          right: 4,
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            width: 150,
                            borderRadius: 2,
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                            mt: 1,
                            "& .MuiMenuItem-root": {
                              padding: "8px 14px",
                              borderRadius: "8px",
                              margin: "2px 4px",
                              fontSize: "0.875rem",
                              "&:hover": {
                                backgroundColor: "#F5F5F5",
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="in progress">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            color: "#0056b3",
                          }}
                        >
                          <HourglassEmpty fontSize="small" />
                          In Progress
                        </Box>
                      </MenuItem>
                      <MenuItem value="completed">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            color: "#2D9735",
                          }}
                        >
                          <CheckCircle fontSize="small" />
                          Completed
                        </Box>
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {capitalizeFirstLetter(treatment.type)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {treatment.photo ? (
                      <Box
                        sx={{ position: "relative", display: "inline-block" }}
                      >
                        <img
                          src={treatment.photo}
                          alt={treatment.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            display: "block",
                            margin: "0 auto",
                          }}
                        />
                        <IconButton
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() =>
                            handleOpenViewImageModal(treatment.photo)
                          }
                        >
                          <Visibility sx={{ color: "#20ADA0" }} />
                        </IconButton>
                      </Box>
                    ) : (
                      <Button
                        onClick={() => handleOpenModal(treatment._id)}
                        sx={{
                          display: "block",
                          margin: "0 auto",
                          background: "#20ADA0",
                          color: "white",
                          fontWeight: "bold",
                          textDecoration: "none",
                          borderRadius: "4px",
                          padding: "5px 10px",
                          "&:hover": {
                            background: "#178F84",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Upload
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Show "No Treatment History" when treatments array is empty
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.5,

                      borderRadius: "8px",

                      color: "#20ADA0",
                    }}
                  >
                    <LocalHospital sx={{ fontSize: 18, color: "#20ADA0" }} />
                    No Treatment History
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

      {openModal && selectedTreatmentId && (
        <ImagePicker
          open={openModal}
          onClose={handleCloseModal}
          handleUpload={handleUpload}
          fileInputRef={treatmentFileInputRef}
          image={treatmentImage}
          setImage={setTreatmentImage}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
          isUploading={isUploading}
          imagePreview={treatmentImagePreview}
          setImagePreview={setTreatmentImagePreview}
        />
      )}

      <Modal
        open={viewImageModal}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          handleCloseViewImageModal(event);
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "relative",
              backgroundColor: "white",
              padding: 2,
              borderRadius: 2,
              outline: "none",
              boxShadow: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Close Button */}
            <Button
              onClick={handleCloseViewImageModal}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "white",
                color: "black",
                borderRadius: "50%",
                minWidth: "40px",
                minHeight: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              ✕
            </Button>

            {viewImageUrl && (
              <img
                src={viewImageUrl}
                alt="Preview"
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  borderRadius: "8px",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </Box>
        </Box>
      </Modal>

      <SnackbarComponent
        alerting={snackbar.snackbarAlert}
        severity={snackbar.snackbarSeverity}
        message={snackbar.snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Container>
  );
};

export default TreatmentHistory;
