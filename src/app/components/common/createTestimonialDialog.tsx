import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  Rating,
  Grid,
  Box,
} from "@mui/material";
import { Close, Star, CheckCircle, Cancel } from "@mui/icons-material";
import { styled } from "@mui/system";
import { creator } from "@/apis/apiClient";
import { Utility } from "@/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const StyledTextField = styled(TextField)({
  "& label": { color: "#29175e" },
  "& label.Mui-focused": { color: "#2ecc71" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#29175e", borderRadius: "10px" },
    "&:hover fieldset": { borderColor: "#29175e" },
    "&.Mui-focused fieldset": { borderColor: "#29175e" },
  },
});

interface CreateTestimonialDialogProps {
  open: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  fetchTestimonials: () => void;
}

const initialFormData = {
  review: "",
  rating: 0,
};

const CreateTestimonialDialog: React.FC<CreateTestimonialDialogProps> = ({
  open,
  onClose,
  doctorId,
  doctorName,
  fetchTestimonials,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { snackbarAndNavigate, decodedToken } = Utility();
  const patientId = decodedToken()?.id;

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await creator("testimonial", "create-testimonial", {
        ...formData,
        doctorId,
        patientId,
      });

      if (response.statusCode === 201) {
        snackbarAndNavigate(
          dispatch,
          true,
          "success",
          "Review submitted successfully!"
        );
        fetchTestimonials();
        onClose();
      }
    } catch (error) {
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Failed to submit review. Please try again."
      );
    }
  };

  const getEmojiForRating = (rating: number) => {
    switch (rating) {
      case 1:
        return "😠";
      case 2:
        return "😞";
      case 3:
        return "😐";
      case 4:
        return "🙂";
      case 5:
        return "😃";
      default:
        return "";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px",
          padding: "10px",
          background: "rgb(188,174,224)",
          background:
            "linear-gradient(180deg, rgba(188,174,224,1) 0%, rgba(255,255,255,1) 100%)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.5rem",
          color: "#29175e",
          fontFamily: "Poppins",
        }}
      >
        Rate Your Experience
      </DialogTitle>

      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          color: "#29175e",
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <Close />
      </IconButton>

      {/* Content */}
      <DialogContent sx={{ padding: "10px" }}>
        <Grid container spacing={3}>
          {/* Doctor Name with Subtext */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{
                color: "#29175e",
                fontFamily: "Poppins",
                fontWeight: "bold",
                marginBottom: "2px",
                fontSize: "20px",
              }}
            >
              Dr. {doctorName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "black",
                fontSize: ".9rem",
                fontFamily: "Poppins",
                fontWeight: "500",
              }}
            >
              How was your experience? Your feedback helps others.
            </Typography>
          </Grid>

          {/* Rating Section */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Rating
              value={formData.rating}
              onChange={(event, newValue) =>
                setFormData({ ...formData, rating: newValue || 0 })
              }
              size="large"
              icon={<Star fontSize="inherit" sx={{ color: "#FFD700" }} />}
              sx={{
                "& .MuiRating-iconHover": { color: "#FFA500" },
              }}
            />
            <Typography
              variant="h5"
              sx={{ marginTop: "10px", fontSize: "2rem" }}
            >
              {getEmojiForRating(formData.rating)}
            </Typography>

            {errors.rating && (
              <Typography color="error">{errors.rating}</Typography>
            )}
          </Grid>

          {/* Review Text */}
          <Grid item xs={12}>
            <StyledTextField
              label="Write a Review"
              name="review"
              fullWidth
              multiline
              rows={4}
              margin="dense"
              value={formData.review}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
              error={!!errors.review}
              helperText={errors.review}
              placeholder={`Share your experience with Dr. ${doctorName}...`}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Action Buttons */}
      <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
        {/* Cancel Button */}
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            minWidth: "100px",
            color: "#fff",
            background: "#29175e",
            borderRadius: "4px",
            marginLeft: "20px",
            ":hover": {
              bgcolor: "#b497d6",
              color: "white",
            },
          }}
          startIcon={<Cancel sx={{ fontSize: 22 }} />}
        >
          Cancel
        </Button>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<CheckCircle />}
          disabled={loading}
          sx={{
            minWidth: "100px",
            color: "#fff",
            background: "#29175e",
            borderRadius: "4px",
            marginLeft: "20px",
            ":hover": {
              bgcolor: "#b497d6",
              color: "white",
            },
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTestimonialDialog;
