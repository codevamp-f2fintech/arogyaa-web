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
  OutlinedInput,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import styles from "../page.module.css";
// import ChatIcon from "@mui/icons-material/Chat";
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
import DoctorCardSkeleton from "../components/Search-loader";
import Loader from "../components/common/Loader";

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
      main: "#3ab795",
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

const LIMIT = 4;

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
  // const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [visibleContactId, setVisibleContactId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  // Add these new states for pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [combinedDoctors, setCombinedDoctors] = useState<DoctorData[]>([]);

  const [filters, setFilters] = useState({
    gender: "",
    experienceFilter: "",
    sortBy: "",
    location: searchParams.get("location") || "", // Initialize with location from URL
  });

  const queryParams = {
    ...filters,
    keyword: debouncedKeyword,
  };

  // Create a debounced function to update the debounced keyword state
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setLoading(true);
      setDebouncedKeyword(value);
      setLoading(false);
    }, 700),
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

  // Add this code here:
  const debouncedLocationChange = useCallback(
    debounce((value: string) => {
      // Update the URL without page reload
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set("location", value);
      } else {
        params.delete("location");
      }
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
      );
    }, 500),
    []
  );

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  // Get doctors data
  const {
    value: doctors,
    swrLoading,
    error,
  } = useGetDoctors(null, "get-doctors", page, LIMIT, queryParams);

  // Combine doctors when new data is fetched
  useEffect(() => {
    // console.log("this is useeffect", doctors, page);
    if (doctors?.results) {
      if (page === 1) {
        // console.log("this is ", doctors);
        setCombinedDoctors(doctors.results);
      } else {
        setCombinedDoctors((prev) => [...prev, ...doctors.results]);
      }
      // Check if there are more doctors to load
      setHasMore(doctors.results.length >= LIMIT);
    }
  }, [page, doctors?.results.length]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const scrolledPercentage = (scrollTop + windowHeight) / docHeight;

      if (
        scrolledPercentage < 0.5 || // Trigger when scrolled halfway down
        isFetching ||
        !hasMore ||
        swrLoading
      ) {
        return;
      }

      setIsFetching(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore, swrLoading]);

  // Load more data when isFetching becomes true
  useEffect(() => {
    if (!isFetching) return;

    setPage((prev) => prev + 1);
    setIsFetching(false);
  }, [isFetching]);
  const userToken = Cookies.get("token");

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

  // Reset combined doctors and page when filters change
  // useEffect(() => {
  //   setPage(1);
  //   setCombinedDoctors([]);
  //   setHasMore(true);
  // }, [filters, debouncedKeyword]);

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
    const urlLocation = searchParams.get("location") || "";

    if (urlKeyword && urlKeyword !== keyword) {
      setKeyword(urlKeyword);
      debouncedSearch(urlKeyword);
    }

    if (urlLocation && urlLocation !== filters.location) {
      handleFilterChange("location", urlLocation);
    }
  }, [searchParams]);

  // if (swrLoading) {
  //   return (
  //     <Container maxWidth="lg" sx={{ py: 8 }}>
  //       <Grid container spacing={4}>
  //         {[...Array(3)].map((_, index) => (
  //           <Grid item xs={12} key={index}>
  //             <Skeleton variant="rectangular" height={200} />
  //           </Grid>
  //         ))}
  //       </Grid>
  //     </Container>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Container maxWidth="lg" sx={{ py: 8 }}>
  //       <Typography variant="h4" color="error" align="center">
  //         Error loading doctor list: {error.message}
  //       </Typography>
  //     </Container>
  //   );
  // }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        sx={{
          py: 12,
          background:
            "linear-gradient(180deg, rgba(175,159,219,1) 0%, rgba(190,176,225,1) 100%)",
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
          {/* Search Bar Section */}
          <Grid item xs={12} md={8} lg={8}>
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
              {!keyword && (
                <IconButton
                  aria-label="search"
                  className={styles.searchBarButton}
                  sx={{ color: "#29175e" }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              )}
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
                  sx={{ color: "#29175e" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Paper>
          </Grid>

          {/* Filters Section */}
          <Grid item xs={12} md={4} lg={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                  md: "column",
                  lg: "row",
                },
                justifyContent: {
                  xs: "center",
                  sm: "flex-start",
                  md: "flex-end",
                },
                gap: { xs: 2, sm: 1, md: 2 },
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                  md: "stretch",
                  lg: "center",
                },
                width: "100%",
              }}
            >
              {/* Location Filter */}
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  background: "#f7f6f5",
                  borderRadius: "40px",
                  minWidth: { xs: "100%", sm: 160, md: 180, lg: 190 },
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3ab795",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    py: "10px",
                    px: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3ab795 !important", // ✅ Hover border black
                  },
                }}
              >
                <InputLabel
                  htmlFor="location-search"
                  sx={{
                    backgroundColor: "#f7f6f5",
                    px: 1,
                    transition: "all 0.3s ease-in-out",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -9px) scale(0.75)",
                      px: 1,
                      borderRadius: "100px",
                    },
                  }}
                >
                  Location
                </InputLabel>
                <OutlinedInput
                  id="location-search"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  label="Location"
                  autoComplete="off"
                  startAdornment={
                    <InputAdornment
                      position="start"
                      sx={{ color: "#665dfe", ml: 1 }}
                    >
                      <LocationOnIcon />
                    </InputAdornment>
                  }
                  endAdornment={
                    filters.location && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleFilterChange("location", "")}
                          edge="end"
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                  sx={{
                    borderRadius: "40px",
                    "& .MuiOutlinedInput-input": {
                      py: "10px",
                      px: 1,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#665dfe !important",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#665dfe !important",
                      borderWidth: "1px",
                    },
                  }}
                />
              </FormControl>

              {/* Gender Filter */}
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  background: "#f7f6f5",
                  borderRadius: "30px",
                  minWidth: { xs: "100%", sm: 160, md: 180, lg: 190 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <InputLabel
                  id="gender-label"
                  sx={{
                    backgroundColor: "#f7f6f5",
                    px: 1,
                    transition: "all 0.3s ease-in-out",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "&.MuiInputLabel-shrink": {
                      px: 1,
                      borderRadius: "100px",
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
                    "& .MuiSelect-select": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              {/* Experience Filter */}
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  background: "#f7f6f5",
                  borderRadius: "30px",
                  minWidth: { xs: "100%", sm: 160, md: 180, lg: 190 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <InputLabel
                  id="experience-label"
                  sx={{
                    backgroundColor: "#f7f6f5",
                    borderRadius: "100px",
                    px: 1,
                    transition: "all 0.3s ease-in-out",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "&.MuiInputLabel-shrink": {
                      px: 1,
                      borderRadius: "100px",
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
                    "& .MuiSelect-select": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="above 5 years">5+ Years</MenuItem>
                  <MenuItem value="above 10 years">10+ Years</MenuItem>
                  <MenuItem value="above 15 years">15+ Years</MenuItem>
                </Select>
              </FormControl>

              {/* Fees Filter */}
              <FormControl
                variant="outlined"
                size="small"
                sx={{
                  background: "#f7f6f5",
                  borderRadius: "30px",
                  minWidth: { xs: "100%", sm: 160, md: 180, lg: 190 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <InputLabel
                  id="fees-label"
                  sx={{
                    backgroundColor: "#f7f6f5",
                    borderRadius: "100px",
                    px: 1,
                    transition: "all 0.3s ease-in-out",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "&.MuiInputLabel-shrink": {
                      px: 1,
                      borderRadius: "100px",
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
                    "& .MuiSelect-select": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="fee_high_to_low">High To Low</MenuItem>
                  <MenuItem value="fee_low_to_high">Low To High</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Skeleton Shown When No Keyword */}
          {loading && (
            <Grid item xs={12} sm={6} md={4}>
              <DoctorCardSkeleton />
            </Grid>
          )}
        </Grid>

        {/* <Box
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
                backgroundColor: "#3ab795",
                color: "#29175e",
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
        </Box> */}
        {/* Doctor List */}
        <Grid
          container
          spacing={3}
          sx={{
            marginTop: "20px",
          }}
        >
          {error && (
            <Container maxWidth="lg" sx={{ py: 8 }}>
              <Typography variant="h4" color="error" align="center">
                Error loading doctor list: {error.message}
              </Typography>
            </Container>
          )}
          {swrLoading && page === 1 ? (
            <Container maxWidth="lg" sx={{ py: 8 }}>
              <Grid container spacing={4}>
                {[...Array(3)].map((_, index) => (
                  <Grid item xs={12} key={index}>
                    <Skeleton variant="rectangular" height={200} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          ) : combinedDoctors.length > 0 ? (
            combinedDoctors.map((doctor: DoctorData) => (
              <Grid item xs={12} sm={6} md={6} key={doctor._id}>
                <Box
                  sx={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "20px",
                      backgroundColor: "#5d4993",
                    }}
                  >
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
                        border: "3px solid #29175e",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />

                    <Box
                      sx={{
                        marginLeft: "15px",
                        flex: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {doctor.username || "Doctor Name"}

                        {doctor.isVerified && (
                          <>
                            <VerifiedIcon
                              sx={{
                                color: "#3ab795",
                                marginLeft: "10px",
                                fontSize: "24px",
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#3ab795",
                              }}
                            >
                              Verified
                            </Typography>
                          </>
                        )}
                      </Typography>

                      <Box
                        sx={{
                          mt: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "1px",
                          borderRadius: "1px",
                          padding: "8px",
                          backgroundColor: "transparent",
                          height: "25vh",
                          width: "auto",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <SchoolIcon
                            sx={{ color: "#3ab795", fontSize: "30px" }}
                          />
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
                                    backgroundColor: "#3ab795",
                                    color: "#fff",
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

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: {
                              xs: "50vw",
                              sm: "25vw",
                              md: "35vw",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "nowrap", // Changed from wrap to nowrap
                              gap: "4px",
                              mt: 1,
                              overflowX: "auto", // Enable horizontal scrolling
                              pb: 1, // Add some padding for scrollbar
                              "&::-webkit-scrollbar": {
                                height: "4px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#aaa",
                                borderRadius: "4px",
                              },
                            }}
                          >
                            {doctor.tags?.length > 0 ? (
                              doctor.tags.map((tag, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "#29175e",
                                    color: "#fff",
                                    padding: "4px 7px",
                                    borderRadius: "16px",
                                    fontSize: "12px",
                                    flexShrink: 0, // Prevent items from shrinking
                                  }}
                                >
                                  <LocalOfferIcon
                                    sx={{
                                      fontSize: "16px",
                                      marginRight: "6px",
                                    }}
                                  />
                                  <Typography variant="body2">{tag}</Typography>
                                </Box>
                              ))
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#888",
                                  flexShrink: 0, // Keep consistent with other items
                                }}
                              >
                                Specialization Not Available
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "white", // Set text color to white
                            maxHeight: "30vh", // 30% of viewport height
                            minHeight: "80px",
                            overflowY: "auto", // Add scroll when content overflows

                            flex: 1, // Take up remaining space
                            paddingRight: "8px", // Prevent content from touching scrollbar
                            "&::-webkit-scrollbar": {
                              width: "6px",
                              height: "20px",
                            },
                            "&::-webkit-scrollbar-track": {
                              background: "transparent",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "#aaa",
                              borderRadius: "3px",
                            },
                            width: {
                              xs: "50vw",
                              md: "auto",
                              sm: "30vw",
                            },

                            mt: 2,
                          }}
                        >
                          {doctor.availability?.length > 0
                            ? [
                                ...new Map(
                                  doctor.availability.map((slot) => [
                                    `${slot.hospital?.name}-${slot.hospital?.location}`,
                                    slot,
                                  ])
                                ).values(),
                              ].map((slot, index) => (
                                <Typography
                                  key={index}
                                  variant="body2"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    mb: 0.5,
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
                      {/* <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          gap: "4px",
                          marginTop: "6px",
                          mr: "20vw",
                          height: "7vh",
                          width: "25vh",
                          flexDirection: "row",
                          marginLeft: "1vw",
                        }}
                      >
                        {Cookies.get("token") && (
                          <>
                            {doctor.contact && (
                              // <Button
                              //   variant="contained"
                              //   sx={{
                              //     display: "flex",
                              //     alignItems: "center",
                              //     justifyContent: "center",
                              //     backgroundColor: "#25D366",
                              //     color: "#fff",
                              //     minWidth: "2vw",
                              //     padding: "1vw",
                              //     maxWidth: "7vw",
                              //     borderRadius: "15px",
                              //     fontWeight: "500",
                              //     textTransform: "none",
                              //     boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
                              //     transition: "all 0.3s ease",
                              //     height: "6vh",
                              //   }}
                              //   onClick={() =>
                              //     window.open(
                              //       `https://wa.me/${doctor.contact}`,
                              //       "_blank"
                              //     )
                              //   }
                              // >
                              //   <WhatsAppIcon sx={{ fontSize: "18px" }} />
                              // </Button>
                            )}
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
                                padding: "1vw",
                                maxWidth: "7vw",
                                minWidth: "2vw",
                                borderRadius: "15px",
                                fontWeight: "500",
                                textTransform: "none",
                                boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                height: "6vh",
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
                          </>
                        )}
                      </Box> */}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "7px 20px",
                      backgroundColor: "#5d4993",
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
                        color: "#fff",
                      }}
                    >
                      <WorkIcon fontSize="small" sx={{ color: "#3ab795" }} />
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
                        color: "#fff",
                      }}
                    >
                      <CurrencyRupeeIcon
                        fontSize="small"
                        sx={{ color: "#3ab795" }}
                      />
                      {doctor.consultationFee || "Not Available"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      background: "transparent",
                      color: "transparent",
                    }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={
                        <Person
                          sx={{
                            fontSize: "20px",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      }
                      sx={{
                        borderRadius: "0",
                        textTransform: "none",
                        backgroundColor: "#29175e",
                        color: "white",
                        border: "none",
                        fontWeight: "600",
                        position: "relative",
                        overflow: "hidden",
                        zIndex: 1,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(45deg, #af9fdb, #d4c5f5)",
                          zIndex: -1,
                          transform: "translateY(100%)",
                          transition: "transform 0.6s ease-in-out",
                        },
                        "&:hover": {
                          color: "#29175e",
                          border: "none",
                          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                          transform: "translateY(-2px)",
                          "&::before": {
                            transform: "translateY(0)",
                          },
                          "& .MuiButton-startIcon": {
                            transform: "scale(1.2)",
                          },
                        },
                        "&:active": {
                          transform: "translateY(0) scale(0.98)",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                      onClick={() => {
                        router.push(
                          `/doctors/profile/${encodeURIComponent(doctor._id)}`
                        );
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          transition: "transform 0.5s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        View Full Profile
                      </Box>
                    </Button>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={
                        <EventIcon
                          sx={{
                            fontSize: "20px",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      }
                      sx={{
                        borderRadius: "0",
                        textTransform: "none",
                        background: "#29175e",
                        color: "#fff",
                        fontWeight: "600",
                        position: "relative",
                        overflow: "hidden",
                        zIndex: 1,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(45deg, #af9fdb, #d4c5f5)",
                          zIndex: -1,
                          transform: "translateY(100%)",
                          transition: "transform 0.6s ease-in-out",
                        },
                        "&:hover": {
                          color: "#29175e",
                          border: "none",
                          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                          transform: "translateY(-2px)",
                          backgroundColor: "#29175e",
                          "&::before": {
                            transform: "translateY(0)",
                          },
                          "& .MuiButton-startIcon": {
                            transform: "scale(1.2)",
                          },
                        },
                        "&:active": {
                          transform: "translateY(0) scale(0.98)",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                      onClick={() => openModal(doctor)}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          transition: "transform 0.5s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        Book Appointment
                      </Box>
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

          {/* Loading indicator for additional pages */}
          {isFetching && hasMore && (
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", py: 4 }}
            >
              <Loader />
            </Grid>
          )}

          {/* No more doctors message */}
          {!hasMore && combinedDoctors.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                You've reached the end of the list
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
