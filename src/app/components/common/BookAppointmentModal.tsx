import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Stack,
  Box,
  Modal,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Autocomplete,
  SelectChangeEvent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import InfoIcon from "@mui/icons-material/Info";
import {
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";
import { Cancel } from "@mui/icons-material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

import PaymentForm from "./PaymentForm";
import SnackbarComponent from "./Snackbar";
import type { AppDispatch, RootState } from "@/redux/store";
import { DoctorData } from "@/types/doctor";
import { useCreateAppointment } from "@/hooks/appointment";
import { useGetSymptom } from "@/hooks/symptoms";
import { Utility } from "@/utils";
import { useCreateSymptom } from "@/hooks/symptoms";
import { fetcher } from "@/apis/apiClient";

dayjs.extend(customParseFormat);

const ModalOneSchema = Yup.object().shape({
  appointmentDate: Yup.date()
    .required("Date of Appointment is required")
    .nullable(),
  appointmentTime: Yup.string().required("Appointment Time is required"),
  appointmentType: Yup.string().required("Appointment Type is required"),
  symptomIds: Yup.array()
});

interface AppointmentFormValues {
  symptomIds: any[];
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  description: string;
  videoUrl: File | null;
}

const initialValues: AppointmentFormValues = {
  symptomIds: [],
  appointmentDate: "",
  appointmentTime: "",
  appointmentType: "",
  description: "",
  videoUrl: null,
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DoctorData | undefined;
}
const today = dayjs().format("YYYY-MM-DD");

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const inputStyles = {
  fontFamily: "Poppins",
  backgroundColor: "white",
  "& .MuiInputBase-root": {
    fontFamily: "Poppins",
    backgroundColor: "white",
  },
  "& .MuiInputLabel-root": {
    color: "#29175E",
    fontFamily: "Poppins",
    "&.Mui-focused": {
      color: "#29175E",
    },
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "Poppins",
    "& fieldset": {
      borderColor: "#29175E",
    },
    "&:hover fieldset": {
      borderColor: "#29175E",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#29175E",
    },
  },
  input: {
    fontFamily: "Poppins",
  },
  InputAdornment: {
    color: "#7A4D9C",
  },
};

const priceWrapSx = {
  "& .price_header_txt": {
    fontSize: "1.1rem",
    fontWeight: 600,

    color: "#fff",
    lineHeight: "1.9rem",
    padding: "2px 10px",
    background: "#7A4D9C",
  },
  "& .tx1": {
    fontSize: "1.1rem",
    fontWeight: 500,
    color: "#29175E",
    marginTop: "10px",
  },
  "& .tx2": {
    fontSize: "1rem",
    fontWeight: "normal",
    color: "#29175E",
    marginTop: "5px",
    paddingBottom: "10px",
  },
  "& .tx3": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0px",
    borderTop: "1px solid #29175E",
    "& .spntx1": {
      fontSize: "0.9rem",
      fontWeight: "normal",
      color: "#29175E",
    },
    "& .spntx2": {
      fontSize: "0.9rem",
      fontWeight: "normal",
      color: "#29175E",
    },
  },
  "& .tx4": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0px",
    borderTop: "1px solid #bababa",
    "& .spntx1": {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#29175E",
    },
    "& .spntx2": {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#29175E",
    },
  },
  "& .prc_contnt": {
    padding: "10px",
    paddingBottom: "0px",
  },
};

const ModalOne: React.FC<ModalProps> = React.memo(({ isOpen, onClose, data }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<object>();
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const dispatch: AppDispatch = useDispatch();

  const {
    capitalizeFirstLetter,
    decodedToken,
    getIdsFromObject,

    // getTimeOfDaySlot,
    snackbarAndNavigate,
  } = Utility();

  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customSymptom, setCustomSymptom] = useState("");
  const [symptomOptionsDropdown, setSymtopOptionsDropdown] = useState([]);

  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  // TRACK SELECTED DAY & TIME SLOT IN LOCAL STATE[]
  const [selectedDayName, setSelectedDayName] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // BUCKETS THAT WILL HOLD MORNING / AFTERNOON / EVENING / NIGHT SLOTS
  const [timeBuckets, setTimeBuckets] = useState({
    morning: [] as string[],
    afternoon: [] as string[],
    evening: [] as string[],
    night: [] as string[],
  });

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const { createAppointment } = useCreateAppointment("create-appointment");
  const { createSymptom } = useCreateSymptom("create-symptom");

  useEffect(() => {
    const fetchBookedSlots = async () => {
      const doctorId = data?._id;
      if (!doctorId || !selectedDayName || !selectedDate) {
        setBookedSlots([]);
        return;
      }
      setLoading(true);

      try {
        const params = new URLSearchParams({
          page: "1",
          limit: "10",
          dateFilter: selectedDate,
        });
        const response = await fetcher(
          "appointment",
          `get-doctors-appointment/${doctorId}?${params.toString()}`
        );

        const bookedTimes = response.results
          .filter(
            (appt) =>
              dayjs(appt.appointmentDate).format("YYYY-MM-DD") === selectedDate
          )
          .map((appt) => appt.appointmentTime);

        setBookedSlots(bookedTimes);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSlots();
  }, [data?._id, selectedDayName, selectedDate]);

  const allowedDays = data?.availability
    ?.filter((slot) => slot.hospital.name === selectedHospital)
    .map((slot) => slot.day);

  const { value: symptoms, refetch } = useGetSymptom(
    null,
    "get-symptoms",
    1,
    200
  );

  useEffect(() => {
    const otherOption = { _id: "other", name: "Other" };
    console.log(symptoms?.results, 'symptom')
    // setSymtopOptionsDropdown([...(symptoms?.results || []), otherOption]);
  }, [symptoms?.results]);

  useEffect(() => {
    setSelectedHospital(null);
    setSelectedDayName(null);
    setTimeBuckets({ morning: [], afternoon: [], evening: [], night: [] });
    setBookedSlots([]);
  }, [data?._id]);

  // Handle hospital change
  const handleHospitalChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedHospital(event.target.value as string);
    setSelectedDayName(null);
    setTimeBuckets({ morning: [], afternoon: [], evening: [], night: [] });
    setBookedSlots([]);
  };

  // Whenever selectedDayName changes, generate new time slots from data.availability
  useEffect(() => {
    if (!selectedDayName || !selectedHospital || !data?.availability) {
      setTimeBuckets({ morning: [], afternoon: [], evening: [], night: [] });
      return;
    }
    // Find the entry in availability that matches the chosen weekday
    const hospitalAvailability = data.availability.filter(
      (slot) => slot.hospital.name === selectedHospital
    );
    const dayAvailability = hospitalAvailability.find(
      (slot) => slot.day?.toLowerCase() === selectedDayName?.toLowerCase()
    );
    if (!dayAvailability) {
      setTimeBuckets({ morning: [], afternoon: [], evening: [], night: [] });
      return;
    }
    // Generate discrete time slots from (startTime, endTime) in steps of 60 min
    const slots = generateTimeSlots(
      dayAvailability.startTime,
      dayAvailability.endTime,
      20
    );
    const buckets = {
      morning: [] as string[],
      afternoon: [] as string[],
      evening: [] as string[],
      night: [] as string[],
    };
    slots.forEach((slotTime) => {
      const part = getTimeOfDaySlot(slotTime);
      buckets[part].push(slotTime);
    });
    setTimeBuckets(buckets);
  }, [selectedDayName, selectedHospital, data?.availability]);

  // Time slot generation function
  const generateTimeSlots = (
    startTime: string,
    endTime: string,
    interval: number
  ) => {
    const parseTime = (timeStr: string) => {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours);
      minutes = parseInt(minutes);

      // Adjust for 12-hour format
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const formatTime = (date: Date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";

      // Convert from 24-hour format to 12-hour format
      if (hours > 12) hours -= 12;
      if (hours === 0) hours = 12;

      return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${period}`;
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const slots = [];

    while (start < end) {
      slots.push(formatTime(new Date(start)));

      start.setMinutes(start.getMinutes() + interval);
    }

    return slots;
  };

  const getTimeOfDaySlot = (time: string) => {
    const [timePart, period] = time.split(" ");
    const [hourStr] = timePart.split(":");
    let hour = parseInt(hourStr, 10);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
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

  const handleCreateCustomSymptom = async () => {
    if (!customSymptom.trim()) return;

    try {
      const response = await fetch(
        "http://localhost:4002/api/v1/symptom-service/create-symptom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: customSymptom.trim() }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newSymptom = data.data;
        // Reset custom symptom input and hide it
        setCustomSymptom("");
        setShowOtherInput(false);
        refetch();
      } else {
        // Handle error (you might want to show a snackbar or error message)
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error creating symptom", error);
    }
  };

  const handleTimeSlotClick = (time: string, setFieldValue: Function) => {
    if (!bookedSlots.includes(time)) {
      setSelectedTimeSlot(time);
      setFieldValue("appointmentTime", time);
    }
  };

  const renderTimeSlots = (
    slots: string[],
    timeOfDay: string,
    setFieldValue: Function
  ) => {
    if (slots.length === 0) return null;

    return (
      <Box component="fieldset" className="fieldset_wrap">
        <legend className="fldset_lgend">
          {capitalizeFirstLetter(timeOfDay)} Slots
        </legend>
        <ul className="time_box">
          {slots.map((time) => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = selectedTimeSlot === time;

            return (
              <li
                key={time}
                onClick={() =>
                  !isBooked && handleTimeSlotClick(time, setFieldValue)
                }
                style={{
                  background: isSelected ? "#29175E" : "transparent",
                  color: isSelected ? "white" : isBooked ? "#ccc" : "black",
                  cursor: isBooked ? "not-allowed" : "pointer",
                  textDecoration: isBooked ? "line-through" : "none",
                  position: "relative",
                  border: isBooked ? "1px solid #ccc" : "1px solid #29175E",
                  ...(isSelected && { border: "1px solid #29175E" }),
                }}
                title={
                  isBooked ? "This slot is already booked" : `Select ${time}`
                }
              >
                {time}
                {isBooked && (
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "10%",
                      width: "80%",
                      height: "1px",
                      backgroundColor: "#ccc",
                      transform: "translateY(-50%)",
                    }}
                  ></span>
                )}
              </li>
            );
          })}
        </ul>
      </Box>
    );
  };
  const handleBookAppointment = useCallback(
    async (values: AppointmentFormValues) => {
      const doctorId = data?._id;
      const patientId = decodedToken()?.id;

      if (!doctorId || !patientId) {
        snackbarAndNavigate(
          dispatch,
          true,
          "error",
          "Missing doctorId or patientId—cannot create appointment",
          null,
          true
        );
        return;
      }

      try {
        setLoading(true);

        const appointmentData = {
          ...values,
          patientId,
          doctorId,
          status: "pending",
          symptomIds: getIdsFromObject(values.symptomIds),
          hospitalName: selectedHospital,
        };

        const response = await createAppointment(appointmentData);
        console.log(response, appointmentData, 'response of api')
        if (response?.statusCode === 201) {
          const paymentData = {
            patientId,
            doctorId,
            appointmentId: response.data._id,
            status: "successful",
            amount: parseInt(data?.consultationFee) * 1,
            currency: "inr",
            transactionMethod: "card",
          };

          setShowPaymentForm(true);
          setPaymentInfo(paymentData);

          snackbarAndNavigate(
            dispatch,
            true,
            "success",
            "Appointment booked successfully!",
            null,
            false
          );
        } else {
          snackbarAndNavigate(
            dispatch,
            true,
            "error",
            "Failed to book appointment",
            null,
            false
          );
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          "Error creating appointment, please try again.";
        snackbarAndNavigate(dispatch, true, "error", errorMessage, null, true);
      } finally {
        setLoading(false);
      }
    },
    [data?._id, selectedHospital]
  );

  if (!isOpen) return null;

  return (
    <>
      <Modal
        open={isOpen}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") onClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Outer Box that wraps the entire Modal content */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "1200px",
            background: "rgb(188,174,224)",
            background:
              "linear-gradient(180deg, rgba(188,174,224,1) 0%, rgba(255,255,255,1) 100%)",
            boxShadow: 24,
            borderRadius: "8px",
            overflowY: "hidden",
          }}
        >
          {/* ===== ModalHeader ===== */}
          <Box
            sx={{
              display: !showPaymentForm ? "block" : "none",
              opacity: !showPaymentForm ? 1 : 0,
              transition: "opacity 2s ease-in-out",
              padding: "10px",
              // tom: "1px solid #ababab",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                marginBottom: "2px",
                padding: "1px",
                borderRadius: "8px",
                gap: "8px",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.15rem",
                    md: "1.35rem",
                  },
                  fontWeight: 600,
                  color: "#29175e",
                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                  whiteSpace: {
                    xs: "normal",
                    sm: "nowrap",
                  },
                  fontFamily: "Poppins",
                }}
              >
                Book Appointment With{" "}
                {capitalizeFirstLetter(data?.username) || "Doctor"}
              </Typography>

              {/* Right: Available Days */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#7A4D9C",
                  border: "1px solid #ccc",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  width: "100%",
                  maxWidth: {
                    xs: "100%",
                    sm: "26vw",
                  },
                  justifyContent: {
                    xs: "center",
                    sm: "flex-end",
                  },
                }}
              >
                <EventAvailableIcon
                  sx={{ color: "#b497d6", marginRight: "8px" }}
                />
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 400,
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedHospital
                    ? (() => {
                      const daysForSelectedHospital = data?.availability
                        ?.filter(
                          (slot) => slot.hospital.name === selectedHospital
                        )
                        .map((slot) => slot.day);
                      return daysForSelectedHospital &&
                        daysForSelectedHospital.length > 0
                        ? `Available on: ${daysForSelectedHospital.join(
                          ", "
                        )}`
                        : "No Days Available";
                    })()
                    : "Select a hospital to view available days"}
                </Typography>
              </Box>
            </Box>

            {/* Line after the Box */}
            <Box
              sx={{
                margin: "10px 0",
                borderBottom: "1px solid #ccc",
                width: "100%",
              }}
            />

            {/* <Box sx={{ display: "flex", justifyContent: "flex-end"}}>
              <CloseIcon
                sx={{ cursor: "pointer", color: "#333", fontSize: 24 }}
                onClick={onClose}
              />
            </Box> */}

            <Formik
              initialValues={initialValues}
              validationSchema={ModalOneSchema}
              onSubmit={(values) => handleBookAppointment(values)}
            >
              {({
                dirty,
                errors,
                touched,
                values,
                isSubmitting,
                setFieldValue,
              }) => (
                <Form>
                  {/* ===== ModalBody ===== */}
                  <Box
                    sx={{
                      display: !showPaymentForm ? "block" : "none",
                      overflowX: "auto",
                      maxHeight: "72vh",
                      padding: "20px",
                      marginTop: "15px",
                      "& .locat": {
                        fontSize: "1rem",
                        fontWeight: 300,
                        color: "#000",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                      },
                      "& .time_box": {
                        display: "grid",
                        gridTemplateColumns: "repeat(6, 0fr)",
                        gap: "8px",

                        width: "100%",
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        justifyItems: "center",
                        "& li": {
                          fontSize: "0.8rem",
                          fontWeight: 300,
                          lineHeight: "1.2rem",
                          padding: "8px 7px",
                          border: "1px solid #29175E",
                          borderRadius: "2px",
                          cursor: "pointer",
                          color: "black",
                          textAlign: "center",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "#7A4D9C",
                            color: "white",
                            transform: "scale(1.05)",
                          },
                        },
                      },

                      "& .tx2date": {
                        fontSize: "1rem",
                        fontWeight: 300,
                        color: "#000",
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "center",
                        "& svg": {
                          marginRight: "7px",
                        },
                      },
                      "& input.Mui-disabled": {
                        opacity: 1,
                        WebkitTextFillColor: "rgb(0 0 0 / 100%)",
                      },
                      "& .MuiFormLabel-filled.Mui-disabled": {
                        color: "rgba(0, 0, 0, 0.6)",
                      },
                      "& .fldset_lgend": {
                        marginLeft: "15px",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        color: "#29175E",
                        padding: "0px 5px",
                      },
                      "& .fieldset_wrap": {
                        padding: "20px",
                        paddingBottom: "20px",
                        paddingTop: "10px",
                        borderColor: "#efefef",
                        marginBottom: "10px",
                        border: "1px solid #b1b1b1",
                      },
                      "& .MuiPickersTextField": {
                        width: "100%",
                      },
                      "& .pric_tw": {
                        border: "1px solid #b1b1b1",
                      },
                    }}
                  >
                    <Grid container spacing={4}>
                      {/* ===== Left Section  ===== */}
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        sx={{
                          p: 1,
                          borderRadius: "8px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Box sx={{ marginBottom: 3 }}>
                          <FormControl fullWidth sx={inputStyles}>
                            <InputLabel
                              sx={{
                                color: "#29175E",
                                "&.Mui-focused": {
                                  color: "#29175E",
                                },
                              }}
                            >
                              Choose Hospital Name *
                            </InputLabel>
                            <Select
                              value={selectedHospital || ""}
                              onChange={handleHospitalChange}
                              label="Select Hospital *"
                              sx={inputStyles}
                            >
                              {data?.availability?.map((slot) => (
                                <MenuItem
                                  key={slot.hospital.name}
                                  value={slot.hospital.name}
                                >
                                  {slot.hospital.name}, {slot.hospital.location}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Box
                          sx={{
                            marginBottom: 2,

                            "& .MuiFormLabel-root": {
                              color: "#29175E",
                              fontFamily: "Poppins",
                            },
                            "& .MuiInputBase-root": {
                              backgroundColor: "#fff",
                              borderRadius: "4px",
                              fontFamily: "Poppins",
                              width: "130%",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#29175E",
                              },
                              "&:hover fieldset": {
                                borderColor: "#29175E",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#29175E",
                              },
                            },
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Choose Appointment Date *"
                              disablePast
                              inputFormat="YYYY-MM-DD"
                              value={
                                values.appointmentDate
                                  ? dayjs(values.appointmentDate)
                                  : null
                              }
                              shouldDisableDate={(date) => {
                                const selectedDays = data?.availability
                                  ?.filter(
                                    (slot) =>
                                      slot.hospital.name === selectedHospital
                                  )
                                  .map((slot) => slot.day);
                                const dayName = dayjs(date).format("dddd");
                                return !selectedDays?.includes(dayName);
                              }}
                              onChange={(newValue) => {
                                if (newValue) {
                                  const formattedDate =
                                    dayjs(newValue).format("YYYY-MM-DD");
                                  const dayName =
                                    dayjs(newValue).format("dddd");
                                  setFieldValue(
                                    "appointmentDate",
                                    formattedDate
                                  );
                                  setSelectedDate(formattedDate);
                                  setSelectedDayName(dayName);
                                  setSelectedTimeSlot("");
                                  setFieldValue("appointmentTime", "");
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  name="appointmentDate"
                                  sx={{
                                    "& input": {
                                      padding: "12px",
                                      fontFamily: "Poppins",
                                    },
                                  }}
                                  inputProps={{ min: today }}
                                  error={
                                    touched.appointmentDate &&
                                    Boolean(errors.appointmentDate)
                                  }
                                  helperText={
                                    touched.appointmentDate &&
                                    errors.appointmentDate
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                    sx: {
                                      fontFamily: "Poppins",
                                      color: "#29175E",
                                      "&.Mui-focused": {
                                        color: "#29175E",
                                      },
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Box>
                        {/* === Appointment Type === */}
                        <TextField
                          fullWidth
                          select
                          label="Appointment Type *"
                          name="appointmentType"
                          value={values.appointmentType}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFieldValue("appointmentType", e.target.value)
                          }
                          sx={{
                            marginBottom: "20px",
                            "& input": {
                              background: "#fff",
                              borderRadius: "6px",
                              padding: "12px 12px",
                              fontFamily: "Poppins",
                            },
                            "& .MuiInputBase-root": {
                              fontSize: "0.9rem",
                              fontFamily: "Poppins",
                              color: "black !important", // Change color to black for input text
                            },
                            "& .MuiFormLabel-root": {
                              color: "black !important", // Change color to black for label text
                            },
                          }}
                          error={
                            touched.appointmentType &&
                            Boolean(errors.appointmentType)
                          }
                          helperText={
                            touched.appointmentType && errors.appointmentType
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <InfoIcon sx={{ color: "#7A4D9C" }} />
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{
                            shrink: true,
                            sx: {
                              ...inputStyles["& .MuiInputLabel-root"],
                            },
                          }}
                          sx={{
                            ...inputStyles,
                            marginBottom: "15px",
                          }}
                        >
                          <MenuItem value="online">Online</MenuItem>
                          <MenuItem value="in-person">In-Person</MenuItem>
                        </TextField>
                        {/* === Symptoms Selection === */}
                        <Autocomplete
                          multiple
                          disableCloseOnSelect={!showOtherInput} // Only disable close when not showing other input
                          options={[...symptomOptionsDropdown]}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          value={values.symptomIds || []}
                          onChange={(event, selected, reason) => {
                            // Check if "Other" was just selected
                            const justSelectedOther =
                              selected.some((item) => item._id === "other") &&
                              !values.symptomIds.some(
                                (item) => item._id === "other"
                              );

                            // If "Other" was just selected, show the custom input and close the dropdown
                            if (justSelectedOther) {
                              setShowOtherInput(true);
                              // Close the dropdown by blurring the input
                              const input =
                                document.activeElement as HTMLElement;
                              if (input) input.blur();
                            }

                            // Remove "Other" from the actual selected symptoms
                            const filteredSelected = selected.filter(
                              (item) => item._id !== "other"
                            );

                            // Update Formik field value
                            setFieldValue("symptomIds", filteredSelected);
                          }}
                          onClose={() => {
                            // This ensures the dropdown stays closed when showing other input
                            if (showOtherInput) {
                              const input = document.getElementById(
                                "symptoms-autocomplete"
                              );
                              if (input) input.blur();
                            }
                          }}
                          sx={{
                            ...inputStyles,
                            background: "#fff",
                            padding: "4px 2px",
                            marginBottom: "15px"
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              id="symptoms-autocomplete"
                              label="Symptom"
                              name="symptomIds"
                              type="text"
                              error={
                                !!touched.symptomIds && !!errors.symptomIds
                              }
                              helperText={
                                touched.symptomIds &&
                                  typeof errors.symptomIds === "string"
                                  ? errors.symptomIds
                                  : ""
                              }
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    <InputAdornment position="start">
                                      <AssignmentIcon
                                        sx={{ color: "#7A4D9C" }}
                                      />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                          renderOption={(props, option, { selected }) => {
                            // Special styling for the "Other" option
                            const isOther = option._id === "other";
                            return (
                              <li
                                {...props}
                                style={{
                                  ...props.style,
                                  fontWeight: isOther ? "bold" : "normal",
                                  color: isOther ? "#7A4D9C" : "inherit",
                                  backgroundColor:
                                    isOther && selected ? "#f0e6ff" : "inherit",
                                }}
                              >
                                {option.name}
                              </li>
                            );
                          }}
                        />
                        {showOtherInput && (
                          <Box mt={2}>
                            <TextField
                              label="Enter Custom Symptom"
                              value={customSymptom}
                              onChange={(e) => setCustomSymptom(e.target.value)}
                              fullWidth
                              variant="outlined"
                              sx={{
                                backgroundColor: "white",
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderColor: "black",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "black",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "black",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "black",
                                },
                              }}
                            />

                            <Button
                              onClick={handleCreateCustomSymptom}
                              variant="contained"
                              // fullWidth
                              disabled={!customSymptom.trim()}
                              sx={{
                                mt: 1,
                                backgroundColor: "#2E1065", // Deep purple like your screenshot
                                color: "#fff",
                                borderRadius: "8px",
                                fontWeight: "bold",
                                textTransform: "none",
                                "&:hover": {
                                  backgroundColor: "#23094f",
                                },
                              }}
                            >
                              Add Symptom
                            </Button>
                          </Box>
                        )}
                        {/* === Short Description === */}
                        <Field
                          as={TextField}
                          fullWidth
                          label="Short Description"
                          name="description"
                          autoComplete="off"
                          autoFocus
                          sx={{
                            ...inputStyles,
                            background: "#fff",
                            marginBottom: "2px",
                            "&:hover": {
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                            },
                            "& .MuiFormLabel-root": {
                              fontSize: "1rem",
                              color: "#000 !important",
                              // fontWeight: "bold",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "1rem",
                              color: "#29175e",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AssignmentIcon sx={{ color: "#7A4D9C" }} />
                              </InputAdornment>
                            ),
                          }}
                          error={
                            touched.description && Boolean(errors.description)
                          }
                          helperText={touched.description && errors.description}
                        />{" "}
                      </Grid>
                      {/* ===== Middle Section (Dynamic Time Slots) ===== */}
                      <Field type="hidden" name="appointmentTime" />{" "}
                      {/* Hidden Formik Field so Formik tracks appointmenttime errors*/}
                      <Grid item xs={12} sm={4} md={4}>
                        <Box sx={priceWrapSx}>
                          {/* Morning Slots */}
                          {(!values.appointmentDate ||
                            timeBuckets.morning.length > 0) && (
                              <Box
                                component="fieldset"
                                className="fieldset_wrap"
                                sx={{ marginTop: "-7px" }}
                              >
                                <legend className="fldset_lgend">
                                  Morning Slots
                                </legend>
                                <ul className="time_box">
                                  {timeBuckets.morning.map((time) => {
                                    const isBooked = bookedSlots.includes(time);
                                    return (
                                      <li
                                        key={time}
                                        onClick={() => {
                                          if (!isBooked) {
                                            handleTimeSlotClick(
                                              time,
                                              setFieldValue
                                            );
                                          }
                                        }}
                                        style={{
                                          background:
                                            selectedTimeSlot === time
                                              ? "#29175E"
                                              : isBooked
                                                ? "#ccc"
                                                : "",
                                          color:
                                            selectedTimeSlot === time
                                              ? "white"
                                              : isBooked
                                                ? "#666"
                                                : "black",
                                          cursor: isBooked
                                            ? "not-allowed"
                                            : "pointer",
                                          pointerEvents: isBooked
                                            ? "none"
                                            : "auto",
                                        }}
                                      >
                                        {time}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </Box>
                            )}

                          {/* Afternoon Slots */}
                          {(!values.appointmentDate ||
                            timeBuckets.afternoon.length > 0) && (
                              <Box component="fieldset" className="fieldset_wrap">
                                <legend className="fldset_lgend">
                                  Afternoon Slots
                                </legend>
                                <ul className="time_box">
                                  {timeBuckets.afternoon.map((time) => {
                                    const isBooked = bookedSlots.includes(time);
                                    return (
                                      <li
                                        key={time}
                                        onClick={() => {
                                          if (!isBooked) {
                                            handleTimeSlotClick(
                                              time,
                                              setFieldValue
                                            );
                                          }
                                        }}
                                        style={{
                                          background:
                                            selectedTimeSlot === time
                                              ? "#29175E"
                                              : isBooked
                                                ? "#ccc"
                                                : "",
                                          color:
                                            selectedTimeSlot === time
                                              ? "white"
                                              : isBooked
                                                ? "#666"
                                                : "black",
                                          cursor: isBooked
                                            ? "not-allowed"
                                            : "pointer",
                                          pointerEvents: isBooked
                                            ? "none"
                                            : "auto",
                                        }}
                                      >
                                        {time}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </Box>
                            )}

                          {/* Evening Slots */}
                          {(!values.appointmentDate ||
                            timeBuckets.evening.length > 0) && (
                              <Box component="fieldset" className="fieldset_wrap">
                                <legend className="fldset_lgend">
                                  Evening Slots
                                </legend>
                                <ul className="time_box">
                                  {timeBuckets.evening.map((time) => {
                                    const isBooked = bookedSlots.includes(time);
                                    return (
                                      <li
                                        key={time}
                                        onClick={() => {
                                          if (!isBooked) {
                                            handleTimeSlotClick(
                                              time,
                                              setFieldValue
                                            );
                                          }
                                        }}
                                        style={{
                                          background:
                                            selectedTimeSlot === time
                                              ? "#29175E"
                                              : isBooked
                                                ? "#ccc"
                                                : "",
                                          color:
                                            selectedTimeSlot === time
                                              ? "white"
                                              : isBooked
                                                ? "#666"
                                                : "black",
                                          cursor: isBooked
                                            ? "not-allowed"
                                            : "pointer",
                                          pointerEvents: isBooked
                                            ? "none"
                                            : "auto",
                                        }}
                                      >
                                        {time}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </Box>
                            )}

                          {/* Night Slots */}
                          {(!values.appointmentDate ||
                            timeBuckets.night.length > 0) && (
                              <Box component="fieldset" className="fieldset_wrap">
                                <legend className="fldset_lgend">
                                  Night Slots
                                </legend>
                                <ul className="time_box">
                                  {timeBuckets.night.map((time) => {
                                    const isBooked = bookedSlots.includes(time);
                                    return (
                                      <li
                                        key={time}
                                        onClick={() => {
                                          if (!isBooked) {
                                            handleTimeSlotClick(
                                              time,
                                              setFieldValue
                                            );
                                          }
                                        }}
                                        style={{
                                          background:
                                            selectedTimeSlot === time
                                              ? "#29175E"
                                              : isBooked
                                                ? "#ccc"
                                                : "",
                                          color:
                                            selectedTimeSlot === time
                                              ? "white"
                                              : isBooked
                                                ? "#666"
                                                : "black",
                                          cursor: isBooked
                                            ? "not-allowed"
                                            : "pointer",
                                          pointerEvents: isBooked
                                            ? "none"
                                            : "auto",
                                        }}
                                      >
                                        {time}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </Box>
                            )}
                        </Box>

                        {/* Error Message for appointmentTime */}
                        {touched.appointmentTime && errors.appointmentTime && (
                          <Typography
                            color="error"
                            variant="body2"
                            paddingLeft="38px"
                          >
                            {errors.appointmentTime}
                          </Typography>
                        )}
                      </Grid>
                      {/* ===== Right Section (Price/Consultation/Payment Details) ===== */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Field name="video">
                          {({ field }) => (
                            <Box
                              sx={{
                                mt: 0,
                                p: 1,
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                backgroundColor: "#f8f8ff",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                  borderColor: "#29175E",
                                },
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: "1rem",
                                  fontWeight: 600,
                                  color: "#29175E",
                                  mb: 1,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <BookOnlineIcon sx={{ mr: 1 }} />
                                Upload a Video
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  marginBottom: "10px",
                                  mb: 0.6,
                                  color: "#555",
                                  backgroundColor: "29175E",
                                  p: 0.8,
                                  borderRadius: "4px",
                                  borderLeft: "4px solid #29175E",
                                  fontWeight: 400,
                                }}
                              >
                                <strong>
                                  Explain your symptoms in video (optional):
                                </strong>{" "}
                                "Record a short video explaining your symptoms,
                                This will help your doctor prepare for your
                                appointment."
                              </Typography>

                              <TextField
                                type="file"
                                inputProps={{ accept: "video/*" }}
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (file && file.size > 50 * 1024 * 1024) {
                                    // 50MB in bytes
                                    alert(
                                      "File size exceeds 50MB. Please upload a smaller file."
                                    );
                                  } else {
                                    setFieldValue("videoUrl", file);
                                  }
                                }}
                                fullWidth
                                variant="outlined"
                                placeholder="No file chosen"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CalendarMonthIcon
                                        sx={{ color: "#29175E" }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#fff",
                                    borderRadius: "6px",
                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#29175E",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#29175E",
                                    },
                                  },
                                  "& input": {
                                    padding: "12px 10px 12px 0",
                                  },
                                }}
                                error={
                                  touched.videoUrl && Boolean(errors.videoUrl)
                                }
                                helperText={touched.videoUrl && errors.videoUrl}
                              />

                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  mt: 0.4,
                                  color: "#666",
                                }}
                              >
                                Supported formats: MP4, MOV, AVI (max size 50MB)
                              </Typography>
                            </Box>
                          )}
                        </Field>
                        <br />
                        <Box
                          sx={{ ...priceWrapSx, border: "1px solid #7A4D9C" }}
                        >
                          <Typography
                            sx={{
                              color: "#29175e !important",
                              backgroundColor: "transparent !important",
                            }}
                            className="price_header_txt"
                          >
                            Consultation Details
                          </Typography>
                          <Box className="prc_contnt">
                            <Typography
                              sx={{
                                color: "#29175e !important",
                              }}
                              className="tx1"
                            >
                              {capitalizeFirstLetter(data?.username) ||
                                "Doctor"}
                            </Typography>
                            <Typography className="tx3">
                              <span className="spntx1">Price</span>
                              <span className="spntx2">
                                {`₹${data?.consultationFee}`}
                              </span>
                            </Typography>
                            <Typography
                              sx={{
                                color: "#29175e !important",
                              }}
                              className="tx4"
                            >
                              <span
                                style={{ color: "#29175e" }}
                                className="spntx1"
                              >
                                Total
                              </span>
                              <span className="spntx2">
                                {values.appointmentDate &&
                                  values.appointmentTime &&
                                  values.appointmentType
                                  ? `₹${data?.consultationFee}`
                                  : "--"}
                              </span>
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>{" "}
                    </Grid>
                  </Box>

                  {/* ===== ModalFooter ===== */}
                  <Box
                    sx={{
                      padding: "10px 10px",
                      borderTop: "1px solid #ababab",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      "& .footer_btn_wrp": {
                        display: "flex",
                        justifyContent: "center",
                      },
                    }}
                  >
                    <Box className="footer_btn_wrp">
                      <Button
                        disabled={!dirty || isSubmitting}
                        variant="contained"
                        type="submit"
                        sx={{
                          minWidth: "150px",
                          color: "#fff",
                          background: "#29175E",
                          borderRadius: "4px",
                          marginLeft: "20px",
                          textTransform: "none",
                          transition:
                            "transform 0.2s, box-shadow 0.2s, background-color 0.3s, color 0.3s",
                          ":hover": {
                            bgcolor: "#7A4D9C",
                            color: "white",
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <BookOnlineIcon sx={{ marginRight: 1 }} />
                        Book Now
                      </Button>
                      <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                          minWidth: "150px",
                          color: "#fff",
                          background: "#29175E",
                          borderRadius: "4px",
                          marginLeft: "20px",
                          textTransform: "none",
                          transition:
                            "transform 0.2s, box-shadow 0.2s, background-color 0.3s, color 0.3s",
                          ":hover": {
                            bgcolor: "#7A4D9C",
                            color: "white",
                          },
                        }}
                        startIcon={<Cancel sx={{ fontSize: 22 }} />}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>

          {/* Payment Form (Visible after Booking) */}
          <Box
            sx={{
              display: showPaymentForm ? "flex" : "none",
              opacity: showPaymentForm ? 1 : 0,
              transition: "opacity 2s ease-in-out",
              padding: "20px",
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto",
              height: "auto",
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Left Column - Payment Form */}
            <Box
              sx={{
                flex: "1",
                paddingRight: "20px",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  marginBottom: "1rem",
                  color: "#20ADA0",
                  textAlign: "center",
                }}
              >
                Complete Payment
              </Typography>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  setShowPaymentForm={setShowPaymentForm}
                  paymentInfo={paymentInfo}
                />
              </Elements>
            </Box>

            {/* Right Column - Design/Content */}
            <Box
              sx={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8f8ff",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  marginBottom: "1rem",
                  color: "#20ADA0",
                  textAlign: "center",
                }}
              >
                Payment Information
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "1rem",
                  textAlign: "center",
                  color: "#555",
                }}
              >
                100% Secure payment.
              </Typography>
              <img
                src="/iconimg.jpg"
                alt="Secure Payment"
                style={{
                  width: "80%",
                  maxWidth: "200px",
                  marginBottom: "1rem",
                }}
              />
              <Typography
                variant="body2"
                sx={{ textAlign: "center", color: "#888" }}
              >
                Your payment details are encrypted and secure.
              </Typography>
            </Box>
          </Box>
          <SnackbarComponent
            alerting={snackbar.snackbarAlert}
            severity={snackbar.snackbarSeverity}
            message={snackbar.snackbarMessage}
            onClose={handleSnackbarClose}
          />
        </Box>
      </Modal>
    </>
  );
});

export default ModalOne;
