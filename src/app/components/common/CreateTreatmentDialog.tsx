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
  AddCircle,
  Close,
  CheckCircle,
  Description,
  Timer,
  Repeat,
  Inventory,
  ListAlt,
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
  fetchTreatments: () => void;
}

const CreateTreatmentDialog: React.FC<CreateTreatmentDialogProps> = ({
  open,
  onClose,
  fetchTreatments,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { snackbarAndNavigate, decodedToken } = Utility();
  const patientId = decodedToken()?.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    frequency: "",
    duration: "",
    isEmptyStomach: false,
    type: "arogyaa",
    status: "in progress",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isEmptyStomach: e.target.checked });
  };

  const handleSubmit = async () => {
    try {
      const response = await creator("treatment", "create-treatment", {
        ...formData,
        patientId,
      });

      if (!response) throw new Error("Failed to create treatment");

      snackbarAndNavigate(
        dispatch,
        true,
        "success",
        "Treatment created successfully"
      );

      // **Reset Form Fields after successful submission**
      setFormData({
        name: "",
        description: "",
        quantity: "",
        frequency: "",
        duration: "",
        isEmptyStomach: false,
        type: "arogyaa",
        status: "in progress",
      });

      fetchTreatments();
      onClose();
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
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      sx={{ borderRadius: "50px" }}
    >
      <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 4, padding: 2 }}>
        <DialogTitle
          sx={{
            color: "#20ADA0",
          }}
        >
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
                required
                placeholder="Enter treatment name"
                InputProps={{
                  startAdornment: <ListAlt sx={{ color: "#20ADA0" }} />,
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
                placeholder="Enter description"
                InputProps={{
                  startAdornment: <Description sx={{ color: "#20ADA0" }} />,
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
                placeholder="Enter quantity"
                InputProps={{
                  startAdornment: <Inventory sx={{ color: "#20ADA0" }} />,
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
                placeholder="Enter frequency"
                InputProps={{
                  startAdornment: <Repeat sx={{ color: "#20ADA0" }} />,
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
                placeholder="Enter duration"
                InputProps={{
                  startAdornment: <Timer sx={{ color: "#20ADA0" }} />,
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ marginTop: 2 }} 
              
            >
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
                label="Empty Stomach"
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
                  <TextField {...params} label="Type" variant="outlined" />
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
