"use client";

import React, { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
    Box,
    Collapse,
    Select,
    InputBase,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    Chip,
    Avatar,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Container,
    Divider,
    IconButton,
    Rating,
    Skeleton,
    List,
    ListItemText,
    ListItem,
} from "@mui/material";
import styles from "../page.module.css";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import WorkIcon from "@mui/icons-material/Work";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import VerifiedIcon from "@mui/icons-material/Verified";
import BookAppointmentModal from "../components/common/BookAppointmentModal";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SchoolIcon from "@mui/icons-material/School";
import PhoneIcon from "@mui/icons-material/Phone";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { useGetDoctors } from "@/hooks/doctor";
import { DoctorData } from "@/types/doctor";
import {
    LocalActivityTwoTone,
    LocalHospital,
    LocalHospitalOutlined,
    LocalHospitalSharp,
    Person,
    Person2Rounded,
} from "@mui/icons-material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#20ADA0",
            light: "#4FBEB3",
            dark: "#178F84",
        },
        secondary: {
            main: "#354C5C",
            light: "#5A7082",
            dark: "#233240",
        },
        background: {
            default: "#fff",
        },
    },
    typography: {
        fontFamily: "'system-ui'",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 600,
        },

        h2: {
            fontSize: "2rem",
            fontWeight: 600,
        },
        h3: {
            fontSize: "1.75rem",
            fontWeight: 600,
        },
        h4: {
            fontSize: "1.5rem",
            fontWeight: 600,
        },
        h5: {
            fontSize: "1.25rem",
            fontWeight: 600,
        },
        h6: {
            fontSize: "1rem",
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
});

// Simple debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export default function DoctorListing() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>();
    const [results, setResults] = useState([]);
    const [keyword, setKeyword] = useState<string>("");
    const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
    const [isTyping, setIsTyping] = useState(false);
    const [visibleContactId, setVisibleContactId] = useState(null);

    const [filters, setFilters] = useState({
        gender: "",
        experienceFilter: "",
        sortBy: "",
    });

    const queryParams = {
        ...filters,
        keyword: debouncedKeyword,
    };

    // Create a debounced function to update the debounced keyword state
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setDebouncedKeyword(value);
        }, 500),
        []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKeyword(value);
        debouncedSearch(value);
    };
    const handleClearSearch = () => {
        setKeyword("");
        setDebouncedKeyword("");
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    const {
        value: doctors,
        swrLoading,
        error,
    } = useGetDoctors(null, "get-doctors", 1, 100, queryParams);

    const openModal = (doctor: DoctorData): void => {
        const userToken = Cookies.get("token");
        if (!userToken) {
            const encodedReturnUrl = encodeURIComponent(
                `/doctors?autoBookDoctorId=${doctor._id}`
            );
            router.push(`/signup?redirect=${encodedReturnUrl}`);
            return;
        }
        setSelectedDoctor(doctor);
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
        setSelectedDoctor(null);
    };

    // 3) On mount (or after fetch), check if the URL has ?autoBookDoctorId=XXXX
    //    If the user is already logged in, automatically open the modal for that doctor
    useEffect(() => {
        const token = Cookies.get("token");
        const autoBookDoctorId = searchParams.get("autoBookDoctorId");

        if (token && autoBookDoctorId && doctors?.results?.length) {
            const found = doctors.results.find(
                (doc: DoctorData) => doc._id === autoBookDoctorId
            );
            if (found) {
                setSelectedDoctor(found);
                setModalOpen(true);
            }
        }
    }, [searchParams, doctors?.results?.length]);

    useEffect(() => {
        const urlKeyword = searchParams.get("keyword") || "";
        if (urlKeyword && urlKeyword !== keyword) {
            setKeyword(urlKeyword);
            debouncedSearch(urlKeyword);
        }
    }, [searchParams]);

    if (swrLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    {[...Array(3)].map((_, index) => (
                        <Grid item xs={12} key={index}>
                            <Skeleton variant="rectangular" height={200} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h4" color="error" align="center">
                    Error loading doctor list: {error.message}
                </Typography>
            </Container>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container
                maxWidth={false}
                sx={{
                    py: 12,
                    background: "linear-gradient(135deg, #B6DADA 0%, #B6DADA 100%)",
                }}
            >
                {/* Search Bar */}
                <Grid
                    container
                    spacing={2}
                    sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    {/* Search Bar on the Left */}
                    <Grid item xs={12} sm={8} md={8}>
                        <Paper
                            component="form"
                            className={styles.searchBarWrapper}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                margin: "1rem 0rem",
                                padding: "0.25rem",
                                maxWidth: "400px",
                                width: "100%",
                                borderRadius: "20px",
                                backgroundColor: "rgba(255, 255, 255, 0.90)",
                                position: "relative",
                            }}
                        >
                            <IconButton
                                aria-label="search"
                                className={styles.searchBarButton}
                                sx={{
                                    backgroundColor: "#20ADA0",
                                    color: "#fff",
                                    borderRadius: "90%",
                                    padding: "0.4rem",
                                    "&:hover": {
                                        backgroundColor: "#1A8575",
                                    },
                                }}
                            >
                                <SearchIcon fontSize="small" />
                            </IconButton>
                            <InputBase
                                value={keyword}
                                onChange={handleChange}
                                className={styles.searchBarInput}
                                placeholder="Search by name, specialties and location"
                                inputProps={{ "aria-label": "search" }}
                                sx={{
                                    flex: 1,
                                    padding: "0.3rem 0.5rem",
                                    fontSize: { xs: "0.75rem", sm: "0.9rem" },
                                }}
                            />
                            {keyword && (
                                <IconButton
                                    aria-label="clear"
                                    onClick={handleClearSearch}
                                    sx={{
                                        backgroundColor: "transparent",
                                        color: "#20ADA0",
                                        borderRadius: "50%",
                                        padding: "0.4rem",
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Paper>
                    </Grid>

                    {/* Filters on the Right */}
                    <Grid item xs={12} sm={4} md={4}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "16px",
                            }}
                        >
                            {/* Gender Filter */}
                            <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{
                                    background: "#fff",
                                    borderRadius: "30px",
                                    minWidth: 190,
                                }}
                            >
                                <InputLabel
                                    id="gender-label"
                                    sx={{
                                        backgroundColor: "#fff",
                                        px: 1,
                                        transition: "all 0.3s ease-in-out",
                                        "&.MuiInputLabel-shrink": {
                                            px: 1,
                                            borderRadius: "2px",
                                        },
                                    }}
                                >
                                    Gender
                                </InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender-select"
                                    value={filters.gender}
                                    onChange={(e) => handleFilterChange("gender", e.target.value)}
                                    label="Gender"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderRadius: "40px",
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>All</em>
                                    </MenuItem>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Experience Filter */}
                            <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{
                                    background: "#fff",
                                    borderRadius: "30px",
                                    minWidth: 190,
                                }}
                            >
                                <InputLabel
                                    id="experience-label"
                                    sx={{
                                        backgroundColor: "#fff",
                                        px: 1,
                                        transition: "all 0.3s ease-in-out",
                                        "&.MuiInputLabel-shrink": {
                                            px: 1,
                                            borderRadius: "2px",
                                        },
                                    }}
                                >
                                    Experience
                                </InputLabel>
                                <Select
                                    labelId="experience-label"
                                    id="experience-select"
                                    value={filters.experienceFilter}
                                    onChange={(e) =>
                                        handleFilterChange("experienceFilter", e.target.value)
                                    }
                                    label="Experience"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderRadius: "40px",
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>All</em>
                                    </MenuItem>
                                    <MenuItem value="above 5 years">5+ Years</MenuItem>
                                    <MenuItem value="above 10 years">10+ Years</MenuItem>
                                    <MenuItem value="above 15 years">15+ Years</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Fees Filter */}
                            <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{
                                    background: "#fff",
                                    borderRadius: "30px",
                                    minWidth: 190,
                                }}
                            >
                                <InputLabel
                                    id="fees-label"
                                    sx={{
                                        backgroundColor: "#fff",
                                        px: 1,
                                        transition: "all 0.3s ease-in-out",
                                        "&.MuiInputLabel-shrink": {
                                            px: 1,
                                            borderRadius: "2px",
                                        },
                                    }}
                                >
                                    Fees
                                </InputLabel>
                                <Select
                                    labelId="fees-label"
                                    id="fees-select"
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                                    label="Fees"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderRadius: "40px",
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>All</em>
                                    </MenuItem>
                                    <MenuItem value="fee_high_to_low">High To Low</MenuItem>
                                    <MenuItem value="fee_low_to_high">Low To High</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 1000,
                    }}
                >
                    <Link href="/appointment/chat" passHref>
                        <IconButton
                            color="primary"
                            sx={{
                                backgroundColor: "#20ADA0",
                                color: "#fff",
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                "&:hover": {
                                    backgroundColor: "#178F84",
                                },
                            }}
                        >
                            <ChatIcon fontSize="large" />
                        </IconButton>
                    </Link>
                </Box>
                {/* Doctor List */}
                <Grid
                    container
                    spacing={3}
                    sx={{
                        marginTop: "20px",
                    }}
                >
                    {Array.isArray(doctors?.results) && doctors.results.length > 0 ? (
                        doctors.results.map((doctor: any) => (
                            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                                <Box
                                    sx={{
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    {/* Doctor Header */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "20px",
                                            backgroundColor: "#F5F5F5",
                                        }}
                                    >
                                        {/* Doctor Image */}
                                        <Box
                                            sx={{
                                                position: "relative",
                                                display: "inline-block",
                                            }}
                                        >
                                            {/* Doctor Profile Picture */}
                                            <Box
                                                component="img"
                                                alt="Doctor"
                                                src={
                                                    doctor.profilePicture ||
                                                    "/assets/images/online-doctor-with-white-coat.png"
                                                }
                                                sx={{
                                                    width: { xs: "60px", sm: "80px", md: "100px" },
                                                    height: { xs: "60px", sm: "80px", md: "100px" },
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "3px solid #20ADA0",
                                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                                    transition: "transform 0.3s ease",
                                                    "&:hover": {
                                                        transform: "scale(1.05)",
                                                    },
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    gap: "4px",
                                                    marginTop: "6px",
                                                }}
                                            >
                                                {Cookies.get("token") && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: "4px",
                                                                background:
                                                                    "linear-gradient(135deg, #B3E5FC, #81D4FA)",
                                                                color: "#0277BD",
                                                                padding: "4px 8px",
                                                                minWidth: "40px",
                                                                borderRadius: "15px",
                                                                fontWeight: "500",
                                                                textTransform: "none",
                                                                boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
                                                                transition: "all 0.3s ease",
                                                                "&:hover": {
                                                                    background:
                                                                        "linear-gradient(135deg, #81D4FA, #4FC3F7)",
                                                                    transform: "scale(1.04)",
                                                                },
                                                            }}
                                                            onClick={() =>
                                                                setVisibleContactId((prev) =>
                                                                    prev === doctor._id ? null : doctor._id
                                                                )
                                                            }
                                                        >
                                                            {visibleContactId === doctor._id ? (
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "12px",
                                                                        fontWeight: "bold",
                                                                        color: "#0277BD",
                                                                    }}
                                                                >
                                                                    {doctor.contact}
                                                                </Typography>
                                                            ) : (
                                                                <PhoneIcon sx={{ fontSize: "18px" }} />
                                                            )}
                                                        </Button>

                                                        {doctor.contact && (
                                                            <Button
                                                                variant="contained"
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    backgroundColor: "#25D366",
                                                                    color: "#fff",
                                                                    padding: "4px 8px",
                                                                    minWidth: "40px",
                                                                    borderRadius: "15px",
                                                                    fontWeight: "500",
                                                                    textTransform: "none",
                                                                    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
                                                                    transition: "all 0.3s ease",
                                                                }}
                                                                onClick={() =>
                                                                    window.open(
                                                                        `https://wa.me/${doctor.contact}`,
                                                                        "_blank"
                                                                    )
                                                                }
                                                            >
                                                                <WhatsAppIcon sx={{ fontSize: "18px" }} />
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Doctor Info */}
                                        <Box sx={{ marginLeft: "15px", flex: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: "#333",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                {doctor.username || "Doctor Name"}

                                                {/* Show Verified Tick and Text if Doctor is Verified */}
                                                {doctor.isVerified && (
                                                    <>
                                                        <VerifiedIcon
                                                            sx={{
                                                                color: "#20ADA0", // Green color for verification
                                                                marginLeft: "10px",
                                                                fontSize: "24px",
                                                            }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                fontSize: "14px",
                                                                fontWeight: "500",
                                                                color: "#20ADA0", // Green color for verification text
                                                            }}
                                                        >
                                                            Verified by Arogyaa
                                                        </Typography>
                                                    </>
                                                )}
                                            </Typography>

                                            {/* Qualification Section */}
                                            <Box
                                                sx={{
                                                    mt: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "1px",
                                                    borderRadius: "1px",
                                                    padding: "8px",
                                                    backgroundColor: "#f5f5f5",
                                                    boxShadow: "3px 2px 2px rgba(0, 0, 0, 0.1)",
                                                    height: "150px",
                                                    width: "auto",
                                                }}
                                            >
                                                {/* Education and Qualifications Section */}
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    <SchoolIcon
                                                        sx={{ color: "#20ADA0", fontSize: "30px" }}
                                                    />{" "}
                                                    {/* Qualification Icon */}
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: "8px",
                                                            overflow: "hidden",
                                                            flex: "1",
                                                        }}
                                                    >
                                                        {doctor.qualificationIds?.length > 0 ? (
                                                            doctor.qualificationIds.map((qual, index) => (
                                                                <Typography
                                                                    key={index}
                                                                    variant="body2"
                                                                    sx={{
                                                                        backgroundColor: "#FFD700",
                                                                        color: "#354C5C",
                                                                        padding: "2px 10px",
                                                                        borderRadius: "12px",
                                                                        fontSize: "0.9rem",
                                                                        fontWeight: "500",
                                                                    }}
                                                                >
                                                                    {qual?.name || "Unnamed Qualification"}
                                                                </Typography>
                                                            ))
                                                        ) : (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ color: "#888" }}
                                                            >
                                                                Qualifications not available
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Tags / Specialization Section */}
                                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: "4px",
                                                            mt: 1,
                                                        }}
                                                    >
                                                        {doctor.tags?.length > 0 ? (
                                                            doctor.tags.map((tag, index) => (
                                                                <Box
                                                                    key={index}
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        backgroundColor: "#20ADA0",
                                                                        color: "#fff",
                                                                        padding: "4px 7px",
                                                                        borderRadius: "16px",
                                                                        fontSize: "12px",
                                                                    }}
                                                                >
                                                                    <LocalOfferIcon
                                                                        sx={{
                                                                            fontSize: "16px",
                                                                            marginRight: "6px",
                                                                        }}
                                                                    />{" "}
                                                                    {/* Tag Icon */}
                                                                    <Typography variant="body2">{tag}</Typography>
                                                                </Box>
                                                            ))
                                                        ) : (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ color: "#888" }}
                                                            >
                                                                Specialization Not Available
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Location and Hospital Affiliations */}
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#666",
                                                        mt: 1,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "flex-start",
                                                    }}
                                                >
                                                    {doctor.availability?.length > 0
                                                        ? doctor.availability.map((slot, index) => (
                                                            <Typography
                                                                key={index}
                                                                variant="body2"
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    mb: 0.5, // Adds spacing between items
                                                                }}
                                                            >
                                                                <LocalHospitalIcon
                                                                    fontSize="small"
                                                                    color="primary"
                                                                    sx={{ marginRight: "4px", flexShrink: 0 }}
                                                                />
                                                                <span
                                                                    style={{
                                                                        display: "inline-block",
                                                                        whiteSpace: "normal",
                                                                    }}
                                                                >
                                                                    {slot.hospital?.name || "Unknown Hospital"},{" "}
                                                                    {slot.hospital?.location ||
                                                                        "Unknown Location"}
                                                                </span>
                                                            </Typography>
                                                        ))
                                                        : "Availability not available"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    {/* WhatsApp & Phone Icons Positioned Below the Profile Picture */}

                                    {/* Details Section */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "7px 20px",
                                            backgroundColor: "#fff",
                                            borderTop: "1px solid #f0f0f0",
                                            borderBottom: "1px solid #f0f0f0",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                color: "#555",
                                            }}
                                        >
                                            <WorkIcon fontSize="small" sx={{ color: "#20ADA0" }} />
                                            {doctor.experience
                                                ? `${doctor.experience} Years of Experience`
                                                : "Experience Not Available"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                fontWeight: "bold",
                                                color: "#555",
                                            }}
                                        >
                                            <CurrencyRupeeIcon
                                                fontSize="small"
                                                sx={{ color: "#20ADA0" }}
                                            />
                                            {doctor.consultationFee || "Not Available"}
                                        </Typography>
                                    </Box>

                                    {/* Actions Section */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            backgroundColor: "#fefefe",
                                            borderTop: "1px solid #f0f0f0",
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            startIcon={<Person sx={{ fontSize: "20px" }} />}
                                            sx={{
                                                borderRadius: "0px",
                                                textTransform: "none",
                                                background: "#fff",
                                                color: "#20ADA0",
                                                fontWeight: "600",
                                                borderRight: "1px solid #f0f0f0",
                                                transition: "all 0.2s ease-in-out",
                                            }}
                                            onClick={() => {
                                                router.push(
                                                    `/doctors/profile/${encodeURIComponent(doctor._id)}`
                                                );
                                            }}
                                        >
                                            View Full Profile
                                        </Button>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={<EventIcon sx={{ fontSize: "20px" }} />}
                                            sx={{
                                                borderRadius: "0px",
                                                textTransform: "none",
                                                background: "linear-gradient(90deg, #2A9D8F, #20ADA0)",
                                                transform: "scale(1.02)",
                                                color: "#fff",
                                                fontWeight: "600",
                                                transition: "all 0.3s ease-in-out",
                                                "&:hover": {
                                                    background:
                                                        "linear-gradient(90deg, #2A9D8F, #20ADA0)",
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                            onClick={() => openModal(doctor)}
                                        >
                                            Book Appointment
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Grid
                            item
                            xs={12}
                            style={{
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                borderRadius: "12px",
                                marginLeft: "20px",
                                padding: "20px",
                            }}
                        >
                            <Typography variant="h6" color="textSecondary" align="center">
                                No Doctors Found
                            </Typography>
                        </Grid>
                    )}
                </Grid>
                <BookAppointmentModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    data={selectedDoctor}
                />
            </Container>
        </ThemeProvider>
    );
}
