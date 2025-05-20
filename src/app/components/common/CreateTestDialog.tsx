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
  Add,
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

interface TestItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  emptyStomach: boolean;
}

interface CreateTestDialogProps {
  open: boolean;
  onClose: () => void;
  fetchTests: (newTest: any) => void;
}

const initialTestItem: TestItem = {
  _id: "",
  name: "",
  description: "",
  category: "blood_test",
  emptyStomach: false,
};

const CreateTestDialog: React.FC<CreateTestDialogProps> = ({
  open,
  onClose,
  fetchTests,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { snackbarAndNavigate, decodedToken } = Utility();
  const patientId = decodedToken()?.id;
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [formData, setFormData] = useState({
    status: "scheduled",
    type: null,
    doctor: null,
    photo: null,
    doctorName: "",
  });

  const [testItems, setTestItems] = useState<TestItem[]>([
    { ...initialTestItem },
  ]);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    category: "",
  });

  const handleClose = (event: any, reason: string) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData({
        status: "scheduled",
        type: null,
        doctor: null,
        photo: null,
      });
      setTestItems([{ ...initialTestItem }]);
      setErrors({} as any);
    }
  }, [open]);

  const handleTestItemChange = (
    index: number,
    field: keyof TestItem,
    value: any
  ) => {
    const updatedItems = [...testItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setTestItems(updatedItems);
  };

  const handleAddTest = () => {
    setTestItems([...testItems, { ...initialTestItem }]);
  };

  const handleRemoveTest = (index: number) => {
    if (testItems.length > 1) {
      setTestItems(testItems.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: testItems.some((item) => !item.name) ? "Name is required" : "",
      description: testItems.some((item) => !item.description)
        ? "Description is required"
        : "",
      category: testItems.some((item) => !item.category)
        ? "Category is required"
        : "",
    };

    setErrors(newErrors);
    valid = !Object.values(newErrors).some((error) => error !== "");
    return valid;
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

      if (response && response.results) {
        const formattedDoctors: Doctor[] = response.results.map((doc: any) => ({
          id: doc._id,
          username: doc.username || doc.email || Doctor,
        }));

        setDoctors(formattedDoctors);
        console.log("Processed Doctors:", formattedDoctors);
      }
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const selectedDoctor = doctors.find((doc) => doc.id === formData.doctor);
      const doctorId = selectedDoctor ? selectedDoctor.id : null;

      // Prepare payload
      const payload = {
        patientId: patientId,
        doctorId: doctorId,
        tests: testItems.map((item) => ({
          name: item.name,
          description: item.description,
          category: item.category,
          emptyStomach: item.emptyStomach,
        })),
        status: formData.status,
        type: formData.type,
      };

      const formDataInstance = new FormData();
      formDataInstance.append("payload", JSON.stringify(payload));

      if (formData.photo) {
        formDataInstance.append("photo", formData.photo);
      }

      const response = await creator("test", "create-test", formDataInstance, {
        "Content-Type": "multipart/form-data",
      });

      if (response.statusCode === 201) {
        snackbarAndNavigate(dispatch, true, "success", "Created successfully");
        fetchTests(response.data);
        onClose();
      }
    } catch (error) {
      console.error("API Error:", error);
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
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      sx={{ borderRadius: "50px", fontFamily: "Poppins" }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(180deg, rgba(188,174,224,1) 0%, rgba(255,255,255,1) 100%)",
          borderRadius: 4,
          padding: 2,
        }}
      >
        <DialogTitle sx={{ color: "#56428B" }}>
          <Typography variant="h6">Create Test</Typography>
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
          {testItems.map((item, index) => (
            <Grid
              container
              spacing={3}
              key={index}
              sx={{ mb: 3, pb: 2, borderBottom: "1px dashed #ccc" }}
            >
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  label="Test Name"
                  fullWidth
                  margin="dense"
                  value={item.name}
                  onChange={(e) =>
                    handleTestItemChange(index, "name", e.target.value)
                  }
                  error={!!errors.name && !item.name}
                  helperText={!item.name && errors.name}
                  required
                  placeholder="Enter test name"
                  InputProps={{
                    startAdornment: (
                      <ListAlt sx={{ color: "#56428B", mr: 2 }} />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <StyledTextField
                  label="Description"
                  fullWidth
                  margin="dense"
                  value={item.description}
                  onChange={(e) =>
                    handleTestItemChange(index, "description", e.target.value)
                  }
                  error={!!errors.description && !item.description}
                  helperText={!item.description && errors.description}
                  placeholder="Enter description"
                  InputProps={{
                    startAdornment: (
                      <Description sx={{ color: "#56428B", mr: 2 }} />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <StyledAutocomplete
                  options={optionsCategory}
                  getOptionLabel={(option) => option.label}
                  value={optionsCategory.find(
                    (option) => option.value === item.category
                  )}
                  onChange={(event, newValue) => {
                    handleTestItemChange(
                      index,
                      "category",
                      newValue ? newValue.value : ""
                    );
                  }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="outlined"
                      error={!!errors.category && !item.category}
                      helperText={!item.category && errors.category}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.emptyStomach}
                      onChange={(e) =>
                        handleTestItemChange(
                          index,
                          "emptyStomach",
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
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveTest(index)}
                  disabled={testItems.length === 1}
                  sx={{ ml: 2 }}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}

          {/* Button to Add More */}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddTest}
            sx={{ mb: 3 }}
          >
            Add More Tests
          </Button>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StyledAutocomplete
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
                  <TextField {...params} label="Status" variant="outlined" />
                )}
              />
            </Grid>

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
                    type: newValue ? newValue.value : null,
                  });
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Type" variant="outlined" />
                )}
              />
            </Grid>

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
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
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
                  marginTop: 1.6,
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1976D2 30%, #0D47A1 90%)",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
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

export default CreateTestDialog;
