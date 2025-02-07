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
  FormControl,
  MenuItem,
  Select,
  IconButton,
  Modal,
} from "@mui/material";
import { Loop, CheckCircle, Visibility, AddCircle } from "@mui/icons-material";
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

  const handleCloseViewImageModal = () => {
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
            padding: "6px 20px",
            marginLeft: "4px",
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
            {treatments.map((treatment) => (
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
                <TableCell sx={{ textAlign: "center" }}>
                  <FormControl
                    sx={{
                      minWidth: 120,
                      backgroundColor:
                        treatment.status === "in progress"
                          ? alpha("#cce5ff", 0.3)
                          : treatment.status === "completed"
                          ? alpha("#d4edda", 0.3)
                          : alpha("#f8f9fa", 0.3),
                      borderRadius: "8px",
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                      },
                      "& .MuiSelect-select": {
                        padding: "6px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      },
                    }}
                  >
                    <Select
                      value={treatment.status}
                      onChange={(e) =>
                        handleStatusChange(treatment._id, e.target.value)
                      }
                      disableUnderline
                      onClose={() => console.log("Dropdown closed")}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: "8px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                          },
                        },
                        disableScrollLock: true,
                      }}
                      sx={{
                        color:
                          treatment.status === "in progress"
                            ? "#20ADA0"
                            : treatment.status === "completed"
                            ? "green"
                            : "grey",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        borderRadius: "8px",
                        "&.Mui-focused": {
                          backgroundColor: "transparent",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: "1rem",
                          color:
                            treatment.status === "in progress"
                              ? "#20ADA0"
                              : treatment.status === "completed"
                              ? "green"
                              : "#6b7280",
                        },
                        "&:hover": {
                          borderColor: "#20ADA0",
                        },
                      }}
                    >
                      {statuses.map((status) => (
                        <MenuItem
                          key={status}
                          value={status}
                          sx={{
                            color:
                              status === "in progress"
                                ? "#20ADA0"
                                : status === "completed"
                                ? "green"
                                : "red",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            borderRadius: "8px",
                            "&:hover": {
                              backgroundColor: alpha("#f0f0f0", 0.5),
                            },
                          }}
                        >
                          {status === "in progress" && (
                            <Loop sx={{ color: "#20ADA0", fontSize: "1rem" }} />
                          )}
                          {status === "completed" && (
                            <CheckCircle
                              sx={{ color: "green", fontSize: "1rem" }}
                            />
                          )}
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell sx={{ textAlign: "center" }}>
                  {capitalizeFirstLetter(treatment.type)}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {treatment.photo ? (
                    <Box sx={{ position: "relative", display: "inline-block" }}>
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
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                        }}
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
                      sx={{ display: "block", margin: "0 auto" }}
                    >
                      Upload
                    </Button>
                  )}
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

      <Modal open={viewImageModal} onClose={handleCloseViewImageModal}>
        <Box
          onClick={handleCloseViewImageModal}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          {viewImageUrl && (
            <img
              src={viewImageUrl}
              alt="Preview"
              style={{ maxWidth: "90%", maxHeight: "90%" }}
            />
          )}
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
