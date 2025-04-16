"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import {
  Image as ImageIcon,
  Close,
  Description,
  ListAlt,
  CheckCircle,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import { styled } from "@mui/system";
import { creator, fetcher } from "@/apis/apiClient";
import { Utility } from "@/utils";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";

const StyledTextField = styled(TextField)(({ theme }) => ({
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
}));

interface Doctor {
  id: string;
  username: string;
}

const optionsCategory = [
  { label: "Blood Test", value: "blood_test" },
  { label: "X-Ray", value: "x_ray" },
  { label: "Other", value: "other" },
];

const optionsStatus = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const optionsType = [
  { label: "Self", value: "self" },
  { label: "Doctor", value: "doctor" },
];

interface CreateTestDialogProps {
  open: boolean;
  onClose: () => void;
  fetchTests: () => void;
}
const initialFormData = {
  name: "",
  description: "",
  category: "blood_test",
  emptyStomach: false,
  status: "scheduled",
  type: null,
  doctor: null,
  photo: null,
};

const CreateTestDialog: React.FC<CreateTestDialogProps> = ({
  open,
  onClose,
  fetchTests,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { snackbarAndNavigate, decodedToken } = Utility();

  const patientId = decodedToken()?.id;
  const doctorId = decodedToken()?.id;
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const valid = true;
    const newErrors = {
      name: formData.name ? "" : "Name is required",
      description: formData.description ? "" : "Description is required",
      category: formData.category ? "" : "Category is required",
      status: formData.status ? "" : "Status is required",
      type: formData.type ? "" : "Type is required",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      console.log("Doctors API Response:", response);

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
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, emptyStomach: e.target.checked });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],
    }));
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const headers = { "Content-Type": "multipart/form-data" };
      const selectedDoctor = doctors.find((doc) => doc.id === formData.doctor);
      const doctorId = selectedDoctor ? selectedDoctor.id : null;

      const response = await creator(
        "test",
        "create-test",
        {
          ...formData,
          patientId,
          doctorId,
        },
        headers
      );

      if (response.statusCode == 201) {
        snackbarAndNavigate(dispatch, true, "success", "Created successfully");
        fetchTests();
        onClose();
      }
    } catch (error) {
      snackbarAndNavigate(dispatch, true, "error", "Failed to create test");
    }
  };

  useEffect(() => {
    if (formData.type === "doctor") {
      fetchDoctors();
    }
  }, [formData.type]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      sx={{ borderRadius: "50px" }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ color: "#56428B" }}>
          Create Test
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 6, right: 0, color: "#56428B" }}
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
              placeholder="Enter test name"
              InputProps={{
                startAdornment: <ListAlt sx={{ color: "#56428B", mr: 2 }} />,
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
              placeholder="Enter description"
              InputProps={{
                startAdornment: (
                  <Description sx={{ color: "#56428B", mr: 2 }} />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.emptyStomach}
                  onChange={handleCheckboxChange}
                  sx={{
                    color: formData.emptyStomach ? "#56428B" : "default",
                    "&.Mui-checked": { color: "#56428B" },
                  }}
                />
              }
              label="Empty Stomach"
              sx={{ marginTop: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={optionsCategory}
              getOptionLabel={(option) => option.label}
              value={optionsCategory.find(
                (option) => option.value === formData.category
              )}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  category: newValue ? newValue.value : "",
                });
              }}
              fullWidth
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label="Category"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={optionsStatus}
              getOptionLabel={(option) => option.label}
              value={optionsStatus.find(
                (option) => option.value === formData.status
              )}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  status: newValue ? newValue.value : "",
                });
              }}
              fullWidth
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label="Status"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={optionsType}
              getOptionLabel={(option) => option.label}
              value={optionsType.find(
                (option) => option.value === formData.type
              )}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  type: newValue ? newValue.value : null,
                });
              }}
              fullWidth
              renderInput={(params) => (
                <StyledTextField {...params} label="Type" />
              )}
            />
          </Grid>

          {/* Doctor Selection Field */}
          {formData.type === "doctor" && (
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
                isOptionEqualToValue={(option, value) => option.id === value.id}
                fullWidth
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    label="Select Doctor"
                    error={!!errors.doctor}
                    helperText={errors.doctor}
                  />
                )}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={4}>
            <Button
              component="label"
              variant="contained"
              startIcon={<ImageIcon />}
              sx={{
                borderRadius: "12px",
                padding: "10px",
                textAlign: "center",
                backgroundColor: "#56428B",
                cursor: "pointer",
                width: "100%",
                marginTop: 0.6,
                "&:hover": { backgroundColor: "#483980" },
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
                  src={
                    URL.createObjectURL(formData.photo) || "/placeholder.svg"
                  }
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
                    color: "#56428B",
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
    </Dialog>
  );
};

export default CreateTestDialog;
