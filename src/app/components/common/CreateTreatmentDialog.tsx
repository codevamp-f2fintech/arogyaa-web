"use client";
import React, { useState } from "react";
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
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { creator } from "@/apis/apiClient";
import { Utility } from "@/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const StyledTextField = styled(TextField)({
  "& label": {
    color: "#20ADA0",
  },
  "& label.Mui-focused": {
    color: "#20ADA0",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#20ADA0",
    },
    "&:hover fieldset": {
      borderColor: "#20ADA0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#20ADA0",
    },
  },
});

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#20ADA0",
    },
    "&:hover fieldset": {
      borderColor: "#20ADA0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#20ADA0",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#20ADA0",
  },
  "& .Mui-focused .MuiInputLabel-root": {
    color: "#20ADA0",
  },
}));

const optionsType = [
  { label: "Arogyaa", value: "arogyaa" },
  { label: "Other", value: "other" },
];

const optionsStatus = [
  { label: "In Progress", value: "in progress" },
  { label: "Completed", value: "completed" },
];

interface CreateTreatmentDialogProps {
  open: boolean;
  onClose: () => void;
  fetchTreatments: (newTreatment: any) => void;
}

const CreateTreatmentDialog: React.FC<CreateTreatmentDialogProps> = ({
  open,
  onClose,
  fetchTreatments,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { snackbarAndNavigate, decodedToken } = Utility();
  const patientId = decodedToken()?.id;
  const handleClose = (event: any, reason: string) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    frequency: "",
    duration: "",
    isEmptyStomach: false,
    type: "",
    status: "in progress",
    photo: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    quantity: "",
    frequency: "",
    duration: "",
    type: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: formData.name ? "" : "Name is required",
      description: formData.description ? "" : "Description is required",
      quantity: formData.quantity ? "" : "Quantity is required",
      frequency: formData.frequency ? "" : "Frequency is required",
      duration: formData.duration ? "" : "Duration is required",
      type: formData.type ? "" : "Type is required",
    };

    setErrors(newErrors);
    valid = !Object.values(newErrors).some((error) => error !== "");
    return valid;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        photo: file,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isEmptyStomach: e.target.checked });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      const response = await creator(
        "treatment",
        "create-treatment",
        {
          ...formData,
          patientId,
        },
        headers
      );
      if (response.statusCode == 201) {
        snackbarAndNavigate(dispatch, true, "success", " Created successfully");
        fetchTreatments(response.data);
        onClose();
      }
    } catch (error) {
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Failed to create treatment"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      sx={{ borderRadius: "50px" }}
    >
      <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 4, padding: 2 }}>
        <DialogTitle sx={{ color: "#20ADA0" }}>
          <Typography variant="h6">Create Treatment</Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#20ADA0",
              position: "absolute",
              top: 6,
              right: 0,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Name"
                name="name"
              
                fullWidth
                margin="dense"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                placeholder="Enter treatment name(e.g.,paracetamol)"
                InputProps={{
                  startAdornment: <ListAlt sx={{ color: "#20ADA0", mr: 2 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Description"
                name="description"
                fullWidth
                margin="dense"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Enter description(e.g.,For fever)"
                InputProps={{
                  startAdornment: (
                    <Description sx={{ color: "#20ADA0", mr: 2 }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Quantity"
                name="quantity"
                
                fullWidth
                margin="dense"
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                placeholder="Enter quantity(e.g.,1 capsule)"
                InputProps={{
                  startAdornment: (
                    <Inventory sx={{ color: "#20ADA0", mr: 2 }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Frequency"
                name="frequency"
                fullWidth
                margin="dense"
                value={formData.frequency}
                onChange={handleChange}
                error={!!errors.frequency}
                helperText={errors.frequency}
                placeholder="Enter frequency(e.g.,twice a day)"
                InputProps={{
                  startAdornment: <Repeat sx={{ color: "#20ADA0", mr: 2 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Duration"
                name="duration"
                fullWidth
                margin="dense"
                value={formData.duration}
                onChange={handleChange}
                error={!!errors.duration}
                helperText={errors.duration}
                placeholder="Enter duration(e.g.,7 days)"
                InputProps={{
                  startAdornment: <Timer sx={{ color: "#20ADA0", mr: 2 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }} className="mt-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isEmptyStomach}
                    onChange={handleCheckboxChange}
                    sx={{
                      color: formData.isEmptyStomach ? "#20ADA0" : "default",
                      "&.Mui-checked": {
                        color: "#20ADA0",
                      },
                    }}
                  />
                }
                label="Take on Empty Stomach"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <StyledAutocomplete
                options={optionsType}
                getOptionLabel={(option) => option.label}
                value={
                  optionsType.find(
                    (option) => option.value === formData.type
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    type: newValue ? newValue.value : "",
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    variant="outlined"
                    error={!!errors.type}
                    helperText={errors.type || ""}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
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
                renderInput={(params) => (
                  <TextField {...params} label="Status" variant="outlined" />
                )}
              />
            </Grid>

            {/* Image Upload Grid */}
            <Grid item xs={12} sm={4}>
              <Button
                component="label"
                variant="contained"
                startIcon={<ImageIcon />}
                sx={{
                  borderRadius: "12px",
                  padding: "10px",
                  textAlign: "center",
                  backgroundColor: "#20ADA0",
                  cursor: "pointer",
                  width: "100%",
                  marginTop: 0.6,
                  "&:hover": { backgroundColor: "#20ADA0" },
                  transition: "0.3s",
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

                  {/* Close Button */}
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
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            sx={{ borderRadius: 50, padding: "8px 20px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            sx={{
              borderRadius: 50,
              padding: "8px 20px",
              backgroundColor: "#20ADA0",
              "&:hover": { backgroundColor: "#1B8D80" },
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
