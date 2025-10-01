"use client";
import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
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
  Typography,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle,
  Visibility,
  AddCircle,
  HourglassEmpty,
  LocalHospital,
  VisibilityOff,
} from "@mui/icons-material";
import { creator, fetcher, modifier } from "@/apis/apiClient";
import { Utility } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
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
  createdAt: string;
  updatedAt: string;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const { snackbar } = useSelector((state: RootState) => state.snackbar);

  const dispatch: AppDispatch = useDispatch();

  const { snackbarAndNavigate, decodedToken, capitalizeFirstLetter } =
    Utility();
  const patientId = decodedToken()?.id;

  const getConsultationFee = (t: any) =>
    Number(t?.doctorId?.consultationFee || 0);
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const buildAppointmentFromTreatment = (t: Treatment): Appointment => ({
    _id:
      typeof t.appointmentId === "string"
        ? t.appointmentId
        : t.appointmentId?._id || "",
    doctorId: t.doctorId as IdLike,
    patientId: t.patientId as IdLike,
  });

  // Function to fetch treatment data from API
  const fetchTreatments = useCallback(async () => {
    if (!patientId) return;

    try {
      const response = await fetcher(
        "treatment",
        `get-treatments-by-patientId/${patientId}?page=${
          page + 1
        }&limit=${rowsPerPage}`
      );
      console.log("Fetched treatments response:", response);
      if (!response) throw new Error("No response from the API");

      const treatments = response.results || [];

      const treatmentsWithPayment = await Promise.all(
        treatments.map(async (treatment) => {
          const appointmentId = treatment.appointmentId?._id;

          let paymentStatus = "pending";

          if (!appointmentId) {
            paymentStatus = treatment.appointmentId?.emergency
              ? "payNow"
              : "pending";
          } else {
            try {
              const paymentResp = await fetcher(
                "payment",
                `get-payment-status/${appointmentId}`
              );
              paymentStatus = paymentResp?.status || "pending";

              if (
                treatment.appointmentId?.emergency &&
                paymentStatus !== "success"
              ) {
                paymentStatus = "payNow";
              }
            } catch {
              paymentStatus = treatment.appointmentId?.emergency
                ? "payNow"
                : "pending";
            }
          }

          return { ...treatment, paymentStatus };
        })
      );
      setTreatments(treatmentsWithPayment);
      setTotalCount(response.count || 0);
      setError(null);
    } catch (error) {
      console.error("Error fetching treatments with payments:", error);
      setError(error instanceof Error ? error.message : String(error));
      setTreatments([]);
      setTotalCount(0);
    }
  }, [patientId, page, rowsPerPage]);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);


  
  const handlePayNow = async (appointment: Appointment) => {
    setIsProcessing(true);
    setMessage("");
    try {
      const doc = appointment.doctorId as Doctor;
      const consultationFee = Number(doc?.consultationFee);
      if (!consultationFee || consultationFee <= 0) {
        setMessage(
          "Doctor's consultation fee is not set. Please contact support."
        );
        setIsProcessing(false);
        return;
      }
      const paymentData = {
        patientId:
          (appointment.patientId as Patient)?._id || appointment.patientId,
        doctorId: (appointment.doctorId as Doctor)?._id || appointment.doctorId,
        appointmentId: appointment._id,
        amount: consultationFee,
        currency: "INR",
        transactionMethod: "card",
        patientName: (appointment.patientId as Patient)?.username || "",
        doctorName: (appointment.doctorId as Doctor)?.username || "",
      };
      const res = await creator("payment", "/initiate-payment", paymentData);
      if (res?.txnid && res?.html) {
        const container = document.createElement("div");
        container.innerHTML = res.html;
        sessionStorage.setItem(
          `extensionTxn:${appointment._id}`,
          String(res.txnid)
        );
        document.body.appendChild(container);
        container.querySelector("form")?.submit();
      } else {
        setMessage("Payment initiation failed.");
      }
    } catch (e: any) {
      setMessage(e?.message || "Error initiating payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle table pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
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
  // console.log()
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

  // Download image function
  // const handleDownloadImage = async (
  //   imageUrl: string,
  //   treatmentName: string
  // ) => {
  //   try {
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${treatmentName || "treatment"}_image.jpg`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);

  //     snackbarAndNavigate(
  //       dispatch,
  //       true,
  //       "success",
  //       "Image downloaded successfully"
  //     );
  //   } catch (error) {
  //     console.error("Error downloading image:", error);
  //     snackbarAndNavigate(dispatch, true, "error", "Failed to download image");
  //   }
  // };

  const handleCloseViewImageModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setViewImageModal(false);
    setViewImageUrl(null);
  };

  // Status change handler
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
      {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          onClick={() => setOpenCreateDialog(true)}
          sx={{
            background: "#56428B !important",
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
      </Box> */}
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

      <TableContainer
        component={Paper}
        sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: "#7b56ce" }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <TableRow sx={{ textAlign: "center" }}>
              {[
                "Date",
                "doctor's Name",
                "Name",
                "Description",
                "Quantity",
                "Frequency",
                "Duration",
                "Type",
                "Status",
                "Photo",
                "Payment",
              ].map((header, index) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "#fff",
                    textAlign: "center",
                    ...(header === "doctor's Name" && { whiteSpace: "nowrap" }),
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={10} align="center" style={{ color: "red" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : treatments.length > 0 ? (
              treatments.map((treatment) => {
                const locked = treatment.paymentStatus !== "success";

                const treatmentData =
                  treatment.treatments && treatment.treatments[0];
                return (
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
                    <TableCell
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: 300,
                        fontFamily: "Poppins",
                      }}
                    >
                      {formatDate(treatment.createdAt)}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {capitalizeFirstLetter(
                        treatment?.doctorId?.username || "N/A"
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: 300,
                        fontFamily: "Poppins",
                      }}
                    >
                      {treatment.treatments &&
                      treatment.treatments.length > 0 ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          {treatment.treatments.map((t, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{ color: "white" }}
                            >
                              {locked ? (
                                <Tooltip
                                  title={`💳 Pay Now to View${
                                    getConsultationFee(treatment)
                                      ? ` • ₹${getConsultationFee(treatment)}`
                                      : ""
                                  }`}
                                  arrow
                                  placement="top"
                                >
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: 0.5,
                                      opacity: 0.9,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <VisibilityOff
                                      sx={{ fontSize: 18, opacity: 0.85 }}
                                    />
                                  </Box>
                                </Tooltip>
                              ) : (
                                capitalizeFirstLetter(t.name)
                              )}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    {/* Description column */}
                    <TableCell
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: 300,
                        fontFamily: "Poppins",
                      }}
                    >
                      {treatment.treatments &&
                      treatment.treatments.length > 0 ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          {treatment.treatments.map((t, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{ color: "white" }}
                            >
                              {locked ? (
                                <Tooltip
                                  title={`💳 Pay Now to View${
                                    getConsultationFee(treatment)
                                      ? ` • ₹${getConsultationFee(treatment)}`
                                      : ""
                                  }`}
                                  arrow
                                  placement="top"
                                >
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: 0.5,
                                      opacity: 0.9,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <VisibilityOff
                                      sx={{ fontSize: 18, opacity: 0.85 }}
                                    />
                                  </Box>
                                </Tooltip>
                              ) : (
                                capitalizeFirstLetter(t.description || "N/A")
                              )}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: 300,
                        fontFamily: "Poppins",
                      }}
                    >
                      {treatment.treatments &&
                      treatment.treatments.length > 0 ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          {treatment.treatments.map((t, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{ color: "white" }}
                            >
                              {locked ? (
                                <Tooltip
                                  title={`💳 Pay Now to View${
                                    getConsultationFee(treatment)
                                      ? ` • ₹${getConsultationFee(treatment)}`
                                      : ""
                                  }`}
                                  arrow
                                  placement="top"
                                >
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: 0.5,
                                      opacity: 0.9,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <VisibilityOff
                                      sx={{ fontSize: 18, opacity: 0.85 }}
                                    />
                                  </Box>
                                </Tooltip>
                              ) : (
                                capitalizeFirstLetter(t.quantity || "N/A")
                              )}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: 300,
                        fontFamily: "Poppins",
                      }}
                    >
                      {treatment.treatments &&
                      treatment.treatments.length > 0 ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          {treatment.treatments.map((t, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{ color: "white" }}
                            >
                              {locked ? (
                                <Tooltip
                                  title={`💳 Pay Now to View${
                                    getConsultationFee(treatment)
                                      ? ` • ₹${getConsultationFee(treatment)}`
                                      : ""
                                  }`}
                                  arrow
                                  placement="top"
                                >
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: 0.5,
                                      opacity: 0.9,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <VisibilityOff
                                      sx={{ fontSize: 18, opacity: 0.85 }}
                                    />
                                  </Box>
                                </Tooltip>
                              ) : (
                                capitalizeFirstLetter(t.frequency || "N/A")
                              )}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: 300,
                        fontFamily: "Poppins",
                      }}
                    >
                      {treatment.treatments &&
                      treatment.treatments.length > 0 ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          {treatment.treatments.map((t, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{ color: "white" }}
                            >
                              {locked ? (
                                <Tooltip
                                  title={`💳 Pay Now to View${
                                    getConsultationFee(treatment)
                                      ? ` • ₹${getConsultationFee(treatment)}`
                                      : ""
                                  }`}
                                  arrow
                                  placement="top"
                                >
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: 0.5,
                                      opacity: 0.9,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <VisibilityOff
                                      sx={{ fontSize: 18, opacity: 0.85 }}
                                    />
                                  </Box>
                                </Tooltip>
                              ) : (
                                capitalizeFirstLetter(t.duration || "N/A")
                              )}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      {capitalizeFirstLetter(treatment.type)}
                    </TableCell>
                    {/* <TableCell
                      sx={{
                        width: 100,
                        textAlign: "center",
                        verticalAlign: "middle",
                        padding: "8px 4px",
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
                          borderRadius: "12px",
                          width: "90px",
                          height: "28px",
                          fontSize: "0.75rem",
                          textAlign: "center",
                          backgroundColor: "#fff",
                          color: "#333",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #e0e0e0",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #ccc",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #999",
                          },
                          "& .MuiSelect-select": {
                            borderRadius: "12px",
                            padding: "4px 8px !important",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 400,
                            boxSizing: "border-box",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            paddingRight: "20px !important",
                          },
                          "& .MuiSelect-icon": {
                            fontSize: "1rem",
                            right: 2,
                            color: "#666",
                          },
                        }}
                      >
                        <MenuItem value="in progress">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: "#333",
                              fontSize: "0.75rem",
                            }}
                          >
                            <HourglassEmpty fontSize="inherit" />
                            Progress
                          </Box>
                        </MenuItem>
                        <MenuItem value="completed">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: "#333",
                              fontSize: "0.75rem",
                            }}
                          >
                            <CheckCircle fontSize="inherit" />
                            Done
                          </Box>
                        </MenuItem>
                      </Select>
                    </TableCell> */}
                    <TableCell
                      sx={{
                        width: 100,
                        textAlign: "center",
                        verticalAlign: "middle",
                        padding: "8px 4px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                          fontSize: "0.75rem",
                          color: "#fff", // White text
                        }}
                      >
                        {treatment.status === "in progress" ? (
                          <>
                            <HourglassEmpty fontSize="inherit" />
                            Progress
                          </>
                        ) : (
                          <>
                            <CheckCircle fontSize="inherit" />
                            Done
                          </>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {locked ? (
                        <Tooltip
                          title={`💳 Pay Now to View Prescription${
                            getConsultationFee(treatment)
                              ? ` • ₹${getConsultationFee(treatment)}`
                              : ""
                          }`}
                          arrow
                          placement="top"
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                              gap: 0.5,
                              cursor: "pointer",
                              opacity: 0.9,
                              minHeight: "50px",
                            }}
                          >
                            <VisibilityOff
                              sx={{ fontSize: 18, opacity: 0.85 }}
                            />
                          </Box>
                        </Tooltip>
                      ) : treatment.photo ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <img
                            src={treatment.photo || "/placeholder.svg"}
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
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Button
                              onClick={() =>
                                handleOpenViewImageModal(treatment.photo)
                              }
                              sx={{
                                minWidth: "auto",
                                padding: "4px 8px",
                                fontSize: "0.7rem",
                                background: "#56428B",
                                color: "white",
                                borderRadius: "4px",
                                "&:hover": { background: "#483980" },
                              }}
                            >
                              View
                            </Button>
                            <Button
                              sx={{
                                minWidth: "auto",
                                padding: "4px 8px",
                                fontSize: "0.7rem",
                                background: "#28a745",
                                color: "white",
                                borderRadius: "4px",
                                "&:hover": { background: "#218838" },
                              }}
                            >
                              <a
                                href={treatment.photo || "/placeholder.svg"}
                                download
                              >
                                Download Image
                              </a>
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            fontSize: "0.75rem",
                            color: "#fff",
                            fontWeight: 400,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          No Prescription
                        </Box>
                      )}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                      {treatment.paymentStatus === "success" && (
                        <Typography sx={{ fontWeight: 600 }}>Paid</Typography>
                      )}
                      {treatment.paymentStatus === "pending" && (
                        <Typography>Pending</Typography>
                      )}
                      {treatment.paymentStatus === "payNow" && (
                        <Button
                          color="secondary"
                          variant="contained"
                          disabled={isProcessing}
                          onClick={() =>
                            handlePayNow(
                              buildAppointmentFromTreatment(treatment)
                            )
                          }
                          sx={{
                            minWidth: "auto",
                            padding: "4px 8px",
                            fontSize: "0.7rem",
                            background: "#56428B",
                            color: "white",
                            borderRadius: "4px",
                            "&:hover": {
                              background: "#483980",
                            },
                          }}
                        >
                          {isProcessing
                            ? "Processing..."
                            : `Pay Now ₹${getConsultationFee(treatment)}`}
                        </Button>
                      )}
                      {!!message && (
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mt: 0.5, color: "#fff" }}
                        >
                          {message}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.5,
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  >
                    <LocalHospital sx={{ fontSize: 18, color: "#fff" }} />
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
            "& .MuiTablePagination-selectLabel": {
              fontWeight: 500,
              color: "#fff",
            },
            "& .MuiTablePagination-select": {
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "#7b56ce",
              border: "2px solid #7b56ce",
              borderRadius: "8px",
            },
            "& .MuiSelect-icon": {
              color: "#fff",
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#fff",
            },
            "& .MuiTablePagination-actions": {
              color: "#fff",
            },
            "& .MuiIconButton-root": {
              color: "#fff",
            },
          }}
          SelectProps={{
            MenuProps: {
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor: "#7b56ce",
                  color: "#fff",
                },
                "& .MuiMenuItem-root": {
                  color: "#fff",
                  "&.Mui-selected": {
                    backgroundColor: "#6a4bb8",
                  },
                  "&:hover": {
                    backgroundColor: "#7050c1",
                  },
                },
              },
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
          handleCloseViewImageModal(event as any);
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
          onClick={(e) => handleCloseViewImageModal(e)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "relative",
              backgroundColor: "white",
              p: 2,
              borderRadius: 2,
              outline: "none",
              boxShadow: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "90vw",
              maxHeight: "90vh",
            }}
          >
            <IconButton
              aria-label="Close"
              onClick={(e) => handleCloseViewImageModal(e)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
                padding: "1px 6px",
                bgcolor: "rgba(255,255,255,0.95)",
                border: "1px solid #e5e5e5",
                "&:hover": { bgcolor: "rgba(245,245,245,0.98)" },
              }}
            >
              ✕
            </IconButton>

            {viewImageUrl && (
              <iframe
                src={viewImageUrl || "/placeholder.svg"}
                // alt="Preview"
                // style={{
                //   maxWidth: "85vw",
                //   maxHeight: "85vh",
                //   objectFit: "contain",
                //   borderRadius: 8,
                //   display: "block",
                // }}
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
