"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  IconButton,
  Box,
  TextField,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  Image as ImageIcon,
  Close,
  CheckCircle,
  ListAlt,
  Description,
  Inventory,
  Repeat,
  Timer,
  Add,
  ArrowDropDown,
  ContrastOutlined,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { creator, fetcher } from "@/apis/apiClient";
import { Utility } from "@/utils";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";

const StyledTextField = styled(TextField)({
  "& label": {
    color: "#56428B",
  },
  "& label.Mui-focused": {
    color: "#56428B",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#B497D6",
    },
    "&:hover fieldset": {
      borderColor: "#56428B",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#56428B",
    },
  },
});

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#B497D6",
    },
    "&:hover fieldset": {
      borderColor: "#56428B",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#56428B",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#56428B",
  },
  "& .Mui-focused .MuiInputLabel-root": {
    color: "#56428B",
  },
}));

interface Doctor {
  id: string;
  username: string;
}

const optionsType = [
  { label: "Arogyaa", value: "arogyaa" },
  { label: "Other", value: "other" },
];

const optionsStatus = [
  { label: "In Progress", value: "in progress" },
  { label: "Completed", value: "completed" },
];

interface TreatmentItem {
  _id: string;
  doctorId: string;
  name: string;
  description?: string;
  quantity?: string;
  frequency?: string;
  duration?: string;
  isEmptyStomach?: boolean;
  type?: string;
  status: string;
  diagnosis: string;
  isFollowUp: boolean;
  followUpDate?: Date;
}

interface CreateTreatmentDialogProps {
  open: boolean;
  onClose: () => void;
  fetchTreatments: (newTreatment: any) => void;
  doctorId: string;
}

const CreateTreatmentDialog: React.FC<CreateTreatmentDialogProps> = ({
  open,
  onClose,
  fetchTreatments,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { snackbarAndNavigate, decodedToken } = Utility();
  const patientId = decodedToken()?.id;
  const doctorId = decodedToken()?.id;
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [medicationOptions, setMedicationOptions] = useState<string[]>([]);
  const [isLoadingMedications, setIsLoadingMedications] = useState(false);

  const handleClose = (event: any, reason: string) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };

  const initialTreatmentItem: TreatmentItem = {
    _id: "",
    doctorId: "",
    status: "in progress", // Add this line
    diagnosis: "",
    isFollowUp: false,
    name: "",
    description: "",
    quantity: "",
    frequency: "",
    duration: "",
    isEmptyStomach: false,
  };

  const [formData, setFormData] = useState({
    type: "",
    status: "in progress",
    photo: null,
    diagnosis: "",
    isFollowUp: false,
    followUpDate: "",
    isEmptyStomach: false,
  });
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    quantity: "",
    frequency: "",
    duration: "",
    type: "",
    diagnosis: "",
  });
  const [treatmentItems, setTreatmentItems] = useState<TreatmentItem[]>([
    { ...initialTreatmentItem },
  ]);

  useEffect(() => {
    if (!open) {
      setFormData(initialTreatmentItem);
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchExistingMedications();
      setTreatmentItems([{ ...initialTreatmentItem }]);
    }
  }, [open]);

  const fetchExistingMedications = async () => {
    setIsLoadingMedications(true);
    try {
      const response = await fetcher(
        "treatment",
        `get-treatments-by-patientId/${patientId}?page=1&limit=1000`
      );

      if (response?.results) {
        const allMedications = response.results.flatMap((treatment) =>
          treatment.treatments.map((item) => item.name)
        );
        const uniqueMedications = Array.from(
          new Set(allMedications.filter(Boolean))
        );
        setMedicationOptions(uniqueMedications);
      }
    } catch (error) {
      console.error("Failed to fetch medications", error);
    } finally {
      setIsLoadingMedications(false);
    }
  };

  const handleTreatmentItemChange = (
    index: number,
    field: keyof TreatmentItem,
    value: any
  ) => {
    const updatedItems = [...treatmentItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setTreatmentItems(updatedItems);
  };

  const handleAddTreatment = () => {
    setTreatmentItems([...treatmentItems, { ...initialTreatmentItem }]);
  };

  const handleRemoveTreatment = (index: number) => {
    if (treatmentItems.length > 1) {
      setTreatmentItems(treatmentItems.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: treatmentItems.some((item) => !item.name) ? "Name is required" : "",
      description: treatmentItems.some((item) => !item.description)
        ? "Description is required"
        : "",
      quantity: treatmentItems.some((item) => !item.quantity)
        ? "Quantity is required"
        : "",
      frequency: treatmentItems.some((item) => !item.frequency)
        ? "Frequency is required"
        : "",
      duration: treatmentItems.some((item) => !item.duration)
        ? "Duration is required"
        : "",
      type: formData.type ? "" : "Type is required",
      diagnosis: formData.diagnosis ? "" : "Diagnosis is required",
    };

    setErrors(newErrors);
    valid = !Object.values(newErrors).some((error) => error !== "");
    return valid;
  };

  const handleImageUpload = (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        photo: file,
      }));
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetcher("doctor", "get-doctors");

      if (response && response.results) {
        const formattedDoctors: Doctor[] = response.results.map((doc: any) => ({
          id: doc._id,
          username: doc.username || doc.email || `Doctor`,
        }));

        setDoctors(formattedDoctors);
        console.log("Processed Doctors:", formattedDoctors);
      }
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const selectedDoctor = doctors.find((doc) => doc.id === formData.doctor);
      const doctorId = selectedDoctor ? selectedDoctor.id : null;

      const payload = {
        patientId: patientId,
        doctorId: doctorId,
        treatments: treatmentItems.map((item) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          frequency: item.frequency,
          duration: item.duration,
          isEmptyStomach: item.isEmptyStomach,
          status: item.status, // Add this line
        })),
        type: formData.type,
        diagnosis: formData.diagnosis,
        isFollowUp: formData.isFollowUp,
        followUpDate: formData.followUpDate,
        status: formData.status,
      };

      const formDataInstance = new FormData();
      formDataInstance.append("payload", JSON.stringify(payload));

      if (formData.photo) {
        formDataInstance.append("photo", formData.photo);
      }

      const response = await creator(
        "treatment",
        "create-treatment",
        formDataInstance,
        { "Content-Type": "multipart/form-data" }
      );

      if (response.statusCode === 201) {
        snackbarAndNavigate(dispatch, true, "success", "Created successfully");
        fetchTreatments(response.data);
        onClose();
      }
    } catch (error) {
      console.error("API Error:", error);
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Failed to create treatment"
      );
    }
  };

  useEffect(() => {
    if (formData.type === "arogyaa") {
      fetchDoctors();
    }
  }, [formData.type]);

  const getAvailableMedications = (currentIndex: number) => {
    return medicationOptions.filter(
      (med) =>
        !treatmentItems.some(
          (item, idx) => idx !== currentIndex && item.name === med
        )
    );
  };

  const optionsMedicationStatus = [
    { label: "In Progress", value: "in progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      sx={{ borderRadius: "50px", fontFamily: "Poppins" }}
    >
      <Box
        sx={{
          // background:
          //   "linear-gradient(180deg, rgba(188,174,224,1) 0%, rgba(255,255,255,1) 100%)",
          background: "white",
          borderRadius: 1,
          padding: 2,
        }}
      >
        <DialogTitle sx={{ color: "#56428B" }}>
          <Typography variant="h6">Create Treatment</Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#56428B",
              position: "absolute",
              top: 6,
              right: 0,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          {treatmentItems.map((item, index) => (
            <Grid
              container
              spacing={3}
              key={index}
              sx={{ mb: 3, pb: 2, borderBottom: "1px dashed #ccc" }}
            >
              <Grid item xs={12} sm={4}>
                <StyledAutocomplete
                  freeSolo
                  options={getAvailableMedications(index)} // Use filtered options
                  loading={isLoadingMedications}
                  value={item.name}
                  onChange={(event, newValue) => {
                    handleTreatmentItemChange(index, "name", newValue || "");
                    // Refresh options when a new medication is selected
                    if (newValue && !medicationOptions.includes(newValue)) {
                      setMedicationOptions((prev) => [...prev, newValue]);
                    }
                  }}
                  onInputChange={(event, newInputValue) =>
                    handleTreatmentItemChange(index, "name", newInputValue)
                  }
                  componentsProps={{
                    paper: {
                      sx: {
                        bgcolor: "#56428B",
                        color: "black",
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Medication Name"
                      fullWidth
                      margin="dense"
                      error={!!errors.name && !item.name}
                      helperText={!item.name && errors.name}
                      required
                      placeholder="Search or enter medication name"
                      InputProps={{
                        ...params.InputProps,

                        startAdornment: (
                          <>
                            <ListAlt sx={{ color: "#56428B", mr: 2 }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                        sx: {
                          color: "#56428B", // Change input text color here
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <StyledTextField
                  label="Description"
                  fullWidth
                  margin="dense"
                  value={item.description}
                  onChange={(e) =>
                    handleTreatmentItemChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  error={!!errors.description && !item.description}
                  helperText={!item.description && errors.description}
                  placeholder="Enter description(e.g.,For fever)"
                  InputProps={{
                    startAdornment: (
                      <Description sx={{ color: "#56428B", mr: 2 }} />
                    ),
                  }}
                  inputProps={{
                    style: {
                      color: "#56428B", // <-- Set text color here
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  label="Dosage"
                  fullWidth
                  margin="dense"
                  value={item.quantity}
                  onChange={(e) =>
                    handleTreatmentItemChange(index, "quantity", e.target.value)
                  }
                  error={!!errors.quantity && !item.quantity}
                  helperText={!item.quantity && errors.quantity}
                  placeholder="Enter quantity(e.g., 500 mg)"
                  InputProps={{
                    startAdornment: (
                      <Inventory sx={{ color: "#56428B", mr: 2 }} />
                    ),
                  }}
                  inputProps={{
                    style: {
                      color: "#56428B", // Set text color
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  label="Frequency"
                  fullWidth
                  value={item.frequency}
                  onChange={(e) =>
                    handleTreatmentItemChange(
                      index,
                      "frequency",
                      e.target.value
                    )
                  }
                  placeholder="(e.g., twice a day, every 6 hours)"
                  InputProps={{
                    startAdornment: <Repeat sx={{ color: "#56428B", mr: 2 }} />,
                  }}
                  inputProps={{
                    style: {
                      color: "#56428B", // <-- Sets input text color
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  label="Duration"
                  fullWidth
                  value={item.duration}
                  onChange={(e) =>
                    handleTreatmentItemChange(index, "duration", e.target.value)
                  }
                  placeholder="Duration (e.g., 5 days, 1 month)"
                  InputProps={{
                    startAdornment: <Timer sx={{ color: "#56428B", mr: 2 }} />,
                  }}
                  inputProps={{
                    style: {
                      color: "#56428B", // Input text color
                    },
                  }}
                />
              </Grid>
              {/* Add this after the Duration field */}
              <Grid item xs={12} sm={2}>
                <StyledAutocomplete
                  options={optionsMedicationStatus}
                  getOptionLabel={(option) => option.label}
                  value={optionsMedicationStatus.find(
                    (option) => option.value === item.status
                  )}
                  onChange={(event, newValue) =>
                    handleTreatmentItemChange(
                      index,
                      "status",
                      newValue?.value || "in progress"
                    )
                  }
                  fullWidth
                  popupIcon={<ArrowDropDown sx={{ color: "#56428B" }} />}
                  PaperComponent={({ children }) => (
                    <Paper
                      sx={{
                        backgroundColor: "#56428B",
                        color: "#fff",
                        borderRadius: 2,
                        mt: 1,
                        "& .MuiAutocomplete-option": {
                          color: "#fff",
                          '&[aria-selected="true"]': {
                            backgroundColor: "#3E2E6E",
                          },
                          "&:hover": {
                            backgroundColor: "#3E2E6E",
                          },
                        },
                      }}
                    >
                      {children}
                    </Paper>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status"
                      InputProps={{
                        ...params.InputProps,
                        sx: { color: "#56428B" },
                      }}
                      InputLabelProps={{
                        sx: { color: "#56428B" },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.isEmptyStomach}
                      onChange={(e) =>
                        handleTreatmentItemChange(
                          index,
                          "isEmptyStomach",
                          e.target.checked
                        )
                      }
                      sx={{
                        color: "#56428B",
                        "&.Mui-checked": { color: "#56428B" },
                      }}
                    />
                  }
                  label="Empty Stomach"
                  sx={{
                    color: "#56428B", // This sets the label color
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveTreatment(index)}
                  disabled={treatmentItems.length === 1}
                  sx={{ ml: 2 }}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddTreatment}
            sx={{
              mb: 3,
              color: "#56428B",
              borderColor: "#56428B",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(86, 66, 139, 0.08)", // Light purple on hover
                borderColor: "#56428B",
              },
            }}
          >
            Add More medications
          </Button>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StyledAutocomplete
                options={optionsType}
                getOptionLabel={(option) => option.label}
                value={optionsType.find(
                  (option) => option.value === formData.type
                )}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    type: newValue ? newValue.value : "",
                  });
                }}
                fullWidth
                popupIcon={<ArrowDropDown sx={{ color: "#56428B" }} />}
                PaperComponent={({ children }) => (
                  <Paper
                    sx={{
                      backgroundColor: "#56428B", // Deep purple dropdown background
                      color: "#fff", // White text
                      borderRadius: 2,
                      mt: 1,
                    }}
                  >
                    {children}
                  </Paper>
                )}
                sx={{
                  "& .MuiAutocomplete-option": {
                    backgroundColor: "#56428B",
                    color: "#fff",
                    "&[aria-selected='true']": {
                      backgroundColor: "#453278", // Slightly darker on selection
                    },
                    "&:hover": {
                      backgroundColor: "#453278", // Same as selected on hover
                    },
                  },
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "#56428B",
                  },
                }}
                // componentsProps={{
                //   paper: {
                //     sx: {
                //       bgcolor: "#f8f6fc", // Optional light background for dropdown
                //       color: "#56428B", // Dropdown item text color
                //     },
                //   },
                // }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    variant="outlined"
                    error={!!errors.type}
                    helperText={errors.type || ""}
                    InputLabelProps={{
                      style: {
                        color: "#56428B", // Label color like in image
                        fontWeight: 500,
                      },
                    }}
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#56428B", // Light purple border
                        },
                        "&:hover fieldset": {
                          borderColor: "#56428B",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#56428B",
                        },
                        color: "#56428B", // Text color
                      },
                      "& .MuiInputBase-input": {
                        color: "#56428B", // Ensures the input text is purple
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4} marginTop={-1}>
              <StyledTextField
                label="Instructions / Notes"
                name="diagnosis"
                fullWidth
                margin="dense"
                value={formData.diagnosis}
                onChange={handleChange}
                error={!!errors.diagnosis}
                helperText={errors.diagnosis}
                placeholder="(e.g.,take after food,avoid alcohol)"
                InputProps={{
                  startAdornment: (
                    <Description sx={{ color: "#56428B", mr: 2 }} />
                  ),
                }}
                inputProps={{
                  style: {
                    color: "#56428B", // Text color
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#56428B", // Label color
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#56428B",
                    },
                    "&:hover fieldset": {
                      borderColor: "#56428B",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#56428B",
                    },
                  },
                }}
              />
            </Grid>
            {formData.type === "arogyaa" && (
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={doctors}
                  getOptionLabel={(option) => option.username}
                  value={
                    doctors.find((doc) => doc.id === formData.doctor) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      doctor: newValue ? newValue.id : null,
                    });
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  popupIcon={<ArrowDropDown sx={{ color: "#56428B" }} />}
                  PaperComponent={({ children }) => (
                    <Paper
                      sx={{
                        backgroundColor: "#56428B", // Dropdown background
                        color: "#FFFFFF", // White text
                        borderRadius: 2,
                        mt: 1,
                        boxShadow: 3,
                      }}
                    >
                      {children}
                    </Paper>
                  )}
                  sx={{
                    "& .MuiAutocomplete-option": {
                      backgroundColor: "#56428B",
                      color: "#FFFFFF",
                      "&[aria-selected='true']": {
                        backgroundColor: "#453278",
                      },
                      "&:hover": {
                        backgroundColor: "#453278",
                      },
                    },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF", // White background for input
                      borderRadius: 2,
                      color: "#56428B", // Purple input text
                      "& fieldset": {
                        borderColor: "#56428B",
                      },
                      "&:hover fieldset": {
                        borderColor: "#56428B",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#56428B",
                      },
                    },
                    "& .MuiAutocomplete-popupIndicator": {
                      color: "#56428B",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Doctor"
                      error={!!errors.doctor}
                      helperText={errors.doctor}
                      InputLabelProps={{
                        style: {
                          color: "#56428B", // Match label to theme
                          fontWeight: 500,
                        },
                      }}
                      // sx={{
                      //   backgroundColor: "#E7DEF6", // Light purple background
                      //   borderRadius: 2,
                      //   "& .MuiOutlinedInput-root": {
                      //     "& fieldset": {
                      //       borderColor: "#56428B",
                      //     },
                      //     "&:hover fieldset": {
                      //       borderColor: "#56428B",
                      //     },
                      //     "&.Mui-focused fieldset": {
                      //       borderColor: "#56428B",
                      //     },
                      //     color: "#56428B", // Input text
                      //   },
                      // }}
                    />
                  )}
                />
              </Grid>
            )}
            {/* <Grid item xs={12} sm={4}>
              <StyledAutocomplete
                options={optionsStatus}
                getOptionLabel={(option) => option.label}
                value={
                  optionsStatus.find(
                    (option) => option.value === formData.status
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    status: newValue ? newValue.value : "",
                  });
                }}
                fullWidth
                PaperComponent={(props) => (
                  <Paper
                    {...props}
                    sx={{
                      backgroundColor: "#56428B",
                      color: "#fff",
                      borderRadius: 2,
                      "& .MuiAutocomplete-option": {
                        color: "#fff",
                        '&[aria-selected="true"]': {
                          backgroundColor: "#3E2E6E",
                        },
                        "&:hover": {
                          backgroundColor: "#3E2E6E",
                        },
                      },
                    }}
                  />
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      sx: { color: "#56428B" }, // Text color
                    }}
                    InputLabelProps={{
                      sx: { color: "#56428B" }, // Label color
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#56428B",
                        },
                        "&:hover fieldset": {
                          borderColor: "#56428B",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#56428B",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={12} sm={4} sx={{ mt: 0 }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<ImageIcon sx={{ color: "#fff" }} />}
                sx={{
                  borderRadius: "12px",
                  padding: "10px",
                  textAlign: "center",
                  backgroundColor: "#56428B",
                  color: "#fff",
                  cursor: "pointer",
                  width: "100%",
                  marginTop: 1.6,
                  transition: "all 0.3s ease",
                  boxShadow: "0px 2px 8px rgba(86, 66, 139, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #56428B 30%, #3E2E6E 90%)",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  id="image-upload"
                  onChange={handleImageUpload}
                />
              </Button>

              {formData.photo && (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxHeight: "200px",
                    marginTop: 2,
                    borderRadius: 8,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <IconButton
                    onClick={() => setFormData({ ...formData, photo: null })}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 8,
                      color: "#20ADA0",
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              )}
            </Grid>
            <Grid item xs={3} sm={3} sx={{ mt: 2, ml: 11.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isFollowUp}
                    onChange={(e) =>
                      setFormData({ ...formData, isFollowUp: e.target.checked })
                    }
                    sx={{
                      color: "#56428B",
                      "&.Mui-checked": { color: "#56428B" },
                    }}
                    // sx={{
                    //   color: formData.isFollowUp ? "#3f51b5" : "default",
                    //   "&.Mui-checked": { color: "#56428B" },
                    // }}
                  />
                }
                label="Is Follow Up?"
                sx={{
                  color: "#56428B",
                  "& .MuiFormControlLabel-label": {
                    fontWeight: 500,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Start Date"
                name="followUpDate"
                type="date"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                value={formData.followUpDate}
                onChange={(e) =>
                  setFormData({ ...formData, followUpDate: e.target.value })
                }
                disabled={!formData.isFollowUp}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#56428B", // normal border
                    },
                    "&.Mui-disabled fieldset": {
                      borderColor: "#A28FCB", // softer purple for disabled
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#F3EFFA", // soft purple background
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#56428B",
                    "&.Mui-disabled": {
                      color: "#A28FCB", // soft purple text
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#56428B",
                    "&.Mui-disabled": {
                      color: "#A28FCB",
                    },
                  },
                  "& input::placeholder": {
                    color: "#A28FCB",
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            sx={{
              borderRadius: 50,
              padding: "8px 20px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CloseIcon fontSize="small" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{
              borderRadius: 50,
              padding: "8px 20px",
              backgroundColor: "#56428B",
              "&:hover": { backgroundColor: "#483980" },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateTreatmentDialog;
