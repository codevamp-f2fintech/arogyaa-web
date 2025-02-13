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

dayjs.extend(customParseFormat);

const ModalOneSchema = Yup.object().shape({
  appointmentDate: Yup.date()
    .required("Date of Appointment is required")
    .nullable(),
  appointmentTime: Yup.string().required("Appointment Time is required"),
  appointmentType: Yup.string().required("Appointment Type is required"),
  symptomIds: Yup.array()
    .min(1, "At least one symptom is required")
    .required("Symptom is required"),
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

const ModalOne: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<object>();
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const dispatch: AppDispatch = useDispatch();

  const {
    capitalizeFirstLetter,
    decodedToken,
    getIdsFromObject,
    generateTimeSlots,
    getTimeOfDaySlot,
    snackbarAndNavigate,
  } = Utility();
  // TRACK SELECTED DAY & TIME SLOT IN LOCAL STATE
  const [selectedDayName, setSelectedDayName] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  // BUCKETS THAT WILL HOLD MORNING / AFTERNOON / EVENING / NIGHT SLOTS
  const [timeBuckets, setTimeBuckets] = useState<{
    morning: string[];
    afternoon: string[];
    evening: string[];
    night: string[];
  }>({ morning: [], afternoon: [], evening: [], night: [] });

  const { createAppointment } = useCreateAppointment("create-appointment");

  const { value: symptoms } = useGetSymptom(null, "get-symptoms", 1, 200);

  // Whenever selectedDayName changes, generate new time slots from data.availability
  useEffect(() => {
    if (!selectedDayName || !data?.availability) {
      setTimeBuckets({ morning: [], afternoon: [], evening: [], night: [] });
      return;
    }

    // Find the entry in availability that matches the chosen weekday
    const dayAvailability = data.availability.find(
      (slot) => slot.day?.toLowerCase() === selectedDayName.toLowerCase()
    );
    if (!dayAvailability) {
      setTimeBuckets({ morning: [], afternoon: [], evening: [], night: [] });
      return;
    }

    // Generate discrete time slots from (startTime, endTime) in steps of 60 min
    const slots = generateTimeSlots(
      dayAvailability.startTime,
      dayAvailability.endTime,
      60
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
  }, [selectedDayName, data?.availability]);

  // Define the snackbar close handler
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const handleTimeSlotClick = (time: string, setFieldValue: Function) => {
    setSelectedTimeSlot(time);
    setFieldValue("appointmentTime", time);
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
          symptomIds: JSON.stringify(getIdsFromObject(values.symptomIds)),
        };
        const response = await createAppointment(appointmentData);

        console.log("Response received:", response);

        if (response?.statusCode === 201) {
          const paymentData = {
            patientId,
            doctorId,
            appointmentId: response.data._id,
            status: "successful",
            amount: parseInt(data?.consultationFee) * 100,
            currency: "inr",
            transactionMethod: "card",
          };

          setShowPaymentForm(true);
          setPaymentInfo(paymentData);
        } else {
          snackbarAndNavigate(
            dispatch,
            true,
            "error",
            "Failed to create appointment",
            null,
            true
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
    [data?._id, createAppointment] 
  );

  const priceWrapSx = {
    "& .price_header_txt": {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#000",
      lineHeight: "1.2rem",
      padding: "15px 10px",
      background: "#efefef",
    },
    "& .tx1": {
      fontSize: "1.1rem",
      fontWeight: 500,
      color: "#000",
      marginTop: "10px",
    },
    "& .tx2": {
      fontSize: "1rem",
      fontWeight: "normal",
      color: "#1f1f1f",
      marginTop: "5px",
      paddingBottom: "10px",
    },
    "& .tx3": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0px",
      borderTop: "1px solid #bababa",
      "& .spntx1": {
        fontSize: "0.9rem",
        fontWeight: "normal",
        color: "#000",
      },
      "& .spntx2": {
        fontSize: "0.9rem",
        fontWeight: "normal",
        color: "#000",
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
        color: "#20ada0",
      },
      "& .spntx2": {
        fontSize: "1rem",
        fontWeight: 500,
        color: "#20ada0",
      },
    },
    "& .prc_contnt": {
      padding: "10px",
      paddingBottom: "0px",
    },
  };

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
            width: "80%",
            maxWidth: "1200px",
            bgcolor: "background.paper",
            border: "2px solid #fff",
            boxShadow: 24,
            borderRadius: "8px",
            overflow: "hidden",
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2px",
                padding: "1px",
                borderRadius: "8px",
              }}
            >
              {/* Left: Book with Doctor */}
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "#20ada0",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                Book With {capitalizeFirstLetter(data?.username) || "Doctor"}
              </Typography>

              {/* Right: Available Days */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f8f8ff",
                  border: "1px solid #ccc",
                  padding: "5px 10px",
                  borderRadius: "8px",
                }}
              >
                <EventAvailableIcon
                  sx={{ color: "#20ADA0", marginRight: "8px" }}
                />
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 400,
                    color: "#20ADA0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {data?.availability?.length > 0
                    ? `Available on: ${data.availability
                        .map((slot) => slot.day)
                        .join(", ")}`
                    : "No Days Available"}
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
                        display: "flex",
                        flexWrap: "wrap",
                        width: "100%",
                        "& li": {
                          marginTop: "10px",
                          fontSize: "0.8rem",
                          fontWeight: 300,
                          lineHeight: "1.2rem",
                          padding: "8px 10px",
                          border: "1px solid #20ada0",
                          borderRadius: "4px",
                          listStyle: "none",
                          marginRight: "10px",
                          cursor: "pointer",
                          color: "black",
                          "&:hover": {
                            background: "#20ada0",
                            color: "white",
                          },
                        },
                      },
                      "& .tx2date": {
                        fontSize: "1rem",
                        fontWeight: 300,
                        color: "#000",
                        marginBottom: "16px",
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
                        background: "white",
                        marginLeft: "15px",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        color: "#20ada0",
                        padding: "0px 5px",
                      },
                      "& .fieldset_wrap": {
                        padding: "20px",
                        paddingBottom: "20px",
                        paddingTop: "10px",
                        borderColor: "#efefef",
                        marginBottom: "10px",
                        border: "1px solid #efefef",
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
                        {/* === Date of Appointment === */}
                        <Field
                          fullWidth
                          as={TextField}
                          label="Date Of Appointment *"
                          name="appointmentDate"
                          type="date"
                          value={
                            values.appointmentDate
                              ? dayjs(values.appointmentDate).format(
                                  "YYYY-MM-DD"
                                )
                              : ""
                          }
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const formattedDate = dayjs(e.target.value).format(
                              "YYYY-MM-DD"
                            );
                            setFieldValue("appointmentDate", formattedDate);
                            const dayName = dayjs(e.target.value).format(
                              "dddd"
                            );
                            setSelectedDayName(dayName);
                            setSelectedTimeSlot("");
                            setFieldValue("appointmentTime", "");
                          }}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            marginBottom: "7px",
                            "& input[type=date]": {
                              background: "#fff",
                              borderRadius: "6px",
                              padding: "12px 12px",
                            },
                            "& input[type=date]::-webkit-calendar-picker-indicator":
                              {
                                zIndex: 3,
                                cursor: "pointer",
                              },
                            "& .MuiInputBase-root": {
                              fontSize: "0.9rem",
                            },
                          }}
                          inputProps={{ min: today }}
                          error={
                            touched.appointmentDate &&
                            Boolean(errors.appointmentDate)
                          }
                          helperText={
                            touched.appointmentDate && errors.appointmentDate
                          }
                        />

                        {/*Display Message*/}
                        {!values.appointmentDate ? (
                          <Typography
                            sx={{
                              textAlign: "center",
                              backgroundColor: "#f8f8ff",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              padding: "3px",
                              color: "#20ADA0",
                              marginBottom: "10px",
                              fontSize: "1rem",
                              fontWeight: 400,
                            }}
                          >
                            Choose an appointment date.
                          </Typography>
                        ) : !timeBuckets ||
                          Object.values(timeBuckets).every(
                            (bucket) => bucket.length === 0
                          ) ? (
                          <Typography
                            sx={{
                              textAlign: "center",
                              backgroundColor: "#f8f8ff",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              padding: "2px",
                              color: "#20ADA0",
                              marginBottom: "10px",
                              fontSize: "1rem",
                              fontWeight: 500,
                            }}
                          >
                            No slots available.
                          </Typography>
                        ) : null}

                        {/* === Appointment Type === */}
                        <TextField
                          fullWidth
                          select
                          label="Appointment Type*"
                          name="appointmentType"
                          value={values.appointmentType}
                          onChange={(e) =>
                            setFieldValue("appointmentType", e.target.value)
                          }
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
                                <InfoIcon sx={{ color: "#20ADA0" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            background: "#fff",
                            borderRadius: "6px",
                            marginBottom: "2px",
                          }}
                        >
                          <MenuItem value="online">Online</MenuItem>
                          <MenuItem value="in-person">In-Person</MenuItem>
                        </TextField>

                        {/* === Symptoms Selection === */}
                        <Autocomplete
                          multiple
                          disableCloseOnSelect
                          options={symptoms?.results || []}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          value={values.symptomIds || undefined}
                          onChange={(event, value) =>
                            setFieldValue("symptomIds", value)
                          }
                          sx={{
                            background: "#fff",
                            borderRadius: "6px",
                            padding: "4px 2px",
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Symptom *"
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
                                        sx={{ color: "#20ADA0" }}
                                      />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />

                        {/* === Short Description === */}
                        <Field
                          as={TextField}
                          fullWidth
                          label="Short Description"
                          name="description"
                          autoComplete="off"
                          autoFocus
                          sx={{
                            background: "#fff",
                            borderRadius: "6px",
                            "&:hover": {
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AssignmentIcon sx={{ color: "#20ADA0" }} />
                              </InputAdornment>
                            ),
                          }}
                          error={
                            touched.description && Boolean(errors.description)
                          }
                          helperText={touched.description && errors.description}
                        />
                        <Field name="video">
                          {({ field }) => (
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "1rem",
                                  fontWeight: 500,
                                  color: "#20ADA0",
                                  marginBottom: "8px",
                                }}
                              >
                                Upload a Video
                              </Typography>
                              <TextField
                                type="file"
                                inputProps={{ accept: "video/*" }}
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  setFieldValue("videoUrl", file);
                                }}
                                fullWidth
                                sx={{
                                  "& input": {
                                    background: "#fff",
                                    borderRadius: "6px",
                                    padding: "10px",
                                  },
                                }}
                                error={
                                  touched.videoUrl && Boolean(errors.videoUrl)
                                }
                                helperText={touched.videoUrl && errors.videoUrl}
                              />
                            </Box>
                          )}
                        </Field>
                      </Grid>
                      {/* ===== Middle Section (Dynamic Time Slots) ===== */}
                      <Field type="hidden" name="appointmentTime" />{" "}
                      {/* Hidden Formik Field so Formik tracks appointmenttime errors*/}
                      <Grid item xs={12} sm={5} md={5}>
                        <Box sx={priceWrapSx}>
                          <Box
                            component="fieldset"
                            className="fieldset_wrap"
                            sx={{ marginTop: "-7px" }}
                          >
                            <legend className="fldset_lgend">
                              Morning Slots
                            </legend>
                            <ul className="time_box">
                              {timeBuckets.morning.map((time) => (
                                <li
                                  key={time}
                                  onClick={() =>
                                    handleTimeSlotClick(time, setFieldValue)
                                  }
                                  style={{
                                    background:
                                      selectedTimeSlot === time
                                        ? "#20ada0"
                                        : "",
                                    color:
                                      selectedTimeSlot === time
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  {time}
                                </li>
                              ))}
                            </ul>
                          </Box>

                          <Box component="fieldset" className="fieldset_wrap">
                            <legend className="fldset_lgend">
                              Afternoon Slots
                            </legend>
                            <ul className="time_box">
                              {timeBuckets.afternoon.map((time) => (
                                <li
                                  key={time}
                                  onClick={() =>
                                    handleTimeSlotClick(time, setFieldValue)
                                  }
                                  style={{
                                    background:
                                      selectedTimeSlot === time
                                        ? "#20ada0"
                                        : "",
                                    color:
                                      selectedTimeSlot === time
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  {time}
                                </li>
                              ))}
                            </ul>
                          </Box>

                          <Box component="fieldset" className="fieldset_wrap">
                            <legend className="fldset_lgend">
                              Evening Slots
                            </legend>
                            <ul className="time_box">
                              {timeBuckets.evening.map((time) => (
                                <li
                                  key={time}
                                  onClick={() =>
                                    handleTimeSlotClick(time, setFieldValue)
                                  }
                                  style={{
                                    background:
                                      selectedTimeSlot === time
                                        ? "#20ada0"
                                        : "",
                                    color:
                                      selectedTimeSlot === time
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  {time}
                                </li>
                              ))}
                            </ul>
                          </Box>

                          <Box component="fieldset" className="fieldset_wrap">
                            <legend className="fldset_lgend">
                              Night Slots
                            </legend>
                            <ul className="time_box">
                              {timeBuckets.night.map((time) => (
                                <li
                                  key={time}
                                  onClick={() =>
                                    handleTimeSlotClick(time, setFieldValue)
                                  }
                                  style={{
                                    background:
                                      selectedTimeSlot === time
                                        ? "#20ada0"
                                        : "",
                                    color:
                                      selectedTimeSlot === time
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  {time}
                                </li>
                              ))}
                            </ul>
                          </Box>
                        </Box>

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
                      <Grid item xs={12} sm={3} md={3}>
                        <Box
                          sx={{ ...priceWrapSx, border: "1px solid #b1b1b1" }}
                        >
                          <Typography className="price_header_txt">
                            Consultation Details
                          </Typography>
                          <Box className="prc_contnt">
                            <Typography className="tx1">
                              {capitalizeFirstLetter(data?.username) ||
                                "Doctor"}
                            </Typography>
                            <Typography className="tx3">
                              <span className="spntx1">Price</span>
                              <span className="spntx2">
                                {values.appointmentDate &&
                                values.appointmentTime &&
                                values.symptomIds.length > 0 &&
                                values.appointmentType
                                  ? `₹${data?.consultationFee}`
                                  : "--"}
                              </span>
                            </Typography>
                            <Typography className="tx4">
                              <span className="spntx1">Total</span>
                              <span className="spntx2">
                                {values.appointmentDate &&
                                values.appointmentTime &&
                                values.symptomIds.length > 0 &&
                                values.appointmentType
                                  ? `₹${data?.consultationFee}`
                                  : "--"}
                              </span>
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
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
                          background: "#20ADA0",
                          borderRadius: "4px",
                          marginLeft: "20px",
                          ":hover": {
                            bgcolor: "#20ADA0",
                            color: "white",
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
                          background: "#20ADA0",
                          borderRadius: "4px",
                          marginLeft: "20px",
                          ":hover": {
                            bgcolor: "#20ADA0",
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
};

export default ModalOne;
