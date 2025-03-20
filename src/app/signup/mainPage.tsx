"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import LockIcon from "@mui/icons-material/Lock";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import SnackbarComponent from "../components/common/Snackbar";
import { AppDispatch, RootState } from "@/redux/store";
import { creator } from "@/apis/apiClient";
import { useCreatePatient } from "@/hooks/patient";
import { Utility } from "@/utils";

interface SignupResponse {
    token: string;
    message: string;
    statusCode: number;
}

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        age: "",
        email: "",
        contact: "",
        gender: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        age: "",
        email: "",
        contact: "",
        gender: "",
        password: "",
        confirmPassword: "",
    });
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { snackbar } = useSelector((state: RootState) => state.snackbar);
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { snackbarAndNavigate } = Utility();
    const { createPatient } = useCreatePatient("/create-patient");
    const rawRedirect = searchParams.get("redirect");
    const decodedRedirect = rawRedirect ? decodeURIComponent(rawRedirect) : null;

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors: any = {};
        let isValid = true;

        // Username validation
        if (!formData.username) {
            newErrors.username = "Full name is required.";
            isValid = false;
        }

        // Age validation
        if (!formData.age) {
            newErrors.age = "Age is required.";
            isValid = false;
        } else if (!/^\d+$/.test(formData.age)) {
            newErrors.age = "Age must be a valid number.";
            isValid = false;
        } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
            newErrors.age = "Age must be between 18 and 100.";
            isValid = false;
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email address is required.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid.";
            isValid = false;
        }

        // contact validation
        if (!formData.contact) {
            newErrors.contact = "Contact is required.";
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.contact)) {
            newErrors.contact = "Contact must be 10 digits long.";
            isValid = false;
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = "Gender is required.";
            isValid = false;
        }

        // Password validation
        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!formData.password) {
            newErrors.password = "Password is required.";
            isValid = false;
        } else if (!passwordPattern.test(formData.password)) {
            newErrors.password =
                "Password must be at least 8 characters long, contain at least one number, one special character, one uppercase, and one lowercase letter.";
            isValid = false;
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) return;
        const { confirmPassword, ...data } = formData;

        try {
            const createPatientResponse = await createPatient(data);

            if (createPatientResponse?.statusCode === 201) {
                const response: SignupResponse = await creator(
                    'patient',
                    "/login",
                    {
                        email: createPatientResponse?.data?.email,
                        password: data?.password,
                    });
                if (response?.statusCode === 200) {
                    document.cookie = `token=${response.token}; path=/; max-age=${1 * 24 * 60 * 60}; secure; samesite=strict`;
                    snackbarAndNavigate(
                        dispatch,
                        true,
                        "success",
                        "Patient created successfully",
                        () => router.push(decodedRedirect || '/doctors'),
                    );
                }
            } else {
                snackbarAndNavigate(
                    dispatch,
                    true,
                    "error",
                    createPatientResponse?.message || "Error Creating Patient. Please Try Again",
                    null,
                    true
                );
            }
        } catch (error: any) {
            console.log(error, 'this is errp')
            const status = error.response?.status;
            const message = error.response?.message || error.message;
            if (status === 409) {
                snackbarAndNavigate(dispatch, true, "error", "Email already exists.");
            } else if (status === 500) {
                snackbarAndNavigate(
                    dispatch,
                    true,
                    "error",
                    "Internal server error. Please try again."
                );
            } else {
                snackbarAndNavigate(
                    dispatch,
                    true,
                    "error",
                    message || "Signup failed. Please try again.",
                    null,
                    true
                );
            }
        }
    };

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev); // Function to toggle visibility
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                display: "flex",
                height: "100vh",
                alignItems: "center",
                justifyContent: "space-evenly",
                backgroundColor: "#449AC8",
                color: "white",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: { xs: "none", md: "flex" },
                    justifyContent: "center",
                }}
            >
                <img
                    src="https://img.freepik.com/free-vector/medical-health-insurance-with-doctor-patient_107791-11142.jpg?w=900&t=st=1723524662~exp=1723525262~hmac=b248f85be5e4bc60130e807c6b5b9e17d852b5716ec65d985f5905a93a8170a4"
                    alt="doctor"
                    width={700}
                    height={430}
                    style={{
                        borderRadius: 8,
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                        height: "485px"
                    }}
                />
            </Box>

            <Box
                sx={{
                    width: "38%",
                    p: 3,
                    backgroundColor: "white",
                    borderRadius: 2,
                    boxShadow: 3,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        color: "#449AC8",
                    }}
                >
                    Please Fill In Patient Details {decodedRedirect ? 'To Book Appointment' : ''}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="10px"
                        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    >
                        <TextField
                            style={{ marginTop: 10 }}
                            fullWidth
                            name="username"
                            label="Username"
                            variant="outlined"
                            autoComplete="off" // Turn off autofill
                            onChange={handleChange}
                            value={formData.username}
                            error={!!errors.username}
                            helperText={errors.username}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* Age Field */}
                        <TextField
                            style={{ marginTop: 10 }}
                            fullWidth
                            name="age"
                            label="Age"
                            variant="outlined"
                            autoComplete="off" // Turn off autofill
                            onChange={handleChange}
                            value={formData.age}
                            error={!!errors.age}
                            helperText={errors.age}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LooksOneIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            style={{ marginTop: 10, width: "100%" }}
                            fullWidth
                            name="email"
                            label="Email"
                            variant="outlined"
                            autoComplete="off" // Turn off autofill
                            onChange={handleChange}
                            value={formData.email}
                            error={!!errors.email}
                            helperText={errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                                style: { overflow: "auto" }
                            }}
                            inputProps={{
                                style: { whiteSpace: "nowrap" }
                            }}
                            sx={{
                                gridColumn: "span 2",
                            }}
                        />
                        <TextField
                            style={{ marginTop: 10 }}
                            fullWidth
                            name="password"
                            type={showConfirmPassword ? "text" : "password"}
                            label="Password"
                            variant="outlined"
                            onChange={handleChange}
                            value={formData.password}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon /> {/* Password icon */}
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={toggleShowConfirmPassword}
                                            edge="end"
                                            aria-label="toggle confirm password visibility"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            style={{ marginTop: 10 }}
                            fullWidth
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirm Password"
                            variant="outlined"
                            onChange={handleChange}
                            value={formData.confirmPassword}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon /> {/* Lock icon */}
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={toggleShowConfirmPassword}
                                            edge="end"
                                            aria-label="toggle password visibility"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            style={{ marginTop: 10 }}
                            fullWidth
                            name="contact"
                            label="Contact"
                            variant="outlined"
                            autoComplete="off" // Turn off autofill
                            onChange={handleChange}
                            value={formData.contact}
                            error={!!errors.contact}
                            helperText={errors.contact}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl
                            fullWidth
                            style={{ marginTop: 10 }}
                            error={!!errors.gender}
                        >
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                label="Gender"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <WcIcon />
                                    </InputAdornment>
                                }
                                sx={{
                                    textAlign: "left", // Align the select box label and selected value to the left
                                }}
                            >
                                <MenuItem value="male" sx={{ textAlign: "left" }}>
                                    Male
                                </MenuItem>
                                <MenuItem value="female" sx={{ textAlign: "left" }}>
                                    Female
                                </MenuItem>
                                <MenuItem value="other" sx={{ textAlign: "left" }}>
                                    Other
                                </MenuItem>
                            </Select>
                            {errors.gender && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{ textAlign: "left" }}
                                >
                                    {errors.gender}
                                </Typography>
                            )}
                        </FormControl>
                        <Button
                            type="submit"
                            sx={{
                                gridColumn: "span 2",
                                m: "10px auto",
                                backgroundColor: "#449AC8",
                                "&:hover": {
                                    backgroundColor: "#357A9E",
                                },
                            }}
                            variant="contained"
                            fullWidth
                        >
                            Sign Up
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                gridColumn: "span 2",
                                borderColor: "#1976d2",
                                color: "#1976d2",
                            }}
                            onClick={() => {
                                const redirectParam = decodedRedirect
                                    ? `?redirect=${decodedRedirect}`
                                    : '';

                                router.push(`/signin${redirectParam}`);
                            }}
                        >
                            Already have an account? Sign In
                        </Button>
                    </Box>
                </form>
            </Box>
            <SnackbarComponent
                alerting={snackbar.snackbarAlert}
                severity={snackbar.snackbarSeverity}
                message={snackbar.snackbarMessage}
                onClose={handleSnackbarClose}
            />
        </Container>
    );
};

export default Signup;
